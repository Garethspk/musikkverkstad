X.context=async()=>{ctx??=new (globalThis.AudioContext||globalThis.webkitAudioContext)();X.audioContext=ctx;return ctx};X.voice=(e,at)=>X.synth(e,at,'triangle',.11);const w3stop=stop;stop=()=>{X.stop();w3stop()};play=ns=>X.play(X.melody(ns,.46),ns.length*.46);
// Correct pitch/name/placement is the answer criterion. A playback receipt is not.
const w3correct=nextCorrect;nextCorrect=n=>{if(completed[task])return;stop();$('adapt').innerHTML='';placement=67;w3correct(n);w3Progress(n)};

function w3Target(){const r=rounds[task],activity=task;const key='pitch-'+activity+'-'+r;const ns=[pickRound(activity)];$('target').onclick=()=>X.listen(key,X.melody(ns,.46),.46)}
function w3Progress(total){
  const count=Math.min(rounds[task],total),number=Math.min(count+1,total);
  let chip=$('activity').querySelector('.chip');
  if(!chip){chip=document.createElement('p');chip.className='chip';$('activity').prepend(chip)}
  chip.textContent=X.text('Spørsmål ','Spørsmål ','Question ')+number+'/'+total;
  $('progress').textContent=X.text('Rette svar: ','Riktige svar: ','Correct answers: ')+count+'/'+total;
  if(completed[task])for(const b of $('activity').querySelectorAll('[data-answer],#verify'))b.disabled=true;
}
const w3match=match;match=()=>{w3match();w3Target();w3Progress(3)};
const w3place=place;place=()=>{w3place();w3Target();w3Progress(4)};
const w3quiz=quiz;quiz=()=>{
  const pitch=pickRound(1);w3quiz();const controls=document.createElement('div');controls.className='controls';
  const hear=document.createElement('button');hear.id='hearNote';hear.type='button';
  hear.textContent=X.text('Høyr tonen','Hør tonen','Hear the note');
  hear.onclick=()=>play([pitch]);controls.append(hear);
  $('activity').querySelector('.noteQuestion').after(controls);w3Progress(5);
};
