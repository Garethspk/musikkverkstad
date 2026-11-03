X.context=async()=>{const c=ctx();X.audioContext=c;return c};X.voice=(e,at)=>X.synth(e,at,e.accent?'triangle':'sine',e.accent?.19:.085);const w7stop=silence;silence=()=>{X.stop();w7stop();clearBarHighlights()};
notes=(events,step=.35,onEnd)=>{const tsk=task,key='meter-'+count;return X.play(events.map((v,i)=>({midi:v===0?null:v===2?69:64,accent:v===2,at:i*step,dur:step*.66})),events.length*step,()=>{if(tsk===0)X.heard.add(key);if(onEnd)onEnd()})};
phrase=(meter,variant=0)=>{const pattern=meter==='3/4'?[2,1,1]:meter==='4/4'?[2,1,1,1]:[2,1,1,2,1,1];return Array.from({length:4},(_,j)=>pattern.map((v,i)=>v!==2&&(j+variant+i)%5===0?0:v)).flat()};
const w7draw1=draw1;draw1=()=>{w7draw1();for(const b of $('activity').querySelectorAll('[data-meter]')){b.disabled=complete[0];const old=b.onclick;b.onclick=()=>{if(complete[0])return;old()}}};
const w7initialise=initialise;initialise=meter=>{const a=w7initialise(meter);if(meter==='6/8')a.forEach(b=>b[3]=2);return a};

let barReview=false;
function barText(){return {
  nn:{instruction:m=>`I ${m}/4 er det ${m===3?'tre':'fire'} slag i kvar takt. Set ein taktstrek etter kvart ${m===3?'tredje':'fjerde'} slag. Ytterstrekane er sette inn.`,swipe:'Sveip sidelengs for å sjå alle 12 slaga.',strip:'Tolv slag med valbare taktstrekar mellom slaga',after:'Etter slag ',add:'Set taktstrek ',remove:'Fjern taktstrek ',many:'Du har valt for mange taktstrekar.',few:'Du manglar taktstrekar.',positions:'Nokre taktstrekar står på feil plass.',extra:'Fjern streken etter slag ',missing:'Set ein strek etter slag ',good:'Rett! Høyr korleis slaga blir grupperte i taktar.',next:'Vidare til 4/4 →',done:'Begge taktartane er fullførte. Neste oppgåve er open.'},
  nb:{instruction:m=>`I ${m}/4 er det ${m===3?'tre':'fire'} slag i hver takt. Sett en taktstrek etter hvert ${m===3?'tredje':'fjerde'} slag. Ytterstrekene er satt inn.`,swipe:'Sveip sidelengs for å se alle 12 slagene.',strip:'Tolv slag med valgbare taktstreker mellom slagene',after:'Etter slag ',add:'Sett taktstrek ',remove:'Fjern taktstrek ',many:'Du har valgt for mange taktstreker.',few:'Du mangler taktstreker.',positions:'Noen taktstreker står på feil plass.',extra:'Fjern streken etter slag ',missing:'Sett en strek etter slag ',good:'Riktig! Hør hvordan slagene grupperes i takter.',next:'Videre til 4/4 →',done:'Begge taktartene er fullført. Neste oppgave er åpen.'},
  en:{instruction:m=>`In ${m}/4 there are ${m===3?'three':'four'} beats in each bar. Place a barline after every ${m===3?'third':'fourth'} beat. The outer barlines are already given.`,swipe:'Swipe sideways to see all 12 beats.',strip:'Twelve beats with selectable barlines between them',after:'After beat ',add:'Add barline ',remove:'Remove barline ',many:'You selected too many barlines.',few:'Some barlines are missing.',positions:'Some barlines are in the wrong positions.',extra:'Remove the line after beat ',missing:'Add a line after beat ',good:'Correct! Hear how the beats group into bars.',next:'Continue to 4/4 →',done:'Both metres are complete. The next activity is unlocked.'}
}[language]}
function clearBarHighlights(){for(const e of document.querySelectorAll('[data-bar-beat]'))e.classList.remove('bar-playing','bar-accent')}
async function playBarReference(meter){
  await notes(Array.from({length:12},(_,i)=>i%meter===0?2:1),.36,clearBarHighlights);
  if(!X.busy||task!==1)return;const token=X.token,start=X.startedAt;
  const paint=()=>{
    if(token!==X.token||task!==1)return;
    const beat=Math.floor((X.audioContext.currentTime-start)/.36);
    for(const e of document.querySelectorAll('[data-bar-beat]')){
      const on=+e.dataset.barBeat===beat&&beat>=0&&beat<12;
      e.classList.toggle('bar-playing',on);e.classList.toggle('bar-accent',on&&beat%meter===0);
    }
    if(beat<12)requestAnimationFrame(paint);else clearBarHighlights();
  };paint();
}
draw2=()=>{
  const w=t(),b=barText(),previousScroll=$('activity').querySelector('.meter-strip')?.scrollLeft||0;
  if(complete[1]){barStage=1;barReview=true;if(!barLines.size)barLines=new Set(Barlines.required(4))}
  const meter=barStage===0?3:4;
  $('intro').textContent=b.instruction(meter);
  $('progress').textContent=(barStage+(barReview?1:0))+'/2';
  $('activity').innerHTML=`<style>
    .bodygrid>.panel{min-width:0}
    .metric .counter{background:var(--lime);color:#172739}
    .meter-strip{display:flex;overflow-x:auto;padding:8px 24px;border-block:1px solid var(--line);margin:14px 0;scroll-padding:24px}
    .meter-beat{position:relative;flex:0 0 72px;min-height:68px;display:grid;place-items:center}
    .meter-beat>span{display:grid;place-items:center;width:28px;height:34px;border:1px solid var(--line);border-radius:9px;background:var(--panel)}
    .meter-beat:first-child:before,.meter-beat:last-child:after{content:'┃';position:absolute;font-size:35px;left:-12px}
    .meter-beat:last-child:after{left:auto;right:-12px}
    .meter-boundary{position:absolute;left:50px;top:0;z-index:2;min-width:44px;width:44px;min-height:68px;padding:0;background:transparent;border:0;border-radius:5px;font-size:26px;color:var(--blue)}
    .meter-boundary[aria-pressed=true]{background:transparent;color:var(--lime);font-weight:900}
    .meter-boundary:disabled{opacity:1}.bar-playing>span{outline:3px solid var(--blue)}.bar-accent>span{background:var(--lime);color:#172739;outline-color:var(--lime)}
  </style><div class="metric"><span class="counter">${barStage+1}/2</span><strong>${meter}/4</strong><span>12 ${w.beat.toLowerCase()}</span></div>
  <p class="small">${b.swipe}</p><div class="meter-strip" role="group" aria-label="${b.strip}">
  ${Array.from({length:12},(_,i)=>`<div class="meter-beat" data-bar-beat="${i}"><span>${i+1}</span>${i<11?`<button class="meter-boundary" data-pos="${i+1}" aria-label="${barLines.has(i+1)?b.remove:b.add}${b.after.toLowerCase()}${i+1}" aria-pressed="${barLines.has(i+1)}" ${barReview?'disabled':''}>${barLines.has(i+1)?'┃':'+'}</button>`:''}</div>`).join('')}</div>
  <div class="actions"><button id="hear" class="primary">${w.play}</button><button id="stop">${w.stop}</button><button id="check" ${barReview?'disabled':''}>${w.check}</button><button id="reset" ${barReview?'disabled':''}>${w.clear}</button>${barReview&&barStage===0?`<button id="nextMeter" class="primary">${b.next}</button>`:''}</div>`;
  $('activity').querySelector('.meter-strip').scrollLeft=previousScroll;
  for(const button of $('activity').querySelectorAll('[data-pos]'))button.onclick=()=>{
    silence();const n=+button.dataset.pos;if(barLines.has(n))barLines.delete(n);else barLines.add(n);draw2();
  };
  $('hear').onclick=()=>playBarReference(meter);$('stop').onclick=silence;
  $('reset').onclick=()=>{silence();barLines.clear();draw2();status('')};
  if($('nextMeter'))$('nextMeter').onclick=()=>{silence();barStage=1;barReview=false;barLines.clear();$('activity').querySelector('.meter-strip').scrollLeft=0;draw2();status('')};
  $('check').onclick=()=>{
    if(barReview||complete[1])return;silence();const result=Barlines.inspect(meter,barLines);
    if(!result.ok){
      let feedback=b[result.kind];if(result.extra.length)feedback+=' '+b.extra+result.extra.join(', ')+'.';
      if(result.missing.length)feedback+=' '+b.missing+result.missing.join(', ')+'.';status(feedback);return;
    }
    barReview=true;if(barStage===1)mark();draw2();status(barStage===1?b.done:b.good,true);
  };
};
