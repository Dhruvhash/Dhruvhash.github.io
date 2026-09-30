const canvas=document.querySelector('#network'),ctx=canvas.getContext('2d');let reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
let frame=0;let w,h;function size(){const r=canvas.getBoundingClientRect();w=r.width;h=r.height;canvas.width=w*devicePixelRatio;canvas.height=h*devicePixelRatio;ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0)}size();addEventListener('resize',()=>{size();if(reduce)draw(0)});
const pts=Array.from({length:95},(_,i)=>{const y=1-2*i/94,r=Math.sqrt(1-y*y),a=i*2.39996;return [Math.cos(a)*r,y,Math.sin(a)*r]});
function draw(t){ctx.clearRect(0,0,w,h);const a=reduce?.6:t*.00013,R=Math.min(w*.4,h*.36);const projected=pts.map(([x,y,z])=>{const xx=x*Math.cos(a)+z*Math.sin(a),zz=z*Math.cos(a)-x*Math.sin(a);return [w/2+xx*R,h/2+y*R,zz]});for(let i=0;i<pts.length;i++){for(let j=i+1;j<pts.length;j++){if(Math.hypot(...pts[i].map((v,k)=>v-pts[j][k]))<.47){ctx.beginPath();ctx.strokeStyle=`rgba(125,158,255,${.10+(projected[i][2]+1)*.15})`;ctx.moveTo(...projected[i].slice(0,2));ctx.lineTo(...projected[j].slice(0,2));ctx.stroke()}}ctx.beginPath();ctx.fillStyle=`rgba(172,196,255,${.35+(projected[i][2]+1)*.3})`;ctx.arc(projected[i][0],projected[i][1],1.5+(projected[i][2]+1)*.8,0,Math.PI*2);ctx.fill()}if(!reduce)frame=requestAnimationFrame(draw)}frame=requestAnimationFrame(draw);


const motionToggle=document.querySelector('.motion-toggle');
function syncMotion(){if(reduce){cancelAnimationFrame(frame);draw(0);}document.documentElement.dataset.motion=reduce?'paused':'playing';motionToggle.textContent=reduce?'Enable motion':'Pause motion';motionToggle.setAttribute('aria-pressed',String(reduce));}
syncMotion();motionToggle.addEventListener('click',()=>{reduce=!reduce;syncMotion();if(!reduce)frame=requestAnimationFrame(draw)});
matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change',e=>{const wasPaused=reduce;reduce=e.matches;syncMotion();if(wasPaused&&!reduce)frame=requestAnimationFrame(draw)});
const progress=document.querySelector('.reading-progress');let scrollPending=false;
function updateProgress(){const max=document.documentElement.scrollHeight-innerHeight;progress.style.transform='scaleX('+(max>0?scrollY/max:0)+')';scrollPending=false;}
addEventListener('scroll',()=>{if(!scrollPending){scrollPending=true;requestAnimationFrame(updateProgress)}},{passive:true});updateProgress();
if(matchMedia('(hover: hover) and (pointer: fine)').matches){document.querySelectorAll('.project').forEach(card=>{card.addEventListener('pointermove',e=>{if(reduce)return;const r=card.getBoundingClientRect();card.style.setProperty('--pointer-x',(e.clientX-r.left)+'px');card.style.setProperty('--pointer-y',(e.clientY-r.top)+'px')})});}


