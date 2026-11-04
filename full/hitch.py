import sys, subprocess, numpy as np
W,H=480,270; f=sys.argv[1]
p=subprocess.Popen(['ffmpeg','-v','error','-i',f,'-vf',f'scale={W}:{H}','-f','rawvideo','-pix_fmt','gray','-'],stdout=subprocess.PIPE)
prev=None; d=[]
while True:
    b=p.stdout.read(W*H)
    if len(b)<W*H: break
    a=np.frombuffer(b,np.uint8).astype(np.int16)
    if prev is not None: d.append(np.abs(a-prev).mean())
    prev=a
d=np.array(d); print(len(d)+1,'frames')
# 멈칫: 움직이는 중 한 프레임만 거의 0 (앞뒤는 움직임)
for i in range(1,len(d)-1):
    if d[i]<0.15 and d[i-1]>1.0 and d[i+1]>1.0: print(f'repeat {(i+1)/30:7.2f}s  prev {d[i-1]:.2f} next {d[i+1]:.2f}')
# 튐: 앞뒤 대비 갑자기 큰 차이 (컷이 아닌 곳은 직접 확인)
for i in range(2,len(d)-2):
    if d[i]>3*max(d[i-2],d[i-1],d[i+1],d[i+2])+1.5 and d[i]<25: print(f'jump   {(i+1)/30:7.2f}s  {d[i]:.2f} (around {d[i-1]:.2f}/{d[i+1]:.2f})')
