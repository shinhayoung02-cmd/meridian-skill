const {execFileSync}=require('child_process'),ff=require('ffmpeg-static');
for(const f of process.argv.slice(2)){const r=execFileSync(ff,['-v','error','-i',f,'-vf','crop=iw:2:0:0,scale=6:2','-f','rawvideo','-pix_fmt','rgb24','-']);console.log(f,'top edge',[...r.slice(0,9)].join(','))}
