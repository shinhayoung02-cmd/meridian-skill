# LOG 45 (2026-11-04): 연결본 이음새 순간 점프(클립마다 흰 줄 방지 오버스캔 크기가 달라서) 부드럽게.
# 조각 목록(l.txt) 이음새마다 앞 끝/뒤 처음 프레임을 ECC로 맞춰 보고, 작은 쪽을 큰 쪽에 맞춰 0.4초 동안 확대→원래로(항상 확대 = 가장자리 노출 없음)
# 사용: python full/smooth_seams.py <pieces 폴더>  → 바뀐 조각은 같은 이름으로 덮어씀(원본은 *_orig.mp4)
import sys, os, subprocess, cv2, numpy as np
P = sys.argv[1]; FF = 'ffmpeg'; N = 12; W, H = 1920, 1080
files = [l.split("'")[1] for l in open(f'{P}/l.txt', encoding='utf-8') if l.strip()]
ENC = ['-an', '-r', '30', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '14', '-preset', 'medium']
def frame(f, last):
    a = [FF, '-v', 'error'] + (['-sseof', '-0.04'] if last else []) + ['-i', f, '-frames:v', '1', '-update', '1', '-f', 'image2pipe', '-vcodec', 'png', '-']
    return cv2.imdecode(np.frombuffer(subprocess.run(a, capture_output=True).stdout, np.uint8), 0).astype(np.float32)
ease = lambda p: 4 * p ** 3 if p < .5 else 1 - (-2 * p + 2) ** 3 / 2
inv = lambda M: cv2.invertAffineTransform(M)
def cover(M):  # 샘플 영역이 화면 밖으로 나가면 가운데 기준으로 조금 더 확대
    for _ in range(20):
        c = np.array([[0, 0, 1], [W, H, 1]], np.float32) @ M.T
        if c[0, 0] >= 0 and c[0, 1] >= 0 and c[1, 0] <= W and c[1, 1] <= H: return M
        M = M.copy(); M[:, :2] *= .998; M[:, 2] = M[:, 2] * .998 + np.array([W, H]) / 2 * .002
    return M
ops = {}  # 파일 → [('head'|'tail', M)]
for x, y in zip(files, files[1:]):
    a, b = frame(x, True), frame(y, False)
    if a.mean() < 20 or b.mean() < 20 or np.abs(a - b).mean() > 20: continue
    try: Wm = cv2.findTransformECC(b, a, np.eye(2, 3, dtype=np.float32), cv2.MOTION_AFFINE, (3, 100, 1e-6), None, 5)[1]
    except cv2.error: continue
    s = (Wm[0, 0] + Wm[1, 1]) / 2
    ops.setdefault(x, []).append(('blend', y))  # 크기를 맞춰도 남는 화질·색 차이(Figma 이미지 vs full2 렌더)는 끝 6프레임 동안 다음 첫 프레임으로 섞음
    if abs(s - 1) < .001 and abs(Wm[0, 2]) < 1 and abs(Wm[1, 2]) < 1: continue
    if s >= 1: ops.setdefault(y, []).append(('head', inv(Wm)))   # 앞이 더 큼 → 뒤 클립 처음을 앞에 맞춰 키웠다가 풀기
    else: ops.setdefault(x, []).append(('tail', Wm))              # 뒤가 더 큼 → 앞 클립 끝을 뒤에 맞춰 키우기
    print(f'{os.path.basename(x)[:30]} | {os.path.basename(y)[:30]}  s={s:.4f} dx={Wm[0,2]:.1f} dy={Wm[1,2]:.1f}')
I = np.eye(2, 3, dtype=np.float32); NB = 6
def first_bgr(y):  # 다음 클립의 (처리 후) 첫 프레임
    a = [FF, '-v', 'error', '-i', y, '-frames:v', '1', '-f', 'image2pipe', '-vcodec', 'png', '-']
    im = cv2.imdecode(np.frombuffer(subprocess.run(a, capture_output=True).stdout, np.uint8), 1)
    for kind, M in ops.get(y, []):
        if kind == 'head': im = cv2.warpAffine(im, cover(M), (W, H), flags=cv2.INTER_CUBIC | cv2.WARP_INVERSE_MAP, borderMode=cv2.BORDER_REPLICATE)
    return im.astype(np.float32)
for f, lst in ops.items():
    lst = sorted([(k, first_bgr(v) if k == 'blend' else v) for k, v in lst], key=lambda z: z[0] == 'blend')
    n = int(round(float(subprocess.run(['ffprobe', '-v', 'error', '-count_packets', '-select_streams', 'v:0', '-show_entries', 'stream=nb_read_packets', '-of', 'csv=p=0', f], capture_output=True, text=True).stdout)))
    orig = f[:-4] + '_orig.mp4'
    if not os.path.exists(orig): os.replace(f, orig)
    dec = subprocess.Popen([FF, '-v', 'error', '-i', orig, '-f', 'rawvideo', '-pix_fmt', 'bgr24', '-'], stdout=subprocess.PIPE)
    enc = subprocess.Popen([FF, '-y', '-v', 'error', '-f', 'rawvideo', '-pix_fmt', 'bgr24', '-s', f'{W}x{H}', '-r', '30', '-i', '-'] + ENC + [f], stdin=subprocess.PIPE)
    for i in range(n):
        buf = dec.stdout.read(W * H * 3)
        if len(buf) < W * H * 3: break
        im = np.frombuffer(buf, np.uint8).reshape(H, W, 3)
        for kind, M in lst:
            if kind == 'blend':
                if i >= n - NB: b = ease((i - (n - NB) + 1) / (NB + 1)); im = (im.astype(np.float32) * (1 - b) + M * b).clip(0, 255).astype(np.uint8)
                continue
            k = None
            if kind == 'head' and i < N: k = 1 - ease(i / N)          # 처음 프레임 = 앞 클립 크기 → 원래로
            if kind == 'tail' and i >= n - N: k = ease((i - (n - N) + 1) / N)  # 끝 프레임 = 뒤 클립 크기
            if k: im = cv2.warpAffine(im, cover(I + (M - I) * k), (W, H), flags=cv2.INTER_CUBIC | cv2.WARP_INVERSE_MAP, borderMode=cv2.BORDER_REPLICATE)
        enc.stdin.write(np.ascontiguousarray(im).tobytes())
    enc.stdin.close(); enc.wait(); dec.wait(); print('smoothed', os.path.basename(f), [k for k, _ in lst])
