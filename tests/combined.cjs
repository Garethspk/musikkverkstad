// Independent six-branch settings readers and simultaneous optional archives.
// Node/VM/DOM/storage simulation only; not native browser, speaker or human evidence.
const assert=require('node:assert/strict');
const School=require('../src/school/config.js');
const {setup}=require('./audio.cjs');
const copy=v=>JSON.parse(JSON.stringify(v));
const get=(t,s)=>copy(t.run(s));
const LOGO='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR4nGNQaPj/HwAFAgKfdqhGyQAAAABJRU5ErkJggg==';
const OLD=['theme','groove','rhythm','melody','harmony','puzzle','notation','create'];
// This literal oracle describes branch histories, not current defaults with fields removed.
const HISTORY={
 1:{ids:[...OLD],flags:[],cv:false},
 2:{ids:[...OLD,'conversation'],flags:[],cv:true},
 3:{ids:[...OLD,'form'],flags:['formEnabled'],cv:false},
 4:{ids:[...OLD,'conversation','form'],flags:['formEnabled'],cv:true},
 5:{ids:[...OLD,'form','programme'],flags:['formEnabled','programmeEnabled'],cv:false},
 6:{ids:[...OLD,'conversation','form','programme'],flags:['formEnabled','programmeEnabled'],cv:true}
};
const ALL=[...OLD,'conversation','form','programme'];
function freeze(v){if(v&&typeof v==='object'){Object.values(v).forEach(freeze);Object.freeze(v)}return v}
function historical(version,{mask=3,cv=true,full=false}={}){
 const h=HISTORY[version],value={schemaVersion:version,schoolName:'Historisk Fjord skule <profil>',logo:LOGO,defaultLanguage:'nb',colourPreset:'gold',ageGroups:['11-13'],themes:full?['theme','groove']:['groove'],levels:Object.fromEntries(h.ids.map(id=>[id,id==='create'?[1]:full?[1,2,3,4]:[2,4]]))};
 if(h.cv&&cv)value.themes.push('conversation');
 h.flags.forEach((flag,i)=>value[flag]=!!(mask&(1<<i)));
 return value;
}
let validSettings=0,invalidSettings=0;
for(const version of [1,2,3,4,5,6]){
 const history=HISTORY[version];
 for(const full of [false,true])for(let mask=0;mask<2**history.flags.length;mask++)for(const cv of history.cv?[false,true]:[false]){
  const input=historical(version,{mask,cv,full}),original=copy(input),out=School.validate(freeze(input));validSettings++;
  assert.equal(out.schemaVersion,6);assert.deepEqual(Object.keys(out.levels).sort(),ALL.slice().sort());
  for(const key of ['schoolName','logo','defaultLanguage','colourPreset','ageGroups','themes'])assert.deepEqual(out[key],original[key],`v${version}: ${key} preserved`);
  assert.equal(out.formEnabled,history.flags.includes('formEnabled')?original.formEnabled:false,`v${version}: Form consent`);
  assert.equal(out.programmeEnabled,history.flags.includes('programmeEnabled')?original.programmeEnabled:false,`v${version}: programme consent`);
  assert.equal(out.themes.includes('conversation'),history.cv&&cv,`v${version}: Conversation absent means disabled`);
  for(const id of ALL)assert.deepEqual(out.levels[id],history.ids.includes(id)?original.levels[id]:[1,2,3,4],`v${version}: exact old levels or options without consent`);
  assert.deepEqual(School.parse(JSON.stringify(original)),out);
  out.levels.theme.pop();out.themes.pop();out.ageGroups.pop();assert.deepEqual(input,original,'No input mutation or output array aliases');
 }
 const base=historical(version);
 const mutations=[s=>s.logo='data:image/svg+xml;base64,PHN2Zy8+',s=>s.logo='https://invalid.test/logo.png',s=>s.schoolName='bad\u0000',s=>s.defaultLanguage='unknown',s=>s.ageGroups=[],s=>s.colourPreset='arbitrary-css',s=>s.pupilData={},s=>s.themes=['programme'],s=>s.themes=['form'],s=>s.themes=['theme','future'],s=>s.themes=['groove','groove'],s=>s.levels.future=[1]];
 for(const key of Object.keys(base))mutations.push(s=>delete s[key]);
 for(const id of history.ids){mutations.push(s=>delete s.levels[id]);for(const levels of [[],null,[true],[0],[5],[1,1],'1'])mutations.push(s=>s.levels[id]=levels)}
 for(const id of ALL.filter(id=>!history.ids.includes(id)))mutations.push(s=>s.levels[id]=[1]);
 if(!history.cv)mutations.push(s=>s.themes=['groove','conversation']);
 for(const flag of ['formEnabled','programmeEnabled']){
  if(history.flags.includes(flag))for(const value of [null,0,1,'false',undefined])mutations.push(s=>s[flag]=value);
  else for(const value of [false,true])mutations.push(s=>s[flag]=value);
 }
 for(const mutate of mutations){const bad=copy(base);mutate(bad);const original=copy(bad);assert.throws(()=>School.validate(freeze(bad)),`v${version}: malformed/injected historical shape`);assert.deepEqual(copy(bad),original);invalidSettings++}
}
for(const version of [0,7,99,-1,1.5,'1','6',null,true])assert.throws(()=>School.validate({...historical(6),schemaVersion:version}));
const defaults=School.defaults();assert.equal(defaults.schemaVersion,6);assert.equal(defaults.formEnabled,true);assert.equal(defaults.programmeEnabled,true);assert.deepEqual(defaults.themes,['theme','groove','conversation']);assert.equal(Object.keys(defaults.levels).length,11);assert(School.registry.every(r=>r.pupilRelease==='BLOCKED'));
console.log(`PASS: ${validSettings} independent historical v1–v6 settings/consent cases and ${invalidSettings} immutable malformed/injected rejections; no cumulative-version assumption (pure Node).`);

const events=pitches=>pitches.map(notes=>({notes,dur:1}));
const LEGACY={version:1,level:1,done:{'listen-1':13,'build-1':7},creations:[{level:1,call:events([60,62,60,64]),response:events([60,64])}]};
const CV={version:2,level:4,done:{'listen-4':7,'build-2':3,'echo-1':2},creations:[{level:4,brief:'down',call:events([60,62,64,67]),response:events([69,67,64,60]),previous:events([60,62,64,67])}],legacyEcho:copy(LEGACY)};
const FO={version:1,level:3,done:{'puzzle-3':5,'build-2':4},creations:[{level:3,map:['B','Bv','A','A'],previous:['A','B','A']}]};
const WG={version:1,level:4,done:{'w1-pulse-3':6,'w1-symbol-1':4},creations:[{slot:'w1-create',challenge:'rhythm-free.v1',revision:1,level:4,brief:3,division:2,pattern:[0,1,0,0,1,0,1,0],previous:{division:1,pattern:[0,0,0,0]}}]};
const GR={version:1,level:2,done:{'listen-2':11,'repair-1':2},creations:[{level:2,pattern:[1,0,1,1,0,1,0,1]}]};
const TH={version:1,done:{'listen-2':true,'create-1':true},creations:[{level:1,notes:[60,62,64,67,60,62,64,69]}]};
const ARCHIVES={conversationPractice:CV,formPractice:FO,programmePractice:WG,groovePractice:GR};
const EMPTY={conversationPractice:{version:2,level:1,done:{},creations:[],legacyEcho:null},formPractice:{version:1,level:1,done:{},creations:[]},programmePractice:{version:1,level:1,done:{},creations:[]},groovePractice:{version:1,level:1,done:{},creations:[]}};
function seeded(locale){
 const t=setup(locale),value=get(t,'emptyData()');Object.assign(value,copy(ARCHIVES));value.volume=.43;value.levels.rhythm=2;value.stats.rhythm={done:7,correct:4};value.observations['rhythm-2']=[true,false];value.creations=[{title:'Bevart variant',notes:[60,62,64,67,60,62,69,60]}];
 t.run(`data=validData(${JSON.stringify(value)});save();thStore=thValid(${JSON.stringify(TH)});thPersist()`);return t;
}
async function exported(t){t.run('exportData()');return JSON.parse(await t.exported.at(-1).text())}
async function upload(t,value){const text=JSON.stringify(value);await t.listeners['importFile:change']({target:{files:[{size:Buffer.byteLength(text),text:async()=>text}],value:'file'}})}
function snapshot(t){return {data:get(t,'data'),theme:get(t,'thStore'),raw:t.stored['musikkverkstad-v1'],themeRaw:t.stored['musikkverkstad-theme-ending-v1']}}
function archives(t){for(const [key,value]of Object.entries(ARCHIVES))assert.deepEqual(get(t,'data.'+key),value);assert.deepEqual(get(t,'thStore'),TH)}
(async()=>{for(const locale of ['nn','nb','en']){
 const t=seeded(locale),initial=snapshot(t),backup=await exported(t);archives(t);for(const [key,value]of Object.entries(ARCHIVES))assert.deepEqual(backup[key],value);assert.deepEqual(backup.themeEnding,TH);
 await upload(t,backup);assert.deepEqual(snapshot(t),initial,'Round-trip preserves simultaneous data and persisted bytes');
 // Exhaustively omit each subset of four optional histories. Present fields deliberately replace.
 const keys=Object.keys(ARCHIVES);
 for(let mask=0;mask<16;mask++){
  const incoming=copy(backup);keys.forEach((key,i)=>{if(mask&(1<<i))delete incoming[key];else incoming[key]=copy(EMPTY[key])});
  const target=seeded(locale);await upload(target,incoming);
  keys.forEach((key,i)=>assert.deepEqual(get(target,'data.'+key),mask&(1<<i)?ARCHIVES[key]:EMPTY[key],`older backup subset${mask}: ${key} independently preserves/replaces`));assert.deepEqual(get(target,'thStore'),TH);
 }
 // Existing Theme01 also remains independently optional.
 const noTheme=copy(backup);delete noTheme.themeEnding;await upload(t,noTheme);assert.deepEqual(get(t,'thStore'),TH);archives(t);
 for(const key of keys){const target=seeded(locale),replacement=copy(backup);replacement[key]=copy(EMPTY[key]);const previous=snapshot(target);target.run('confirm=()=>false');await upload(target,replacement);assert.deepEqual(snapshot(target),previous,'Declining a replacement changes nothing');target.run('confirm=()=>true');await upload(target,replacement);assert.deepEqual(get(target,'data.'+key),EMPTY[key]);for(const sibling of keys.filter(x=>x!==key))assert.deepEqual(get(target,'data.'+sibling),ARCHIVES[sibling]);assert.deepEqual(get(target,'thStore'),TH)}
 const mutations=[
  ...keys.map(key=>v=>v[key]=null),...keys.map(key=>v=>v[key].version=99),
  v=>v.conversationPractice.creations[0].previous[0].dur=.5,v=>v.conversationPractice.legacyEcho.done['listen-1']=-1,
  v=>v.formPractice.creations[0].previous=['unknown','B'],v=>v.programmePractice.creations[0].challenge='future',v=>v.programmePractice.creations[0].brief=2,
  v=>v.programmePractice.creations[0].previous.pattern=[1,2,0,0],v=>v.groovePractice.creations[0].pattern[0]=2,
  v=>v.themeEnding={version:99},v=>v.extraPractice={version:99},v=>v.stats.rhythm.correct=1000001
 ];
 for(const mutate of mutations){const bad=copy(backup);bad.volume=.8;bad.stats.rhythm={done:21,correct:20};for(const key of keys)bad[key].level=1;mutate(bad);await upload(t,bad);assert.deepEqual(snapshot(t),initial,'One invalid sibling rejects base, all optional histories, Theme01 and stored bytes atomically')}
 const oldEcho=copy(backup);oldEcho.conversationPractice=copy(LEGACY);delete oldEcho.formPractice;delete oldEcho.programmePractice;await upload(t,oldEcho);assert.deepEqual(get(t,'data.conversationPractice.done'),{});assert.deepEqual(get(t,'data.conversationPractice.creations'),[]);assert.deepEqual(get(t,'data.conversationPractice.legacyEcho'),LEGACY);assert.deepEqual(get(t,'data.formPractice'),FO);assert.deepEqual(get(t,'data.programmePractice'),WG);assert.deepEqual(get(t,'data.groovePractice'),GR);assert.deepEqual((await exported(t)).conversationPractice.legacyEcho,LEGACY);await upload(t,backup);
 // Native language pages share persisted work; this harness verifies data, not browser navigation.
 for(const next of ['nn','nb','en']){const reloaded=setup(next,{stored:t.stored});archives(reloaded);assert.equal(reloaded.stored['musikkverkstad-language'],next)}
 // Archive dispatch must work on a fresh load, before any Conversation question exists.
 const fresh=setup(locale,{stored:t.stored});fresh.run("go('progress')");assert.equal(fresh.run('cv.item'),null);await fresh.run("cvAction('open','0')");assert.equal(fresh.run('route'),'conversation');assert.deepEqual(get(fresh,'cv.previous'),CV.creations[0].previous);assert.deepEqual(get(fresh,'cv.response'),CV.creations[0].response);
 const legacyFresh=setup(locale,{stored:t.stored});legacyFresh.run("go('progress')");assert.equal(legacyFresh.run('cv.item'),null);await legacyFresh.run("cvAction('legacy','0')");assert.equal(legacyFresh.run('route'),'conversation');assert.equal(legacyFresh.notes.length,LEGACY.creations[0].call.length+LEGACY.creations[0].response.length);assert.deepEqual(get(legacyFresh,'data.conversationPractice.done'),CV.done,'Legacy audition grants no new completion credit');
 const restored=setup(locale,{stored:t.stored});restored.run("go('conversation');cvAction('open','0')");assert.deepEqual(get(restored,'cv.previous'),CV.creations[0].previous);restored.run("go('form');foAction('open','0')");assert.deepEqual(get(restored,'fo.previous'),FO.creations[0].previous);restored.run("go('programme');wgAction('open','0')");assert.deepEqual(get(restored,'wg.previous'),WG.creations[0].previous);assert.equal(restored.run('wg.brief'),3);assert.equal(restored.run('wg.division'),2);archives(restored);
 restored.run("go('home');schoolSettings.schoolName='Updated profile';schoolSettings.defaultLanguage='en';schoolSettings.programmeEnabled=false;schoolSettings.formEnabled=false;schoolSettings.themes=['groove']");const restricted=snapshot(restored);restored.run("cvAction('open','0');foAction('open','0');wgAction('open','0')");assert.equal(restored.run('route'),'home');assert.deepEqual(snapshot(restored),restricted,'Disabled histories cannot reopen or be erased');for(const key of keys)assert.deepEqual((await exported(restored))[key],ARCHIVES[key]);
 const limited=setup(locale,{stored:t.stored});limited.run("schoolSettings.levels.conversation=[2];schoolSettings.levels.form=[2];schoolSettings.levels.programme=[2];go('conversation');cvAction('open','0')");assert.equal(limited.run('cv.level'),2);limited.run("go('form');foAction('open','0')");assert.equal(limited.run('fo.level'),2);limited.run("go('programme');wgAction('open','0')");assert.equal(limited.run('wg.level'),2);archives(limited);
 // A corrupt optional extension protects the complete raw record, not just that extension.
 for(const corrupt of ['conversationPractice','formPractice','programmePractice']){
  const bad=copy(initial.data);bad[corrupt]={version:99};const raw=JSON.stringify(bad),damaged=setup(locale,{stored:{'musikkverkstad-v1':raw,'musikkverkstad-theme-ending-v1':JSON.stringify(TH)}});
  damaged.run("go('programme');wgAction('task','create');wgAction('save');go('form');foAction('mode','create');foAction('save');go('conversation');cvAction('mode','create');cvAction('save')");assert.equal(damaged.stored['musikkverkstad-v1'],raw);assert.equal(damaged.run('storageOK'),false);const invalid=copy(backup);invalid.programmePractice=null;await upload(damaged,invalid);assert.equal(damaged.stored['musikkverkstad-v1'],raw);await upload(damaged,backup);assert.equal(damaged.run('storageCorrupt'),false);archives(damaged);
 }
 const denied=setup(locale);denied.run("localStorage.setItem=()=>{throw Error('quota')};go('programme');wgAction('task','create');wgAction('save');go('form');foAction('mode','create');foAction('save');go('conversation');cvAction('mode','create');cvAction('save')");assert.equal(denied.run('storageOK'),false);const temporary=await exported(denied);for(const key of ['programmePractice','formPractice','conversationPractice'])assert.equal(temporary[key].creations.length,1,'Denied storage retains independent in-memory saves for export');
 assert.equal(t.contexts.length,0);assert.equal(t.notes.length,0,'Archive/migration checks do not initialise or simulate audible sound');
 console.log(`PASS ${locale}: simultaneous Theme01/02/CV/Form/programme and legacy Echo,16 missing-field subsets, explicit/cancelled replacement, atomic corruption, reload/restrictions and storage safety (Node simulation).`);
}
console.log('No browser, rendered audio, physical speaker/device, teacher, pupil or real AT validation claimed.');
})().catch(error=>{console.error(error);process.exitCode=1});
