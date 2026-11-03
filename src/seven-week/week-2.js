X.context=async()=>{const c=await context();X.audioContext=c;return c};X.voice=(e,at)=>beep(ctx,e.midi,at,e.dur);const w2stop=stopAudio;stopAudio=()=>{X.stop();w2stop()};
play=(ns,step=.36)=>X.play(X.melody(ns,step),ns.length*step);
const w2compare=renderCompare;renderCompare=()=>{w2compare();const d=compareData();for(const [id,ns]of [['ref',d.r],['playA',d.matchA?d.r:d.changed],['playB',d.matchA?d.changed:d.r]])$(id).onclick=()=>X.listen('compare-'+compareRound+'-'+id,X.melody(ns),ns.length*.36);if(completed[0])$('answerA').disabled=$('answerB').disabled=true};
const w2answer=answerCompare;answerCompare=ok=>{if(completed[0])return;stopAudio();w2answer(ok)};
const w2memory=renderMemory;renderMemory=()=>{w2memory();$('listen').onclick=()=>X.listen('memory-'+melRound,X.melody(expectedMelody(),.42),4*.42);const ref=document.createElement('button');ref.type='button';ref.textContent=X.text('Referansetone C','Referansetone C','Reference C');ref.onclick=()=>play([60]);$('activity').append(ref);if(completed[2])w2DisableFinishedMemory()};
const w2check=checkMemory;checkMemory=()=>{if(completed[2])return;stopAudio();w2check();if(completed[2])w2DisableFinishedMemory()};

function w2DisableFinishedMemory(){for(const b of $('activity').querySelectorAll('[data-pitch],#checkNotes,#undo,#clear'))b.disabled=true}

const w2orderRender=renderOrder;renderOrder=()=>{w2orderRender();if(completed[1])$('checkOrder').disabled=true};
