X.context=async()=>{ctx??=new (globalThis.AudioContext||globalThis.webkitAudioContext)();X.audioContext=ctx;return ctx};X.voice=(e,at)=>X.synth(e,at,'triangle',.11);const w3stop=stop;stop=()=>{X.stop();w3stop()};play=ns=>X.play(X.melody(ns,.46),ns.length*.46);
const w3correct=nextCorrect;nextCorrect=n=>{if(task!==1&&!X.need(['pitch-'+task+'-'+rounds[task]]))return;placement=67;w3correct(n)};

function w3Target(){const r=rounds[task],activity=task;const key='pitch-'+activity+'-'+r;const ns=[pickRound(activity)];$('target').onclick=()=>X.listen(key,X.melody(ns,.46),.46)}
const w3match=match;match=()=>{w3match();w3Target()};const w3place=place;place=()=>{w3place();w3Target()};
