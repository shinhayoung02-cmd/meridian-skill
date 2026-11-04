import sys, subprocess, numpy as np
W,H=960,540; f=sys.argv[1]
p=subprocess.Popen(['ffmpeg','-v','error','-i',f,'-vf',f'scale={W}:{H}','-f','rawvideo','-pix_fmt','gray','-'],stdout=subprocess.PIPE)
i=0; bad=[]
while True:
    b=p.stdout.read(W*H)
    if len(b)<W*H: break
    a=np.frombuffer(b,np.uint8).reshape(H,W).astype(int)
    xs=np.arange(20,W-20,4); ys=np.arange(20,H-20,4)
    e={'top':(a[0,xs]-a[6,xs]>60).sum(),'bot':(a[H-1,xs]-a[H-7,xs]>60).sum(),'left':(a[ys,0]-a[ys,6]>60).sum(),'right':(a[ys,W-1]-a[ys,W-7]>60).sum()}
    if sum(e.values())>30: bad.append((round(i/30,2),{k:int(v) for k,v in e.items() if v}))
    i+=1
print(i,'frames;',len(bad),'flagged')
for t,e in bad: print(t,e)
