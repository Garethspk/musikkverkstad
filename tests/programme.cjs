// Independent finite musical oracles and simulated DOM/storage regressions.
// These tests do not establish browser rendering, speaker output or human learning.
const assert=require('node:assert/strict');
const Core=require('../src/programme-core.js');
const School=require('../src/school/config.js');
const {setup}=require('./audio.cjs');
const copy=x=>JSON.parse(JSON.stringify(x));
const get=(t,code)=>copy(t.run(code));
const upload=(t,value)=>t.listeners['importFile:change']({target:{files:[{size:100,text:async()=>JSON.stringify(value)}],value:'file'}});
const event=([notes,dur])=>({notes,dur});
// Authored independently from the implementation: complete curated material.
const PULSE=[
 [[60,1],[null,1],[60,1],[null,1]],[[60,1],[60,1],[null,1],[60,1]],[[null,1],[60,1],[null,1],[60,1]],[[60,1],[null,1],[null,1],[60,1]],
 [[60,2],[null,1],[60,1]],[[null,1],[60,2],[60,1]],[[60,1],[60,1],[60,2]],[[60,2],[null,2]],
 [[60,.5],[null,.5],[60,.5],[null,.5],[null,.5],[null,.5],[60,.5],[null,.5]],
 [[null,.5],[60,.5],[60,.5],[null,.5],[60,.5],[60,.5],[null,.5],[null,.5]],
 [[60,.5],[60,.5],[null,.5],[60,.5],[null,.5],[null,.5],[60,.5],[null,.5]],
 [[60,.5],[null,.5],[null,.5],[null,.5],[60,.5],[null,.5],[null,.5],[60,.5]]
];
const SYMBOL=[
 [[null,1],[60,3]],[[60,1],[null,1],[60,2]],[[60,2],[null,1],[60,1]],[[60,3],[null,1]],
 [[null,2],[60,2]],[[60,2],[null,2]],[[null,2],[60,1],[60,1]],[[60,1],[60,1],[null,2]],
 [[null,.5],[60,3.5]],[[60,.5],[null,.5],[60,3]],[[60,2],[null,.5],[60,1.5]],[[60,3.5],[null,.5]]
];
const LABELS=[['1','2','3','4'],['1','2','3','4'],['1','&','2','&','3','&','4','&']];
const RESTS=['quarter-rest','half-rest','eighth-rest'];
function permutations(items){
 const out=[],counts=new Map();for(const x of items)counts.set(x,(counts.get(x)||0)+1);
 function walk(prefix){if(prefix.length===items.length){out.push(prefix);return}for(const [x,n]of counts)if(n){counts.set(x,n-1);walk([...prefix,x]);counts.set(x,n)}}
 walk([]);return out;
}
assert.equal(Core.week,'pulse-space.v1');
assert.deepEqual(Core.slots.map(x=>[x.id,x.type,x.mechanic,x.revision,x.state,x.pupilRelease]),[
 ['w1-pulse','pulse-grid','sequence',1,'implemented-prototype','BLOCKED'],
 ['w1-symbol','rest-symbol','single-choice',1,'implemented-prototype','BLOCKED'],
 ['w1-create','rhythm-create','grid-revision',1,'implemented-prototype','BLOCKED']
]);
assert.equal(Core.pulse.length,12);assert.equal(Core.symbol.length,12);
assert.equal(new Set([...Core.pulse,...Core.symbol].map(x=>x.id)).size,24);
for(const [i,item]of Core.pulse.entries()){
 assert.deepEqual(item.events,PULSE[i].map(event));assert.equal(item.brief,1+Math.floor(i/4));
 assert.equal(item.events.reduce((sum,e)=>sum+e.dur,0),4);
 const expected=LABELS[item.brief-1];assert.deepEqual(Core.labels(item),expected);
 const grid=[];for(const [pitch,duration]of PULSE[i])for(let j=0;j<duration*item.division;j++)grid.push(pitch===null?'rest':j===0?'note':'held');
 assert.deepEqual(Core.grid(item),grid,'Pulse consumes rests/holds, not just attacks');
 const offered=permutations(expected);assert.equal(offered.length,item.division===2?1680:24);
 assert.equal(offered.filter(candidate=>Core.fitsPulse(item,candidate)).length,1);
 for(const candidate of [null,[],expected.slice(1),[...expected,'5'],expected.map(Number)])assert.equal(Core.fitsPulse(item,candidate),false);
 assert(Object.isFrozen(item)&&Object.isFrozen(item.events)&&item.events.every(Object.isFrozen));
}
for(const [i,item]of Core.symbol.entries()){
 assert.deepEqual(item.events,SYMBOL[i].map(event));assert.equal(item.brief,1+Math.floor(i/4));
 assert.equal(item.events.reduce((sum,e)=>sum+e.dur,0),4);
 let offset=0,gap;for(const e of item.events){if(e.notes===null)gap={start:offset,duration:e.dur};offset+=e.dur}
 assert.equal(item.start,gap.start);assert.equal(item.gap,gap.duration);
 const accepted=Core.symbolDefs.filter(candidate=>Core.fitsSymbol(item,candidate.id)).map(c=>c.id);
 assert.deepEqual(accepted,[RESTS[Math.floor(i/4)]]);assert.equal(Core.fitsSymbol(item,'quarter-note'),false,'Sounding note cannot fill silent span');
 assert.equal(Core.fitsSymbol(item,'unavailable'),false);
}
for(const brief of [1,2,3]){
 assert.equal(Core.pulse.filter(x=>x.brief===brief).length,4);assert.equal(Core.symbol.filter(x=>x.brief===brief).length,4);
 assert.equal(new Set(Core.symbol.filter(x=>x.brief===brief).map(x=>JSON.stringify(x.events))).size,4,'Distinct contexts, not duplicate item IDs');
}
function creation(level=1,division=1,pattern=[0,0,0,0],previous=null){return {slot:'w1-create',challenge:'rhythm-free.v1',revision:1,level,brief:level===4?(division===2?3:1):level,division,pattern,previous}}
function progress(c=creation()){return {version:1,level:c.level,done:{'w1-pulse-1':2,'w1-symbol-4':1},creations:[c]}}
let patterns=0;
for(const division of [1,2])for(let mask=0;mask<2**(4*division);mask++){
 const pattern=Array.from({length:4*division},(_,i)=>(mask>>i)&1);patterns++;
 assert.equal(Core.pattern(pattern,division),true);const events=Core.events(pattern,division);
 assert.deepEqual(events,pattern.map(x=>({notes:x?60:null,dur:1/division})));assert.equal(events.reduce((sum,e)=>sum+e.dur,0),4);
 for(const level of division===1?[1,2,4]:[3,4])assert.deepEqual(Core.valid(progress(creation(level,division,pattern))).creations[0].pattern,pattern,'All supported patterns are ungraded, including silence');
}
assert.equal(patterns,272);
for(const bad of [null,[],[1,0,0],Array(5).fill(0),[1,0,true,0],[1,0,2,0]])assert.equal(Core.pattern(bad,1),false);
for(const division of [0,3,1.5,'1'])assert.throws(()=>Core.events([1,0,1,0],division));
assert.deepEqual(Core.valid(undefined),Core.empty());
for(const bad of [null,[],{}, {...Core.empty(),version:2}, {...Core.empty(),level:'1'}, {...Core.empty(),level:0}, {...Core.empty(),level:5}, {...Core.empty(),future:true}, {...Core.empty(),done:[]}, {...Core.empty(),creations:{}},
 ...['w1-create-1','w2-pulse-1','w1-pulse-0','w1-symbol-5'].map(key=>({...Core.empty(),done:{[key]:1}})),
 ...[-1,.5,NaN,Infinity,true,1000001].map(n=>({...Core.empty(),done:{'w1-pulse-1':n}}))])assert.throws(()=>Core.valid(bad));
const badCreations=[c=>c.slot='w2-create',c=>c.challenge='future',c=>c.revision=2,c=>delete c.brief,c=>c.brief=0,c=>c.brief=2,c=>c.level=0,c=>c.level=true,c=>c.division=2,c=>c.pattern=[0,1],c=>c.pattern[0]=true,c=>delete c.previous,c=>c.previous={},c=>c.previous={division:1,pattern:[1,0,1]},c=>c.previous={division:1,pattern:[1,0,1,0],future:true},c=>c.pupilName='no'];
for(const mutate of badCreations){const c=creation();mutate(c);assert.throws(()=>Core.valid(progress(c)))}
const both=progress(creation(3,2,[1,0,0,0,1,0,0,0],{division:1,pattern:[0,0,0,0]}));
const before=copy(both),valid=Core.valid(both);valid.creations[0].previous.pattern[0]=1;valid.creations[0].pattern[0]=0;assert.deepEqual(both,before,'Validated data must not alias or mutate input');
const reordered=Object.fromEntries(Object.entries(creation()).reverse());assert.throws(()=>Core.valid({...Core.empty(),creations:[creation(),reordered]}),'Duplicate identity independent of property order');
const twenty=Array.from({length:20},(_,mask)=>creation(4,2,Array.from({length:8},(_,i)=>(mask>>i)&1)));assert.equal(Core.valid({...Core.empty(),creations:twenty}).creations.length,20);assert.throws(()=>Core.valid({...Core.empty(),creations:[...twenty,creation()]}));
// Independent historical settings: never derive old shapes by deleting new fields.
const OLD_IDS=['theme','groove','rhythm','melody','harmony','puzzle','notation','create'];
const logo='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR4nGNQaPj/HwAFAgKfdqhGyQAAAABJRU5ErkJggg==';
function settings(version){return {schemaVersion:version,schoolName:'Fjord skule',logo,defaultLanguage:'nb',colourPreset:'blue',ageGroups:['11-13'],themes:['groove'],levels:Object.fromEntries((version===1?OLD_IDS:[...OLD_IDS,'form']).map(id=>[id,id==='create'?[1]:[2,4]])),...(version===3?{formEnabled:true}:{})}}
for(const version of [1,3]){
 const input=settings(version),original=copy(input),out=School.validate(input);assert.deepEqual(input,original);assert.equal(out.schemaVersion,6);assert.equal(out.programmeEnabled,false);assert.equal(out.formEnabled,version===3);assert.deepEqual(out.levels.programme,[1,2,3,4]);
 for(const id of Object.keys(input.levels))assert.deepEqual(out.levels[id],input.levels[id]);for(const key of ['schoolName','logo','defaultLanguage','colourPreset','ageGroups','themes'])assert.deepEqual(out[key],input[key]);
 out.levels.groove.pop();assert.deepEqual(input,original);
 for(const mutate of [s=>s.programmeEnabled=true,s=>s.levels.programme=[1],s=>s.levels.theme=[],s=>s.levels.theme=[0],s=>s.levels.create=[2],s=>s.levels.unknown=[1],s=>delete s.levels.rhythm,s=>s.themes=['conversation'],s=>s.future=true]){const bad=settings(version);mutate(bad);const untouched=copy(bad);assert.throws(()=>School.validate(bad));assert.deepEqual(bad,untouched)}
}
for(const version of [2,4,0,6,'5'])assert.throws(()=>School.validate({...settings(3),schemaVersion:version}));
assert.equal(School.validate({...settings(3),formEnabled:false}).formEnabled,false);
assert.equal(School.defaults().schemaVersion,6);assert.equal(School.defaults().programmeEnabled,true);assert.deepEqual(School.defaults().themes,['theme','groove','conversation']);
assert.throws(()=>School.validate({...settings(1),formEnabled:true}));
console.log('PASS: independent12 pulse/12 symbol fixtures, finite pulse permutations,272 ungraded patterns, strict archive and historical schema1/3→6 oracles (pure Node).');
(async()=>{for(const lang of ['nn','nb','en']){
 const t=setup(lang);t.run("go('programme')");assert.equal(t.run('route'),'programme');
 assert.deepEqual(get(t,'WGCore.slots.map(s=>s.id)'),['w1-pulse','w1-symbol','w1-create']);
 for(const word of Object.values(get(t,'wgWords')))assert.equal(word.length,3,'All programme controls have NN/NB/EN strings');
 for(const level of [1,2,3,4]){
  t.run(`wgAction('level','${level}')`);
  for(const brief of level===4?[1,2,3]:[level]){
   if(level===4)t.run(`wgAction('brief','${brief}')`);
   t.run("wgAction('task','pulse')");
   const expected=LABELS[brief-1];
   for(let i=0;i<expected.length;i++)t.run(`wgAction('label',${JSON.stringify(expected[i])});wgAction('place','${i}')`);
   t.run("wgAction('check')");assert.equal(t.run('wg.message'),t.run("wgText('right')"));const done=t.run(`data.programmePractice.done['w1-pulse-${level}']`);t.run("wgAction('check');go('home');go('programme');wgAction('check')");assert.equal(t.run(`data.programmePractice.done['w1-pulse-${level}']`),done,'Repeated checks/navigation do not farm credit');
   t.run("wgAction('task','symbol')");t.run(`wgAction('symbol','${RESTS[brief-1]}')`);assert.equal(t.run('wg.message'),t.run("wgText('right')"));
   const symbols=t.run(`data.programmePractice.done['w1-symbol-${level}']`);t.run(`wgAction('symbol','${RESTS[brief-1]}')`);assert.equal(t.run(`data.programmePractice.done['w1-symbol-${level}']`),symbols);
  }
 }
 assert.equal(t.contexts.length,0,'Visual objectives do not initialise audio');assert.equal(t.notes.length,0);
 t.run("wgAction('level','1');wgAction('task','create');wg.pattern=[1,0,1,0];wgAction('snapshot');wgAction('cell','1');wgAction('undo')");assert.deepEqual(get(t,'wg.pattern'),[1,0,1,0]);assert.deepEqual(get(t,'wg.previous'),{division:1,pattern:[1,0,1,0]});
 t.run("wgAction('cell','1');wgAction('save');wgAction('save')");assert.equal(t.run('data.programmePractice.creations.length'),1);const saved=get(t,'data.programmePractice.creations[0]');
 t.run("wgAction('level','3');wgAction('task','symbol');go('home');nvContinue()");assert.equal(t.run('route'),'programme');assert.equal(t.run('wg.task'),'symbol');assert.equal(t.run('wg.level'),3,'Continue retains pupil choice, not initial entry');
 t.run("wgAction('open','0')");assert.deepEqual(get(t,'wg.pattern'),saved.pattern);assert.deepEqual(get(t,'wg.previous'),saved.previous);
 t.run("document.documentElement.lang='en';schoolSettings.schoolName='New branding';wgDraw()");assert.deepEqual(get(t,'data.programmePractice.creations[0]'),saved);
 const reloaded=setup(lang,{stored:t.stored});assert.deepEqual(get(reloaded,'data.programmePractice.creations[0]'),saved);assert.equal(reloaded.run('wg.previous'),null,'Only explicit saved archive survives, not editor state');
 // Seed all current archives simultaneously before testing older/invalid imports.
 t.run("data.groovePractice={version:1,level:2,done:{'repair-2':3},creations:[{level:2,pattern:[1,0,1,0,1,0,0,0]}]};data.formPractice={version:1,level:2,done:{'build-2':4},creations:[{level:2,map:['A','B','A'],previous:['A','A']}]};data.stats.rhythm={done:9,correct:6};save();exportData()");
 const backup=JSON.parse(await t.exported[0].text()),snapshot=t.run('JSON.stringify(data)'),theme=t.run('JSON.stringify(thStore)'),stored=t.stored['musikkverkstad-v1'];
 const mutations=[v=>v.programmePractice=null,v=>v.programmePractice.version=2,v=>v.programmePractice.creations[0].challenge='future',v=>v.programmePractice.creations[0].previous.pattern=[2,0,1,0],v=>v.groovePractice=null,v=>v.formPractice=null,v=>v.themeEnding={version:99}];
 for(const mutate of mutations){const bad=copy(backup);bad.stats.rhythm={done:20,correct:10};bad.volume=.8;mutate(bad);await upload(t,bad);assert.equal(t.run('JSON.stringify(data)'),snapshot,'Invalid sibling rejects base and every archive atomically');assert.equal(t.run('JSON.stringify(thStore)'),theme);assert.equal(t.stored['musikkverkstad-v1'],stored)}
 for(const omitted of [['programmePractice'],['groovePractice','formPractice'],['programmePractice','groovePractice','formPractice']]){const older=copy(backup);for(const key of omitted)delete older[key];await upload(t,older);for(const key of ['programmePractice','groovePractice','formPractice'])assert.deepEqual(get(t,'data.'+key),backup[key],'Older backups preserve newer optional histories independently')}
 const clear=copy(backup);clear.programmePractice=Core.empty();t.run('confirm=()=>false');await upload(t,clear);assert.deepEqual(get(t,'data.programmePractice'),backup.programmePractice);t.run('confirm=()=>true');await upload(t,clear);assert.deepEqual(get(t,'data.programmePractice'),Core.empty());assert.deepEqual(get(t,'data.groovePractice'),backup.groovePractice);assert.deepEqual(get(t,'data.formPractice'),backup.formPractice);
 await upload(t,backup);
 const restricted=setup(lang,{stored:{'musikkverkstad-v1':JSON.stringify(backup)}});restricted.run("schoolSettings.levels.programme=[2,4];go('programme');wgAction('open','0')");assert.equal(restricted.run('wg.level'),2);assert.equal(restricted.run('data.programmePractice.creations.length'),1);restricted.run("go('home');schoolSettings.programmeEnabled=false");const untouched=restricted.run('JSON.stringify(data.programmePractice)');restricted.run("wgAction('open','0');wgAction('task','create');go('programme')");assert.notEqual(restricted.run('route'),'programme');assert.equal(restricted.run('JSON.stringify(data.programmePractice)'),untouched);restricted.run('exportData()');assert.deepEqual(JSON.parse(await restricted.exported[0].text()).programmePractice,backup.programmePractice);
 const importedLevel=setup(lang);importedLevel.run("go('programme');wgAction('task','create')");const selectedLevel=get(importedLevel,'data');selectedLevel.programmePractice.level=3;await upload(importedLevel,selectedLevel);importedLevel.run("go('programme');wgAction('save')");assert.equal(importedLevel.run('wg.division'),2,'Confirmed imported configuration3 needs coherent eighth-note editor');assert.equal(importedLevel.run('wg.pattern.length'),8);assert.equal(importedLevel.run('data.programmePractice.creations.length'),1,'Valid post-import work can be saved, not misreported duplicate');
 const silent=setup(lang);silent.run("go('programme');wgAction('task','create');wg.pattern=[0,0,0,0];wgAction('save')");await silent.run('wgPlay()');assert.equal(silent.contexts.length,0,'Entirely silent creation does not start fake audio');assert.equal(silent.run('wg.message'),silent.run("wgText('silent')"));assert.deepEqual(get(silent,'data.programmePractice.creations[0].pattern'),[0,0,0,0]);
 const denied=setup(lang);denied.run("localStorage.setItem=()=>{throw Error('quota')};go('programme');wgAction('task','create');wgAction('save');exportData()");assert.equal(denied.run('storageOK'),false);assert.equal(JSON.parse(await denied.exported[0].text()).programmePractice.creations.length,1);
 const raw='{corrupt';const damaged=setup(lang,{stored:{'musikkverkstad-v1':raw}});damaged.run("go('programme');wgAction('task','create');wgAction('save')");assert.equal(damaged.stored['musikkverkstad-v1'],raw);assert.equal(damaged.run('storageOK'),false);assert.equal(damaged.run('data.programmePractice.creations.length'),1);const broken=copy(backup);broken.programmePractice=null;await upload(damaged,broken);assert.equal(damaged.stored['musikkverkstad-v1'],raw);await upload(damaged,backup);assert.equal(damaged.run('storageCorrupt'),false);assert.deepEqual(get(damaged,'data.programmePractice'),backup.programmePractice);
 console.log(`PASS ${lang}: all tasks/configurations, one-credit semantics, free navigation, revision/undo/saves, simultaneous archives, atomic/missing/replacement imports, restrictions and storage faults (Node simulation).`);
}
console.log('No native browser, audible speaker, human teacher/pupil or physical-device verification claimed.');
})().catch(error=>{console.error(error);process.exitCode=1});
