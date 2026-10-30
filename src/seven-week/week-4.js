X.context=async()=>{const c=context();X.audioContext=c;return c};X.voice=(e,at)=>soundAt([e.midi],at,e.dur);const w4stop=stop;stop=()=>{X.stop();w4stop()};
playChord=ps=>{const part=task,st=transformStage,selected=transform;return X.play(ps.map(midi=>({midi,at:0,dur:.9})),.95,()=>{if(part===1&&task===1&&st===transformStage&&selected===transform&&ps[1]===selected)heardChanges.add(selected)})};
playProgression=()=>{const ns=seq.slice(),p=phase;previewed=false;editedPlayed=false;const ev=ns.flatMap((id,i)=>chords[id].ns.map(midi=>({midi,at:i*.85,dur:.78})));X.play(ev,3.4,()=>{if(task!==2||p!==phase||p<2&&ns.join()!==seq.join())return;if(p<2)w4SequenceProof=JSON.stringify(ns);if(p===0)previewed=true;else if(p===1)editedPlayed=true;else if(ns.join()===firstSeq)comparisonHeardOriginal=true;else comparisonHeardEdited=true;if(p===2&&comparisonHeardOriginal&&comparisonHeardEdited){phase=3;stop();finish();drawSequence()}},()=>loop&&phase<2)};
let w4SequenceProof='';const w4sequence=drawSequence;drawSequence=()=>{w4sequence();if(phase<2&&w4SequenceProof!==JSON.stringify(seq)){if(phase===0)previewed=false;else editedPlayed=false}if(phase>=3){$('activity').innerHTML='';setStatus(X.text('Veka er fullført.','Uken er fullført.','Week complete.'),true)}};
const w4name=noteName;noteName=m=>m===57?'A':lang==='en'&&m%12===11?'B':w4name(m);
const w4go=go;go=n=>{if(n<0||n>2||n>0&&!completed[n-1])return;w4go(n)};

const w4Keys=buildKeys;buildKeys=()=>w4Keys().map(k=>({...k,label:(lang==='en'&&k.midi%12===11?'B':k.label)+([60,62,72,74].includes(k.midi)?String(Math.floor(k.midi/12)-1):'')}));
