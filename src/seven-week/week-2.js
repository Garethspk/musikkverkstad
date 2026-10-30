X.context=async()=>{const c=await context();X.audioContext=c;return c};X.voice=(e,at)=>beep(ctx,e.midi,at,e.dur);const w2stop=stopAudio;stopAudio=()=>{X.stop();w2stop()};
play=(ns,step=.36)=>X.play(X.melody(ns,step),ns.length*step);
const w2compare=renderCompare;renderCompare=()=>{w2compare();const d=compareData();for(const [id,ns]of [['ref',d.r],['playA',d.matchA?d.r:d.changed],['playB',d.matchA?d.changed:d.r]])$(id).onclick=()=>X.listen('compare-'+compareRound+'-'+id,X.melody(ns),ns.length*.36)};
const w2answer=answerCompare;answerCompare=ok=>{if(!X.need(['ref','playA','playB'].map(k=>'compare-'+compareRound+'-'+k)))return;w2answer(ok)};
const w2memory=renderMemory;renderMemory=()=>{w2memory();$('listen').onclick=()=>X.listen('memory-'+melRound,X.melody(expectedMelody(),.42),4*.42);const ref=document.createElement('button');ref.type='button';ref.textContent=X.text('Referansetone C','Referansetone C','Reference C');ref.onclick=()=>play([60]);$('activity').append(ref)};
const w2check=checkMemory;checkMemory=()=>{if(X.need(['memory-'+melRound]))w2check()};
