const {execFileSync}=require('child_process');const ff=require('ffmpeg-static');
const pairs=[['L01','01_boarding'],['L02','02_scanning'],['L03','03_welcome_drink'],['L04','04_choose_drink'],['L05','05_champagne'],['L06','06_diet'],['L07','07_first_meal'],['L08','08_sleep'],['L09','09_wake_meal'],['L10','10_wake_method'],['L11','11_schedule']];
const W=512,H=288;
const raw=f=>execFileSync(ff,['-v','error','-i',f,'-vf',`scale=${W}:${H},format=gray`,'-f','rawvideo','-']);
for(const [a,b] of pairs){const A=raw('full/s/'+a+'.png'),B=raw('lounge/screens2x/'+b+'.png');let x0=W,y0=H,x1=-1,y1=-1,n=0;
for(let y=0;y<H;y++)for(let x=0;x<W;x++){if(x<3||y<3||x>W-4||y>H-4)continue;const d=Math.abs(A[y*W+x]-B[y*W+x]);if(d>40){n++;x0=Math.min(x0,x);y0=Math.min(y0,y);x1=Math.max(x1,x);y1=Math.max(y1,y);}}
console.log(a,b,n, n?`box ${x0*4},${y0*4} - ${x1*4},${y1*4} (2048 coords)`:'same');}
