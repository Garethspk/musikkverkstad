X.context=async()=>{const c=await context();X.audioContext=c;return c};X.voice=(e,at)=>toneAt(at,440*2**((e.midi-69)/12),e.dur,.12,'triangle');
const w1stop=stopSound;stopSound=()=>{X.stop();pulseRun++;w1stop()};
const w1pulse=renderPulse;renderPulse=()=>{
  w1pulse();const button=$('tap');
  button.onpointerdown=e=>{if(e.isPrimary!==false&&e.button===0){e.preventDefault();onTap(e)}};
  button.onkeydown=e=>{if(e.key===' '||e.key==='Enter'){e.preventDefault();if(!e.repeat)onTap(e)}};
  // Assistive-technology click activation has no pointer event. Keyboard defaults
  // are suppressed above, so one gesture cannot be counted twice.
  button.onclick=e=>{if(e.detail===0)onTap(e)};
  $('status').setAttribute('aria-live','polite');
};
playBars=()=>{if(completed[2]||buildPlaying||!bars.every((_,i)=>barSum(i)===4))return;if(buildRound===1&&!changedSinceBaseline())return show(T().buildChange,'error');if(buildRound===2&&restCount()<=buildRestCount)return show(T().buildRestMore,'error');stopSound();const snapshot=JSON.stringify(bars),stage=buildRound;let at=0;const events=[];for(let bi=0;bi<4;bi++)for(const id of bars[bi]){const n=ALL[id];events.push({midi:n.rest?null:bi%2===0?67:69,at:at*.36,dur:n.duration*.36-.05});at+=n.duration}buildPlaying=true;playedBuild=false;const cycle=()=>X.play(events,16*.36,()=>{if(task!==2||stage!==buildRound||snapshot!==JSON.stringify(bars))return;buildCycles++;if(loopBuild){cycle();return}buildPlaying=false;playedBuild=true;finishBuildRound()});buildCycles=0;cycle();$('stopbars').disabled=false};
const w1build=renderBuild;renderBuild=()=>{w1build();$('stopbars').onclick=()=>{const earned=buildCycles>0&&buildPlaying;stopSound();playedBuild=earned;if(earned)finishBuildRound();renderBuild()};$('loopbars').onchange=e=>{loopBuild=e.target.checked;if(!loopBuild&&buildPlaying){const earned=buildCycles>0&&buildPlaying;stopSound();playedBuild=earned;if(earned)finishBuildRound();renderBuild()}};for(const b of document.querySelectorAll('[data-remove]'))b.setAttribute('aria-label',X.text('Fjern note','Fjern note','Remove note'))};
// Editing always invalidates the frozen playback version; original tap/drag controls remain.
const w1append=appendToBar;appendToBar=(...args)=>{stopSound();w1append(...args)};
let pulseAudioStart=0,pulseClockSource='',pulseAssessment=null;
const pulseFeedback={
  nn:{few:n=>`Eg registrerte ${n} trykk. Høyr første runden, og trykk på kvart jamne slag gjennom begge dei to siste rundane.`,fast:'Trykka kom for tett. Prøv eitt trykk på kvart jamne slag, ikkje på alle dei korte lydane i rytmen.',slow:'Trykka kom for sjeldan. Høyr etter kvart jamne slag og prøv å følgja det heile vegen.',uneven:'Avstanden mellom trykka varierte. Prøv å halda like lang tid mellom trykka, sjølv om rytmen har korte lydar mellom slaga.',coverage:'Hald fram med jamne trykk gjennom begge dei to siste rundane, heilt til rytmen er ferdig.',success:'Du heldt ein jamn puls! Neste oppgåve er no open.',audio:'Lyden kunne ikkje starta. Trykk Start rytmen for å prøva igjen.',paused:'Lyden vart avbroten. Trykk Start rytmen og prøv igjen.'},
  nb:{few:n=>`Jeg registrerte ${n} trykk. Hør første runde, og trykk på hvert jevne slag gjennom begge de to siste rundene.`,fast:'Trykkene kom for tett. Prøv ett trykk på hvert jevne slag, ikke på alle de korte lydene i rytmen.',slow:'Trykkene kom for sjelden. Hør etter hvert jevne slag og prøv å følge det hele veien.',uneven:'Avstanden mellom trykkene varierte. Prøv å holde like lang tid mellom trykkene, selv om rytmen har korte lyder mellom slagene.',coverage:'Fortsett med jevne trykk gjennom begge de to siste rundene, helt til rytmen er ferdig.',success:'Du holdt en jevn puls! Neste oppgave er nå åpen.',audio:'Lyden kunne ikke starte. Trykk Start rytmen for å prøve igjen.',paused:'Lyden ble avbrutt. Trykk Start rytmen og prøv igjen.'},
  en:{few:n=>`I registered ${n} taps. Listen to the first round, then tap each steady beat throughout both final rounds.`,fast:'The taps were too close together. Try one tap for each steady beat, rather than every short sound in the rhythm.',slow:'The taps were too far apart. Listen for each steady beat and try to follow it all the way.',uneven:'The gaps between taps varied. Try to leave the same time between taps, even when the rhythm has short sounds between beats.',coverage:'Keep tapping steadily through both final rounds, until the rhythm finishes.',success:'You kept a steady pulse! The next activity is now unlocked.',audio:'Audio could not start. Press Start rhythm to try again.',paused:'Audio was interrupted. Press Start rhythm and try again.'}
};
function pulseSnapshot(){
  let outputTimestamp;try{outputTimestamp=audio.getOutputTimestamp?.()}catch{}
  return Pulse.timeline({performanceTime:performance.now(),contextTime:audio.currentTime,
    outputTimestamp,baseLatency:audio.baseLatency,outputLatency:audio.outputLatency});
}
function pulseElapsed(at,snapshot=pulseSnapshot()){
  pulseClockSource=snapshot.source;
  return (snapshot.contextTime+(at-snapshot.performanceTime)/1000-pulseAudioStart)*1000;
}
onTap=event=>{
  if(!pulseRunning||task!==0||audio?.state!=='running')return;
  const now=performance.now(),input=Pulse.eventTime(event?.timeStamp,now,performance.timeOrigin);
  const elapsed=pulseElapsed(input);
  if(elapsed>=4*pulseDuration&&elapsed<12*pulseDuration+Pulse.tailMs){
    pulseTimes.push(elapsed);$('tapcount').textContent=`${T().pulseCount}: ${pulseTimes.length}`;
  }
};
scorePulse=()=>{
  pulseAssessment=Pulse.assess(pulseTimes,pulseDuration);
  const words=pulseFeedback[lang];
  if(pulseAssessment.ok){
    completed[0]=true;renderNav();$('next').disabled=false;$('progress').textContent='✓';show(words.success,'success');
  }else show(pulseAssessment.reason==='few'?words.few(pulseAssessment.taps):words[pulseAssessment.reason],'error');
};
startPulse=async()=>{
  stopSound();const token=X.token,run=++pulseRun;
  pulseTimes=[];pulseAssessment=null;show('');$('tapcount').textContent='';
  $('pulseinfo').textContent=T().pulseWaiting;$('startpulse').disabled=true;$('tap').disabled=true;
  try{
    const c=await context();await c.resume();if(token!==X.token||task!==0)return;
    pulseAudioStart=c.currentTime+.16;pulseRunning=true;
    const snapshot=pulseSnapshot(),now=performance.now();pulseStart=now-pulseElapsed(now,snapshot);
    for(let n=0;n<12;n++){
      toneAt(pulseAudioStart+n*pulseDuration/1000,n%4===0?220:165,.065,.14,'triangle');
      if(n%4===1||n%4===3)toneAt(pulseAudioStart+(n+.5)*pulseDuration/1000,390,.055,.07,'sine');
    }
    const tick=()=>{
      if(token!==X.token||run!==pulseRun||task!==0)return;
      if(c.state!=='running'){stopSound();renderPulse();show(pulseFeedback[lang].paused,'error');return}
      const now=performance.now(),delta=pulseElapsed(now),beat=Math.floor(delta/pulseDuration);
      pulseStart=now-delta;
      for(const [i,e]of [...$('pulsebeat').children].entries())e.classList.toggle('on',delta>=0&&beat<12&&i===beat%4);
      $('progress').textContent=T().pulseProgress+' '+Math.min(3,Math.max(0,Math.floor(beat/4)+1))+'/3';
      if(delta>=4*pulseDuration){$('tap').disabled=false;$('pulseinfo').textContent=T().pulseGo}
      if(delta>=12*pulseDuration+Pulse.tailMs){
        pulseRunning=false;$('tap').disabled=true;$('startpulse').disabled=false;scorePulse();return;
      }
      pulseTimer=setTimeout(tick,32);
    };tick();
  }catch{
    if(token!==X.token||task!==0)return;
    stopSound();renderPulse();show(pulseFeedback[lang].audio,'error');
  }
};
