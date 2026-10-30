/* Per-week bridge loaded after the original script and reviewed corrections. */
const BP=window.BOOT;let lastComplete='',navigationEpoch=0;
function progressValues(){return BP.week===5||BP.week===6||BP.week===7?complete:completed}
function refreshWeek(){if(BP.week===1||BP.week===5||BP.week===6)render();else if(BP.week===2||BP.week===3)refresh();else if(BP.week===4)updateLocale();else draw()}
function stopWeek(){navigationEpoch++;X.stop();if(BP.week===1)stopSound();else if(BP.week===2)stopAudio();else if(BP.week===7)silence();else stop();if(BP.week===1&&task===0)renderPulse()}
function localeWeek(value){stopWeek();if(BP.week===7)language=value;else lang=value;refreshWeek();document.documentElement.lang=value}
function emitProgress(){const state=JSON.stringify(progressValues());if(state!==lastComplete){lastComplete=state;parent.postMessage({type:'progress',session:BP.session,week:BP.week,completed:progressValues().slice()},'*')}}
// Parent grants no completion: only the immutable child source reports it.
const cv=progressValues();for(let i=0;i<3;i++)cv[i]=BP.completed[i];localeWeek(BP.locale);
for(const el of document.querySelectorAll('header,.topbar'))el.hidden=true;
for(const el of document.querySelectorAll('#week,.week-selector'))el.hidden=true;
for(const el of document.querySelectorAll('#restart'))el.hidden=true;
for(const selector of ['#weekTitle','#weekHead','#weekHeadings']){const e=document.querySelector(selector);if(e)e.hidden=true}
const resize=new ResizeObserver(()=>parent.postMessage({type:'size',session:BP.session,height:Math.max(document.body.getBoundingClientRect().height,500)},'*'));resize.observe(document.body);
const observer=new MutationObserver(()=>{emitProgress();for(const e of document.querySelectorAll('button')){if(!e.hasAttribute('type'))e.type='button'} });observer.observe(document.body,{childList:true,subtree:true});
addEventListener('message',e=>{const v=e.data;if(e.source!==parent||!v||v.session!==BP.session)return;if(v.type==='stop'){stopWeek();parent.postMessage({type:'stopped',session:BP.session},'*')}if(v.type==='language'&&['nn','nb','en'].includes(v.locale))localeWeek(v.locale)});
document.addEventListener('click',e=>{if(e.target.closest('#prev,#back,#next,[data-index],[data-t],[data-task],[data-i]')){navigationEpoch++;X.stop();parent.postMessage({type:'top',session:BP.session},'*')}} ,true);
// Page-wide language and navigation cancellation, including original stale timers.
document.addEventListener('change',e=>{if(e.target.id==='lang')stopWeek()},true);
const savedTimeout=window.setTimeout;window.setTimeout=(fn,ms,...args)=>{const taskBefore=task,epoch=navigationEpoch;return savedTimeout(()=>{if(task!==taskBefore||epoch!==navigationEpoch)return;fn(...args)},ms)};
X.restoreFocus=(fn)=>{const active=document.activeElement,key=active?.id;fn();if(key)document.getElementById(key)?.focus({preventScroll:true})};
parent.postMessage({type:'ready',session:BP.session,week:BP.week},'*');emitProgress();

document.addEventListener('click',e=>{if(BP.week===1&&e.target.closest('[data-remove],#undo,#clear'))stopSound()},true);

document.documentElement.dataset.weekReady=String(BP.week);

document.addEventListener('visibilitychange',()=>{if(document.hidden)stopWeek()});
let focusKey=null;document.addEventListener('click',e=>{const b=e.target.closest('button');if(b)focusKey={id:b.id,data:Object.entries(b.dataset)}},true);const focusObserver=new MutationObserver(()=>{if(!document.hasFocus()||document.activeElement!==document.body||!focusKey)return;const b=focusKey.id?document.getElementById(focusKey.id):[...document.querySelectorAll('button')].find(b=>focusKey.data.length&&focusKey.data.every(([k,v])=>b.dataset[k]===v));if(b&&!b.disabled)b.focus({preventScroll:true})});focusObserver.observe(document.body,{childList:true,subtree:true});
// Completion survives week changes; unfinished answers and creative drafts do not.
// Say so explicitly instead of presenting a restored drill counter as saved work.
const reviewNotice=new MutationObserver(()=>{const remembered=BP.completed[task];let note=document.getElementById('restoredCompletion');if(remembered&&!note){note=document.createElement('p');note.id='restoredCompletion';note.setAttribute('role','note');document.getElementById('activity').before(note)}if(note){const text=remembered?X.text('Denne oppgåva er registrert som fullført tidlegare i fana. Døma kan høyrast igjen. Tidlegare svar og eigne utkast er ikkje lagra.','Denne oppgaven er registrert som fullført tidligere i fanen. Eksemplene kan høres igjen. Tidligere svar og egne utkast er ikke lagret.','This task was completed earlier in this tab. You can listen again. Earlier answers and creative drafts were not saved.'):'';if(note.textContent!==text)note.textContent=text;note.hidden=!remembered;const progress=document.getElementById('progress')||document.getElementById('current');if(remembered&&progress&&progress.textContent!=='✓')progress.textContent='✓'}});reviewNotice.observe(document.body,{childList:true,subtree:true});refreshWeek();
