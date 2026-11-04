import cv2, numpy as np, subprocess, glob, os, sys
P=sys.argv[1]; fs=sorted(glob.glob(P+'/*.mp4'))
def fr(f, last):
    a=['ffmpeg','-v','error']+(['-sseof','-0.04'] if last else [])+['-i',f,'-frames:v','1','-update','1','-f','image2pipe','-vcodec','png','-']
    return cv2.imdecode(np.frombuffer(subprocess.run(a,capture_output=True).stdout,np.uint8),0).astype(np.float32)
for x,y in zip(fs,fs[1:]):
    a=fr(x,True); b=fr(y,False); diff=np.abs(a-b).mean()
    try: w=cv2.findTransformECC(b,a,np.eye(2,3,dtype=np.float32),cv2.MOTION_AFFINE,(3,100,1e-6),None,5)[1]; s=f"scale {w[0,0]:.4f} dx {w[0,2]:.1f} dy {w[1,2]:.1f}"
    except Exception as e: s='ecc fail'
    print(f"{os.path.basename(x)[:34]:34} -> {os.path.basename(y)[:30]:30} diff {diff:5.1f} {s}")
