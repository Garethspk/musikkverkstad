/* Browser/Node packaging. Only structured settings slots differ per school. */
(function(root,factory){
 if(typeof module==='object'&&module.exports)module.exports=factory(require('./config.js'),require('./package-policy.json'));
 else root.SchoolPackage=factory(root.SchoolConfig,root.SchoolPackagePolicy);
})(typeof globalThis==='object'?globalThis:this,function(SC,policy){
 'use strict';
 const encoder=new TextEncoder(),decoder=new TextDecoder('utf-8',{fatal:true});
 const trustedTemplates=new WeakMap(),trustedCandidates=new WeakMap();
 const limits=Object.freeze(['Berre privat prototypegjennomgang; elevpublisering er BLOCKED.','Ingen godkjenning av fysisk eining, høgtalar, Safari, universell utforming eller elevbruk.','Tilpassa filer arvar ingen release-PASS frå grunnappen.']);
 const slot=/<script id="school-settings" type="application\/json">[^]*?<\/script>/g;
 const fail=message=>{throw Error(message)};
 const json=value=>JSON.stringify(value);
 function safeJSON(value){return json(value).replace(/[<>&\u2028\u2029]/g,c=>'\\u'+c.charCodeAt(0).toString(16).padStart(4,'0'));}
 function pathOK(path){return typeof path==='string'&&path.length<=100&&/^[A-Za-z0-9][A-Za-z0-9._/-]*$/.test(path)&&path.split('/').every(p=>p&&p!=='.'&&p!=='..');}
 function paths(files,expected){
  const names=Object.keys(files);
  if(names.length>policy.maxEntries||names.some(p=>!pathOK(p))||names.length!==expected.length||expected.some(p=>!Object.hasOwn(files,p)))fail('Ugyldige eller manglande filer i pakken.');
  let total=0;
  for(const data of Object.values(files)){if(!(data instanceof Uint8Array)||!data.length||data.length>policy.maxFileBytes)fail('Ei pakkefil er ugyldig eller for stor.');total+=data.length;}
  if(total>policy.maxTotalBytes)fail('Pakken er for stor.');
 }
 async function hash(bytes){if(!globalThis.crypto?.subtle)fail('Opne oppsettfila lokalt eller via HTTPS/localhost for trygg pakkevalidering.');return Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',bytes)),b=>b.toString(16).padStart(2,'0')).join('');}
 function bytesFrom64(value){if(typeof value!=='string'||value.length>policy.maxFileBytes*1.4||value.length%4||!/^[A-Za-z0-9+/]*={0,2}$/.test(value))fail('Ugyldig innebygd fil.');const raw=atob(value);return Uint8Array.from(raw,c=>c.charCodeAt(0));}
 function base64(bytes){let raw='';for(let i=0;i<bytes.length;i+=16384)raw+=String.fromCharCode(...bytes.subarray(i,i+16384));return btoa(raw);}
 async function records(files){return Promise.all(Object.keys(files).sort().map(async path=>({path,size:files[path].length,sha256:await hash(files[path])})));}
 function keys(value,expected){return value&&typeof value==='object'&&!Array.isArray(value)&&Object.keys(value).sort().join(',')===[...expected].sort().join(',');}
 async function openTemplate(raw,expectedHash){
  if(typeof raw!=='string'||raw.length>policy.maxTotalBytes*1.5||!/^([a-f0-9]{64})$/.test(expectedHash))fail('Ugyldig grunnpakke.');
  if(await hash(encoder.encode(raw))!==expectedHash)fail('Grunnpakken er endra eller skadd.');
  const manifest=JSON.parse(raw);
  if(!keys(manifest,['formatVersion','settingsSchemaVersion','sourceHash','pupilRelease','files'])||manifest.formatVersion!==1||manifest.settingsSchemaVersion!==5||manifest.pupilRelease!=='BLOCKED'||!/^[a-f0-9]{64}$/.test(manifest.sourceHash)||!Array.isArray(manifest.files)||manifest.files.length!==policy.templatePaths.length)fail('Grunnpakken er ikkje støtta.');
  const files=Object.create(null);
  for(const entry of manifest.files){
   if(!keys(entry,['path','size','sha256','base64'])||!policy.templatePaths.includes(entry.path)||Object.hasOwn(files,entry.path))fail('Ugyldig filmanifest.');
   const bytes=bytesFrom64(entry.base64);
   if(bytes.length!==entry.size||await hash(bytes)!==entry.sha256)fail('Ei grunnfil er skadd.');
   files[entry.path]=bytes;
  }
  paths(files,policy.templatePaths);
  const template={files,templateHash:expectedHash,sourceHash:manifest.sourceHash};
  trustedTemplates.set(template,{records:json(await records(files)),hash:expectedHash,sourceHash:manifest.sourceHash});return template;
 }
 async function logoPixels(settings){
  if(!settings.logo)return;
  const bytes=bytesFrom64(settings.logo.slice(22));
  if(typeof createImageBitmap==='function'){
   let image;try{image=await createImageBitmap(new Blob([bytes],{type:'image/png'}));if(image.width>256||image.height>256||!image.width||!image.height)fail('Ugyldig logo.');}catch{fail('Logoen kunne ikkje lesast.');}finally{image?.close();}
  }else if(typeof module==='object'&&module.exports){
   const data=Buffer.from(bytes),width=data.readUInt32BE(16),height=data.readUInt32BE(20),stride=1+width*(data[25]===6?4:3),chunks=[];
   for(let i=8;i<data.length;){const size=data.readUInt32BE(i);if(data.toString('ascii',i+4,i+8)==='IDAT')chunks.push(data.subarray(i+8,i+8+size));i+=size+12;}
   const pixels=require('node:zlib').inflateSync(Buffer.concat(chunks),{maxOutputLength:height*stride});
   if(pixels.length!==height*stride)fail('Ugyldig logo.');for(let row=0;row<height;row++)if(pixels[row*stride]>4)fail('Ugyldig logo.');
  }else fail('Nettlesaren kan ikkje kontrollere logoen.');
 }
 function inject(html,settings){
  if((html.match(slot)||[]).length!==1)fail('Grunnappen manglar eitt eintydig innstillingsfelt.');
  return html.replace(slot,()=>'<script id="school-settings" type="application/json">'+safeJSON(settings)+'</'+'script>');
 }
 const instructions=`MUSIKKVERKSTAD – PRIVAT UTVIKLINGSPROTOTYPE\n\nElevpublisering: BLOCKED. Nedlasting er berre for privat gjennomgang og er inga godkjenning for elevbruk. Ingen overstyring eller automatisk publisering er lagd til.\n\nPakk ut ALLE filene før bruk. Be den som driftar skulen si nettside om privat gjennomgang via vanleg statisk HTTP/HTTPS-hosting. Opne index.html via nettadressa. Lyd krev HTTP; dobbelklikk/file:// er ikkje støtta for elevappen. Oppsettet og nedlastinga krev ingen utviklarverktøy for administratoren. Drift av ein nettstad er eit eige ansvar.\n\nAlle pianofiler og lisensar ligg lokalt i sounds/. Behald krediteringa. Pakken har ingen administrator, kontoar, database, analyseverktøy eller ekstern køyretidsavhengnad. Han sender ikkje elevframgang.\n\nFramgang og språkval høyrer til nettlesaren og nettadressa (inkludert port). Bruk same adresse for å halde fram med eksisterande lagring. Flytting eller sletting av nettlesardata kan fjerne tilgang til arbeidet; bruk appen sin Eksporter/Importer. Tema 02 tek vare på fullførte rundar og lagra rytmar; uferdige rundar blir ikkje lagra. Elevane vel sjølve blant tilgjengelege aktivitetar og nivå.\n\nDette er ei fleirfilspakke, ikkje ei installert offline-app. Det finst ingen service worker eller garanti om offline-installasjon. Førehandsvisinga i oppsettet har berre mellombels lagring og er ikkje ein fysisk telefontest.\n\nTa vare på school-settings.json til neste oppdatering. Importer henne i eit nytt, påliteleg skuleoppsett. school-package.json registrerer grunnpakke-, innstillings- og kandidatidentitet. Hashar er integritetskontroll, ikkje releasegodkjenning eller eit digitalt signaturbevis. Tilpassa filer arvar ingen uvedkomande PASS. Nettlesar-/lyd-/einingstestar og uavhengig vurdering manglar framleis for elevpublisering.\n`;
 async function prepare(template,input){
  const settings=SC.validate(input);await logoPixels(settings);
  // Recheck the trusted template bytes before each customisation.
  paths(template.files,policy.templatePaths);
  const trusted=trustedTemplates.get(template);
  if(!trusted||trusted.records!==json(await records(template.files))||trusted.hash!==template.templateHash||trusted.sourceHash!==template.sourceHash)fail('Grunnpakken er endra.');
  const files=Object.create(null);
  for(const path of policy.templatePaths){const bytes=template.files[path];files[path]=path.endsWith('.html')?encoder.encode(inject(decoder.decode(bytes),settings)):bytes.slice();}
  files['school-settings.json']=encoder.encode(json(settings)+'\n');
  files['PUBLISERING.txt']=encoder.encode(instructions);
  const identity={formatVersion:1,baseTemplateHash:template.templateHash,sourceHash:template.sourceHash,settingsHash:await hash(files['school-settings.json']),pupilRelease:'BLOCKED',purpose:'private-prototype-review',qualityLimitations:[...limits],files:await records(files)};
  const candidateHash=await hash(encoder.encode(json(identity)));
  const manifest={...identity,candidateHash};files['school-package.json']=encoder.encode(json(manifest)+'\n');
  paths(files,[...policy.templatePaths,...policy.extraPaths]);
  const candidate={files,manifest,settings};trustedCandidates.set(candidate,json(manifest));return candidate;
 }
 async function verify(candidate){
  paths(candidate.files,[...policy.templatePaths,...policy.extraPaths]);
  const manifest=JSON.parse(decoder.decode(candidate.files['school-package.json']));
  if(!keys(manifest,['formatVersion','baseTemplateHash','sourceHash','settingsHash','pupilRelease','purpose','qualityLimitations','files','candidateHash'])||manifest.formatVersion!==1||manifest.pupilRelease!=='BLOCKED'||manifest.purpose!=='private-prototype-review'||json(manifest.qualityLimitations)!==json(limits)||!['baseTemplateHash','sourceHash','settingsHash','candidateHash'].every(k=>/^[a-f0-9]{64}$/.test(manifest[k])))fail('Ugyldig kandidatmanifest.');
  if(trustedCandidates.get(candidate)!==json(manifest))fail('Kandidaten høyrer ikkje til denne verifiserte grunnpakken.');
  const payload=Object.fromEntries(Object.entries(candidate.files).filter(([p])=>p!=='school-package.json'));
  if(json(await records(payload))!==json(manifest.files))fail('Kandidatfilene er endra.');
  const {candidateHash,...identity}=manifest;
  if(await hash(encoder.encode(json(identity)))!==candidateHash||await hash(candidate.files['school-settings.json'])!==manifest.settingsHash)fail('Kandidatidentiteten stemmer ikkje.');
  const settings=SC.parse(decoder.decode(candidate.files['school-settings.json']));await logoPixels(settings);
  for(const path of ['index.html','nn.html','nb.html','en.html']){
   const html=decoder.decode(candidate.files[path]),matches=[...html.matchAll(/<script id="school-settings" type="application\/json">([^]*?)<\/script>/g)];
   if(matches.length!==1||json(SC.parse(matches[0][1]))!==json(settings))fail('Innstillingane i elevsidene stemmer ikkje.');
  }
  return manifest;
 }
 // Preview-only adapter. Never included in the pupil allowlist.
 function previewBootstrap(asset64,session){
  const memory=new Map(),assets=new Map();
  const storage={getItem:key=>memory.has(String(key))?memory.get(String(key)):null,setItem:(key,value)=>memory.set(String(key),String(value)),removeItem:key=>memory.delete(String(key)),clear:()=>memory.clear(),key:i=>[...memory.keys()][i]??null,get length(){return memory.size;}};
  Object.defineProperty(window,'localStorage',{value:storage,configurable:false});
  for(const [path,encoded]of Object.entries(asset64)){
   const raw=atob(encoded),bytes=Uint8Array.from(raw,c=>c.charCodeAt(0));
   assets.set(path,bytes);
  }
  // Local asset transport, not a network simulation: these are the exact ZIP bytes.
  // Native Response/AudioContext still parse and decode them. No connection permission.
  window.fetch=async(resource,options={})=>{
   if(typeof resource!=='string'||!assets.has(resource)||(options.method&&options.method!=='GET'))throw Error('Berre lokale førehandsvisingsfiler er tilgjengelege.');
   const aborted=()=>{if(options.signal?.aborted)throw new DOMException('Avbroten','AbortError');};
   aborted();await Promise.resolve();aborted();
   return new Response(assets.get(resource).slice(),{headers:{'Content-Type':resource.endsWith('.mp3')?'audio/mpeg':'text/plain'}});
  };
  document.addEventListener('click',event=>{
   const link=event.target.closest('a');if(!link)return;event.preventDefault();
   const locale=link.dataset.language;
   if(['nn','nb','en'].includes(locale))parent.postMessage({type:'musikkverkstad-preview-language',session,locale},'*');
  },true);
 }
 async function previewDocument(candidate,locale,session){
  await verify(candidate);
  if(!['nn','nb','en'].includes(locale)||typeof session!=='string'||!/^([a-f0-9]{32})$/.test(session))fail('Ugyldig førehandsvising.');
  const assets=Object.fromEntries(Object.entries(candidate.files).filter(([path])=>path.startsWith('sounds/')).map(([path,bytes])=>[path,base64(bytes)]));
  const csp="default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; img-src data: blob:; connect-src 'none'; media-src 'none'; base-uri 'none'; form-action 'none'";
  const adapter='<meta http-equiv="Content-Security-Policy" content="'+csp+'"><script>/* SCHOOL_PREVIEW_ADAPTER */('+previewBootstrap.toString()+')('+safeJSON(assets)+','+safeJSON(session)+');</'+'script>';
  const html=decoder.decode(candidate.files[locale+'.html']);
  if((html.match(/<head>/g)||[]).length!==1)fail('Ugyldig elevside.');
  return html.replace('<head>','<head>'+adapter);
 }
 function crc32(bytes){let crc=0xffffffff;for(const byte of bytes){crc^=byte;for(let i=0;i<8;i++)crc=(crc>>>1)^((crc&1)?0xedb88320:0);}return (crc^0xffffffff)>>>0;}
 function join(chunks){const out=new Uint8Array(chunks.reduce((n,b)=>n+b.length,0));let pos=0;for(const c of chunks){out.set(c,pos);pos+=c.length;}return out;}
 async function zip(candidate){
  await verify(candidate);
  const local=[],central=[];let offset=0;
  for(const path of Object.keys(candidate.files).sort()){
   const name=encoder.encode(path),bytes=candidate.files[path],crc=crc32(bytes);
   const header=new Uint8Array(30),h=new DataView(header.buffer);h.setUint32(0,0x04034b50,true);h.setUint16(4,20,true);h.setUint16(6,0x800,true);h.setUint16(12,33,true);h.setUint32(14,crc,true);h.setUint32(18,bytes.length,true);h.setUint32(22,bytes.length,true);h.setUint16(26,name.length,true);
   local.push(header,name,bytes);
   const entry=new Uint8Array(46),e=new DataView(entry.buffer);e.setUint32(0,0x02014b50,true);e.setUint16(4,20,true);e.setUint16(6,20,true);e.setUint16(8,0x800,true);e.setUint16(14,33,true);e.setUint32(16,crc,true);e.setUint32(20,bytes.length,true);e.setUint32(24,bytes.length,true);e.setUint16(28,name.length,true);e.setUint32(42,offset,true);central.push(entry,name);offset+=header.length+name.length+bytes.length;
  }
  const directory=join(central),end=new Uint8Array(22),view=new DataView(end.buffer),count=Object.keys(candidate.files).length;
  view.setUint32(0,0x06054b50,true);view.setUint16(8,count,true);view.setUint16(10,count,true);view.setUint32(12,directory.length,true);view.setUint32(16,offset,true);
  return join([...local,directory,end]);
 }
 return Object.freeze({policy,safeJSON,pathOK,hash,openTemplate,prepare,verify,zip,previewDocument,base64});
});
