X.context=async()=>{const c=ctx();X.audioContext=c;return c};X.voice=(e,at)=>X.synth(e,at,e.accent?'triangle':'sine',e.accent?.19:.085);const w7stop=silence;silence=()=>{X.stop();w7stop()};
notes=(events,step=.35,onEnd)=>{const tsk=task,key='meter-'+count;return X.play(events.map((v,i)=>({midi:v===0?null:v===2?69:64,accent:v===2,at:i*step,dur:step*.66})),events.length*step,()=>{if(tsk===0)X.heard.add(key);if(onEnd)onEnd()})};
phrase=(meter,variant=0)=>{const pattern=meter==='3/4'?[2,1,1]:meter==='4/4'?[2,1,1,1]:[2,1,1,2,1,1];return Array.from({length:4},(_,j)=>pattern.map((v,i)=>v!==2&&(j+variant+i)%5===0?0:v)).flat()};
const w7draw1=draw1;draw1=()=>{w7draw1();for(const b of $('activity').querySelectorAll('[data-meter]')){const old=b.onclick;b.onclick=()=>{if(complete[0]||!X.need(['meter-'+count]))return;old()}}};
const w7initialise=initialise;initialise=meter=>{const a=w7initialise(meter);if(meter==='6/8')a.forEach(b=>b[3]=2);return a};

const boundaryDraw=draw2;draw2=()=>{boundaryDraw();for(const b of document.querySelectorAll('[data-pos]'))b.setAttribute('aria-label',X.text('Etter slag ','Etter slag ','After beat ')+b.dataset.pos)};
