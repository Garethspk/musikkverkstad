'use strict';
const SC=SchoolConfig, byId=id=>document.getElementById(id), DRAFT='musikkverkstad-school-draft-v1';
let current=SC.defaults(), busy=false, packageCandidate=null, templatePromise=null, previewSession=null;
function message(text){byId('message').textContent=text;}
function statusBusy(value){busy=value;for(const el of document.querySelectorAll('button,input,select'))el.disabled=value;}
function buildOptions(){
  for(const [id,preset]of Object.entries(SC.presets)){const option=document.createElement('option');option.value=id;option.textContent=preset.name;byId('colourPreset').append(option);}
  for(const item of SC.availableRegistry){
    const group=document.createElement('fieldset'), legend=document.createElement('legend');legend.textContent=item.name;group.append(legend);
    if(item.theme){const label=document.createElement('label'),check=document.createElement('input');check.type='checkbox';check.id='theme-'+item.id;label.append(check,' Ta med temaet');group.append(label);}
    const levels=document.createElement('div');levels.className='levels';
    for(const level of item.levels){const label=document.createElement('label'),check=document.createElement('input');check.type='checkbox';check.id=`level-${item.id}-${level}`;label.append(check,'Nivå '+level);levels.append(label);}
    group.append(levels);byId('contentOptions').append(group);
  }
}
function render(value){
  invalidatePackage();
  current=value;byId('schoolName').value=value.schoolName;byId('defaultLanguage').value=value.defaultLanguage;byId('colourPreset').value=value.colourPreset;
  for(const item of SC.availableRegistry){if(item.theme)byId('theme-'+item.id).checked=value.themes.includes(item.id);for(const level of item.levels)byId(`level-${item.id}-${level}`).checked=value.levels[item.id].includes(level);}
  byId('advancedSettings').open=SC.hasRestrictions(value);
  contentStatus();
  byId('logoImage').hidden=!value.logo;if(value.logo)byId('logoImage').src=value.logo;else byId('logoImage').removeAttribute('src');
}
function read(){return SC.validate({schemaVersion:1,schoolName:byId('schoolName').value,logo:current.logo,defaultLanguage:byId('defaultLanguage').value,colourPreset:byId('colourPreset').value,ageGroups:[...current.ageGroups],themes:SC.availableRegistry.filter(r=>r.theme&&byId('theme-'+r.id).checked).map(r=>r.id),levels:Object.fromEntries(SC.availableRegistry.map(r=>[r.id,r.levels.filter(l=>byId(`level-${r.id}-${l}`).checked)]))});}
function contentStatus(){
  try{byId('contentSummary').textContent=SC.hasRestrictions(read())
    ? 'Dette oppsettet har avgrensingar. Sjå «Avanserte innstillingar». Avgrensingane blir tekne vare på ved lagring og nedlasting.'
    : 'Alle tilgjengelege aktivitetar og nivå er med. Du treng ikkje gjere fleire innhaldsval.';
  }catch(error){byId('contentSummary').textContent=error.message;}
}
byId('contentOptions').addEventListener('change',contentStatus);
async function cleanLogo(file){
  if(file.size>SC.MAX_FILE)throw Error('Logoen er for stor (maks 512 KiB).');
  const bytes=new Uint8Array(await file.arrayBuffer());SC.checkImage(bytes,file.type);
  let bitmap;try{bitmap=await createImageBitmap(file);}catch{throw Error('Biletet kunne ikkje lesast. Vel ei gyldig biletfil.');}
  try{
    if(bitmap.width>2048||bitmap.height>2048||bitmap.width*bitmap.height>4000000)throw Error('Logoen har for store biletdimensjonar.');
    const scale=Math.min(1,256/bitmap.width,256/bitmap.height), canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(bitmap.width*scale));canvas.height=Math.max(1,Math.round(bitmap.height*scale));canvas.getContext('2d').drawImage(bitmap,0,0,canvas.width,canvas.height);
    const result=canvas.toDataURL('image/png');SC.validate({...SC.defaults(),logo:result});return result;
  }finally{bitmap.close();}
}
// Decode embedded data without network/fetch (the setup CSP denies connections).
async function normalise(value){if(value.logo){const binary=atob(value.logo.slice(22));value.logo=await cleanLogo(new Blob([Uint8Array.from(binary,c=>c.charCodeAt(0))],{type:'image/png'}));}return value;}
byId('logoFile').addEventListener('change',async e=>{const file=e.target.files[0];if(!file||busy)return;statusBusy(true);try{const logo=await cleanLogo(file);invalidatePackage();current.logo=logo;byId('logoImage').src=logo;byId('logoImage').hidden=false;message('Logoen er kontrollert og klar.');}catch(error){message('Logoen vart avvist. '+error.message);}finally{e.target.value='';statusBusy(false);}});
byId('removeLogo').addEventListener('click',()=>{invalidatePackage();current.logo=null;byId('logoImage').hidden=true;byId('logoImage').removeAttribute('src');message('Logoen er fjerna.');});
byId('exportSettings').addEventListener('click',e=>{e.preventDefault();if(busy)return;try{const value=read(),url=URL.createObjectURL(new Blob([JSON.stringify(value,null,2)+'\n'],{type:'application/json'})),a=document.createElement('a');a.href=url;a.download='musikkverkstad-skule.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);message('Innstillingane er lasta ned. Elevpublisering er framleis blokkert.');}catch(error){message(error.message);}});
byId('saveDraft').addEventListener('click',()=>{try{localStorage.setItem(DRAFT,JSON.stringify(read()));message('Utkastet er lagra berre i denne nettlesaren. Last òg ned ei JSON-fil.');}catch(error){message('Kunne ikkje lagre utkastet. Last ned innstillingane. '+error.message);}});
byId('resetSettings').addEventListener('click',()=>{render(SC.defaults());try{localStorage.removeItem(DRAFT);}catch{}message('Skjemaet er nullstilt. Elevframgangen er urørt.');});
byId('settingsFile').addEventListener('change',async e=>{const file=e.target.files[0];if(!file||busy)return;statusBusy(true);try{if(file.size>SC.MAX_JSON)throw Error('Innstillingsfila er for stor.');const value=await normalise(SC.parse(await file.text()));render(value);message('Skuleinnstillingane er importerte.');}catch(error){message('Importen vart avvist. '+error.message);}finally{e.target.value='';statusBusy(false);}});
function invalidatePackage(){packageCandidate=null;previewSession=null;byId('previewViewport').replaceChildren();byId('previewPanel').hidden=true;byId('candidateIdentity').textContent='';}
byId('settingsForm').addEventListener('input',invalidatePackage);
byId('settingsForm').addEventListener('change',invalidatePackage);
async function candidate(){
 const value=read(),key=JSON.stringify(value);
 if(packageCandidate?.key===key){await SchoolPackage.verify(packageCandidate.value);return packageCandidate.value;}
 templatePromise??=SchoolPackage.openTemplate(byId('school-template').textContent,byId('school-template').dataset.sha256);
 const prepared=await SchoolPackage.prepare(await templatePromise,value);packageCandidate={key,value:prepared};return prepared;
}
async function showPreview(prepared,locale){
 const session=Array.from(crypto.getRandomValues(new Uint8Array(16)),b=>b.toString(16).padStart(2,'0')).join('');
 const source=await SchoolPackage.previewDocument(prepared,locale,session),frame=document.createElement('iframe');
 frame.id='pupilPreview';frame.title='Førehandsvising av elevappen';frame.setAttribute('sandbox','allow-scripts');frame.style.cssText='display:block;border:0;width:1100px;height:760px';frame.srcdoc=source;
 previewSession={session,frame,prepared};byId('previewViewport').replaceChildren(frame);byId('previewPanel').hidden=false;
 byId('desktopPreview').setAttribute('aria-pressed','true');byId('mobilePreview').setAttribute('aria-pressed','false');
 byId('candidateIdentity').textContent='Prototypekandidat: '+prepared.manifest.candidateHash+' · Elevpublisering: BLOCKED';
}
async function packageAction(action){
 if(busy)return;statusBusy(true);message('Kontrollerer grunnpakken og skuleinnstillingane …');
 try{const prepared=await candidate();
  if(action==='preview'){await showPreview(prepared,prepared.settings.defaultLanguage);message('Førehandsvisinga er klar. Arbeidet her er berre mellombels.');}
  else{const bytes=await SchoolPackage.zip(prepared),url=URL.createObjectURL(new Blob([bytes],{type:'application/zip'})),link=document.createElement('a');link.href=url;link.download='musikkverkstad-skule-prototype.zip';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);byId('candidateIdentity').textContent='Prototypekandidat: '+prepared.manifest.candidateHash+' · Elevpublisering: BLOCKED';message('Prototypepakken er lasta ned for privat gjennomgang. Pakk ut filene og les PUBLISERING.txt. Elevpublisering er framleis blokkert.');}
 }catch(error){invalidatePackage();message('Kunne ikkje lage prototypepakken: '+error.message);}finally{statusBusy(false);}
}
byId('settingsForm').addEventListener('submit',event=>{event.preventDefault();packageAction('preview');});
byId('downloadPackage').addEventListener('click',()=>packageAction('download'));
byId('closePreview').addEventListener('click',()=>{previewSession=null;byId('previewViewport').replaceChildren();byId('previewPanel').hidden=true;});
for(const [id,width,height]of [['desktopPreview',1100,760],['mobilePreview',390,844]])byId(id).addEventListener('click',()=>{
 if(!previewSession)return;previewSession.frame.style.width=width+'px';previewSession.frame.style.height=height+'px';
 byId('desktopPreview').setAttribute('aria-pressed',String(id==='desktopPreview'));byId('mobilePreview').setAttribute('aria-pressed',String(id==='mobilePreview'));
});
addEventListener('message',async event=>{
 const currentPreview=previewSession,value=event.data;
 if(!currentPreview||busy||event.source!==currentPreview.frame.contentWindow||event.origin!=='null'||!value||typeof value!=='object'||Object.keys(value).sort().join(',')!=='locale,session,type'||value.type!=='musikkverkstad-preview-language'||value.session!==currentPreview.session||!['nn','nb','en'].includes(value.locale))return;
 statusBusy(true);try{await showPreview(currentPreview.prepared,value.locale);}catch(error){invalidatePackage();message(error.message);}finally{statusBusy(false);}
});
buildOptions();render(current);
(async()=>{statusBusy(true);try{const text=localStorage.getItem(DRAFT);if(text)render(await normalise(SC.parse(text)));}catch{message('Det lagra utkastet kunne ikkje lesast. Du kan importere ei trygg kopi.');}finally{statusBusy(false);}})();
