// Independent combined-migration and simultaneous archive regressions.
// Node VM/DOM/storage simulation, not browser, audio, teacher or device evidence.
const assert=require('node:assert/strict');
const SC=require('../src/school/config.js');
const {setup}=require('./audio.cjs');
const copy=v=>JSON.parse(JSON.stringify(v));
const get=(t,code)=>copy(t.run(code));
const OLD=['theme','groove','rhythm','melody','harmony','puzzle','notation','create'];
const LOGO='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR4nGNQaPj/HwAFAgKfdqhGyQAAAABJRU5ErkJggg==';
// Historical shapes are deliberately independent of current SchoolConfig.defaults.
function historical(version){
 const v={schemaVersion:version,schoolName:'Historisk skule <profil>',logo:LOGO,defaultLanguage:'nb',colourPreset:'gold',ageGroups:['11-13'],themes:['groove'],levels:Object.fromEntries(OLD.map(id=>[id,id==='create'?[1]:[2,4]]))};
 if(version===2||version===4){v.themes.push('conversation');v.levels.conversation=[2,4];}
 if(version===3||version===4){v.formEnabled=true;v.levels.form=[1,3];}
 return v;
}
function freeze(v){if(v&&typeof v==='object'){Object.values(v).forEach(freeze);Object.freeze(v);}return v;}
for(const version of [1,2,3,4])for(const optOut of [false,true]){
 const v=historical(version);if(optOut){v.themes=['theme'];if(version>=3)v.formEnabled=false;}
 const before=copy(v),out=SC.validate(freeze(v));assert.equal(out.schemaVersion,6);
 for(const key of ['schoolName','logo','defaultLanguage','colourPreset','ageGroups','themes'])assert.deepEqual(out[key],before[key],`v${version}: preserve ${key}`);
 for(const [id,levels]of Object.entries(before.levels))assert.deepEqual(out.levels[id],levels,`v${version}: preserve ${id}`);
 assert.equal(out.formEnabled,version>=3?before.formEnabled:false);
 assert.equal(out.themes.includes('conversation'),before.themes.includes('conversation'));
 if(version===1||version===3)assert.deepEqual(out.levels.conversation,[1,2,3,4]);
 if(version===1||version===2)assert.deepEqual(out.levels.form,[1,2,3,4]);
 out.levels.theme.pop();assert.deepEqual(v,before,'No input mutation or output-array aliases');
}
const unrestricted=historical(1);unrestricted.themes=['theme','groove'];for(const id of OLD)unrestricted.levels[id]=id==='create'?[1]:[1,2,3,4];
assert.deepEqual(SC.validate(unrestricted).themes,['theme','groove']);assert.equal(SC.validate(unrestricted).formEnabled,false);
const invalid=[
 ...[0,5,'4',2.5,null].map(schemaVersion=>({...historical(4),schemaVersion})),
 {...historical(1),formEnabled:true}, {...historical(1),themes:['groove','conversation']},
 {...historical(1),levels:{...historical(1).levels,conversation:[1]}},
 {...historical(2),formEnabled:false}, {...historical(2),levels:{...historical(2).levels,form:[1]}},
 {...historical(3),themes:['groove','conversation']}, {...historical(3),levels:{...historical(3).levels,conversation:[1]}},
 {...historical(4),formEnabled:'false'}, {...historical(4),levels:{...historical(4).levels,conversation:[]}},
 {...historical(4),levels:{...historical(4).levels,form:[5]}}, {...historical(4),pupilData:{}},
];
for(const version of [1,2,3,4]){const missing=historical(version);delete missing.levels.groove;invalid.push(missing);const bad=historical(version);bad.levels.groove=[true];invalid.push(bad);}
for(const v of invalid){const before=copy(v);assert.throws(()=>SC.validate(v));assert.deepEqual(v,before,'Rejected school settings remain untouched');}
console.log('PASS: independently constructed v1/v2/v3/v4 shapes, consent, restrictions, logo/branding and immutable rejection');

const events=pitches=>pitches.map(notes=>({notes,dur:1}));
const LEGACY={version:1,level:1,done:{'listen-1':9,'build-1':3},creations:[{level:1,call:events([60,62,60,64]),response:events([60,64])}]};
const CV={version:2,level:4,done:{'listen-4':7,'build-2':2,'echo-1':3},creations:[{level:4,brief:'down',call:events([60,62,64,67]),response:events([69,67,64,60]),previous:events([60,62,64,67])}],legacyEcho:copy(LEGACY)};
const FO={version:1,level:3,done:{'puzzle-3':5,'build-2':4},creations:[{level:3,map:['B','Bv','A','A'],previous:['A','B','A']}]};
const GR={version:1,level:2,done:{'listen-2':11,'repair-1':2},creations:[{level:2,pattern:[1,0,1,1,0,1,0,1]}]};
const TH={version:1,done:{'listen-2':true,'create-1':true},creations:[{level:1,notes:[60,62,64,67,60,62,64,69]}]};
const EMPTY_CV={version:2,level:1,done:{},creations:[],legacyEcho:null},EMPTY_FO={version:1,level:1,done:{},creations:[]};
function seeded(locale){
 const t=setup(locale),v=get(t,'emptyData()');Object.assign(v,{conversationPractice:copy(CV),formPractice:copy(FO),groovePractice:copy(GR),creations:[{title:'Bevart variant',notes:[60,62,64,67,60,62,69,60]}],volume:.43});
 v.levels.rhythm=2;v.stats.rhythm={done:7,correct:4};v.observations['rhythm-2']=[true,false];
 t.run(`data=validData(${JSON.stringify(v)});save();thStore=thValid(${JSON.stringify(TH)});thPersist()`);return t;
}
async function upload(t,v){const text=JSON.stringify(v);await t.listeners['importFile:change']({target:{files:[{size:Buffer.byteLength(text),text:async()=>text}],value:'file'}});}
async function exported(t){t.run('exportData()');return JSON.parse(await t.exported.at(-1).text());}
function snapshot(t){return {data:get(t,'data'),theme:get(t,'thStore'),main:t.stored['musikkverkstad-v1'],themeRaw:t.stored['musikkverkstad-theme-ending-v1']};}
(async()=>{for(const locale of ['nn','nb','en']){
 const t=seeded(locale),initial=snapshot(t),backup=await exported(t);
 assert.deepEqual(backup.conversationPractice,CV);assert.deepEqual(backup.formPractice,FO);assert.deepEqual(backup.groovePractice,GR);assert.deepEqual(backup.themeEnding,TH);
 await upload(t,backup);assert.deepEqual(snapshot(t),initial,'Combined round-trip preserves all archives');
 for(const absent of [['conversationPractice'],['formPractice'],['conversationPractice','formPractice']]){
  const target=seeded(locale),incoming=copy(backup);for(const field of absent)delete incoming[field];
  if(!absent.includes('conversationPractice'))incoming.conversationPractice=copy(EMPTY_CV);
  if(!absent.includes('formPractice'))incoming.formPractice=copy(EMPTY_FO);
  await upload(target,incoming);
  assert.deepEqual(get(target,'data.conversationPractice'),absent.includes('conversationPractice')?CV:EMPTY_CV);
  assert.deepEqual(get(target,'data.formPractice'),absent.includes('formPractice')?FO:EMPTY_FO);
  assert.deepEqual(get(target,'data.groovePractice'),GR);assert.deepEqual(get(target,'thStore'),TH);
 }
 const empty=copy(backup);empty.conversationPractice=copy(EMPTY_CV);empty.formPractice=copy(EMPTY_FO);
 const replaced=seeded(locale);await upload(replaced,empty);assert.deepEqual(get(replaced,'data.conversationPractice'),EMPTY_CV);assert.deepEqual(get(replaced,'data.formPractice'),EMPTY_FO);
 const cancelled=seeded(locale),beforeCancel=snapshot(cancelled);cancelled.run('confirm=()=>false');await upload(cancelled,empty);assert.deepEqual(snapshot(cancelled),beforeCancel);
 const mutations=[
  v=>{v.formPractice.creations[0].map=['A','X'];v.conversationPractice=copy(EMPTY_CV);},
  v=>{v.conversationPractice.creations[0].brief='aesthetic';v.formPractice=copy(EMPTY_FO);},
  v=>v.formPractice.version=2,v=>v.conversationPractice.version=3,
  v=>v.formPractice.done={'puzzle-3':-1},v=>v.conversationPractice.done={'listen-4':1.5},
  v=>v.formPractice=null,v=>v.conversationPractice=null,
  v=>v.formPractice.creations[0].previous=['unknown','B'],v=>v.conversationPractice.creations[0].previous[0].dur=.5,
  v=>v.formPractice.pupilName='forbidden',v=>v.conversationPractice.pupilName='forbidden',
  v=>{v.formPractice=copy(EMPTY_FO);v.conversationPractice=copy(EMPTY_CV);v.themeEnding={version:99};},
 ];
 for(const mutate of mutations){const bad=copy(backup);mutate(bad);await upload(t,bad);assert.deepEqual(snapshot(t),initial,'Corrupt data must not partly replace either module, base practice or persisted bytes');}
 const legacy=seeded(locale),older=copy(backup);older.conversationPractice=copy(LEGACY);delete older.formPractice;await upload(legacy,older);
 assert.deepEqual(get(legacy,'data.formPractice'),FO);assert.deepEqual(get(legacy,'data.conversationPractice.done'),{});assert.deepEqual(get(legacy,'data.conversationPractice.creations'),[]);assert.deepEqual(get(legacy,'data.conversationPractice.legacyEcho'),LEGACY);
 const legacyCopy=await exported(legacy);assert.deepEqual(legacyCopy.conversationPractice.legacyEcho,LEGACY);assert.deepEqual(legacyCopy.formPractice,FO);
 for(const next of ['nn','nb','en']){const reload=setup(next,{stored:t.stored});assert.deepEqual(get(reload,'data'),initial.data);assert.deepEqual(get(reload,'thStore'),TH);assert.equal(reload.stored['musikkverkstad-language'],next);}
 t.run("schoolSettings.schoolName='Ny profil';schoolSettings.defaultLanguage='nb';schoolSettings.colourPreset='gold';schoolSettings.formEnabled=false;schoolSettings.themes=['groove'];go('home')");
 const restricted=get(t,'data');t.run("foAction('open','0');cvAction('open','0')");assert.equal(t.run('route'),'home');assert.deepEqual(get(t,'data'),restricted);
 const restrictionCopy=await exported(t);assert.deepEqual(restrictionCopy.formPractice,FO);assert.deepEqual(restrictionCopy.conversationPractice,CV);
 // A changed school package is applied on reload, not through an invented live-settings API.
 const limited=setup(locale,{stored:t.stored});
 limited.run("schoolSettings.formEnabled=true;schoolSettings.themes=['groove','conversation'];schoolSettings.levels.form=[2];schoolSettings.levels.conversation=[2];go('form');foAction('open','0')");assert.equal(limited.run('fo.level'),2);
 limited.run("go('conversation');cvAction('open','0')");assert.equal(limited.run('cv.level'),2);assert.deepEqual(get(limited,'data.formPractice.creations'),FO.creations);assert.deepEqual(get(limited,'data.conversationPractice.creations'),CV.creations);
 for(const field of ['formPractice','conversationPractice']){const bad=copy(initial.data);bad[field]={version:99};const raw=JSON.stringify(bad),damaged=setup(locale,{stored:{'musikkverkstad-v1':raw}});damaged.run("go('form');foAction('mode','create');foAction('save');go('conversation');cvAction('mode','create');cvAction('save')");assert.equal(damaged.stored['musikkverkstad-v1'],raw);assert.equal(damaged.run('storageOK'),false);}
 console.log(`PASS ${locale}: simultaneous archives, optional/explicit/atomic backups, Echo isolation, locale/profile/restriction persistence (Node simulation)`);
}
console.log('Node integration simulation only: no browser, native audio, speaker, teacher or device approval.');
})().catch(error=>{console.error(error);process.exitCode=1;});
