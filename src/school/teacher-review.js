'use strict';
// Adult review shell only. Reuse the pinned school preview; no pupil runtime/editor change.
const reviewElement=id=>document.getElementById(id);
let reviewSession=null,reviewBusy=false,reviewGeneration=0;
async function reviewOpen(locale='nn'){
 if(reviewBusy)return;const generation=++reviewGeneration;reviewBusy=true;reviewElement('openExercise').disabled=true;
 reviewElement('status').textContent='Kontrollerer den lokale prototypepakken …';
 try{
  const embedded=reviewElement('school-template');
  const template=await SchoolPackage.openTemplate(embedded.textContent,embedded.dataset.sha256);
  const settings=SchoolConfig.defaults();settings.formEnabled=false;settings.schoolName='Stord kulturskule · LÆRARTEST · IKKJE FOR ELEVAR';settings.themes=['groove'];settings.defaultLanguage='nn';
  const prepared=await SchoolPackage.prepare(template,settings);
  const session=Array.from(crypto.getRandomValues(new Uint8Array(16)),b=>b.toString(16).padStart(2,'0')).join('');
  const source=await SchoolPackage.previewDocument(prepared,locale,session);
  // Trusted constant invokes existing Start behaviour: first enabled theme, Listen, level 1.
  // No arbitrary route, settings, HTML or executable code is accepted from messages/URLs.
  const entry='<script>nvStart();</'+'script>';
  if((source.match(/<\/body>/g)||[]).length!==1)throw Error('Ugyldig prøvevising.');
  if(generation!==reviewGeneration)return;
  const frame=document.createElement('iframe');frame.id='teacherPreview';frame.title='Privat lærartest: Finn grooven';frame.setAttribute('sandbox','allow-scripts');frame.srcdoc=source.replace('</body>',entry+'</body>');
  reviewSession={session,frame};reviewElement('reviewViewport').replaceChildren(frame);reviewElement('closeExercise').hidden=false;
  reviewElement('identity').textContent='Kjeldeversjon: '+template.sourceHash+' · Grunnpakke: '+embedded.dataset.sha256+' · Kandidat: '+prepared.manifest.candidateHash+' · pupilRelease=BLOCKED';
  reviewElement('status').textContent='Klar: Lytt, nivå 1. Trykk på lydknappane i ramma. Arbeidet er berre mellombels.';
  frame.scrollIntoView({block:'start'});
 }catch(error){if(generation!==reviewGeneration)return;reviewClose();reviewElement('status').textContent='Kunne ikkje opne øvinga. Be kontaktpersonen om hjelp. '+error.message;}
 finally{reviewBusy=false;reviewElement('openExercise').disabled=false;}
}
function reviewClose(){reviewGeneration++;reviewSession=null;reviewElement('reviewViewport').replaceChildren();reviewElement('closeExercise').hidden=true;reviewElement('status').textContent='Prøveøkta er avslutta og tømd. Ingen lærarsvar er sende.';}
reviewElement('openExercise').addEventListener('click',()=>reviewOpen());
reviewElement('closeExercise').addEventListener('click',reviewClose);
addEventListener('message',event=>{
 const value=event.data,current=reviewSession;
 if(reviewBusy||!current||event.source!==current.frame.contentWindow||event.origin!=='null'||!value||typeof value!=='object'||Object.keys(value).sort().join(',')!=='locale,session,type'||value.type!=='musikkverkstad-preview-language'||value.session!==current.session||!['nn','nb','en'].includes(value.locale))return;
 reviewOpen(value.locale);
});
