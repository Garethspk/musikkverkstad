// Independent Week2 musical/data QA. Node/VM/DOM/storage simulations only;
// not native rendering, audible speakers, human teaching or pupil evidence.
const assert=require('node:assert/strict');
const Core=require('../src/week2-core.js');
const School=require('../src/school/config.js');
const {setup}=require('./audio.cjs');
const copy=v=>JSON.parse(JSON.stringify(v));
const get=(t,s)=>copy(t.run(s));
const frozen=v=>{if(v&&typeof v==='object'){Object.values(v).forEach(frozen);Object.freeze(v)}return v};
const plan=(change={})=>({slot:'w2-plan',type:'practice-plan',challenge:'restart',revision:1,level:1,choice:'fragment',previous:null,...change});
const W2={version:1,level:4,done:{'w2-form/form-1/r1/l1':5,'w2-contour/contour-1/r1/l4':3},plans:[plan({level:4,choice:'pulse',previous:'fragment'})]};
const ARCHIVES={
 groovePractice:{version:1,level:2,done:{'listen-2':11,'repair-1':2},creations:[{level:2,pattern:[1,0,1,1,0,1,0,1]}]},
 conversationPractice:{version:2,level:4,done:{'listen-4':7,'build-2':3},creations:[{level:4,brief:'down',call:[60,62,64,67].map(notes=>({notes,dur:1})),response:[69,67,64,60].map(notes=>({notes,dur:1})),previous:null}],legacyEcho:null},
 formPractice:{version:1,level:3,done:{'puzzle-3':5,'build-2':4},creations:[{level:3,map:['B','Bv','A','A'],previous:['A','B','A']}]},
 programmePractice:{version:1,level:4,done:{'w1-pulse-3':6,'w1-symbol-1':4},creations:[{slot:'w1-create',challenge:'rhythm-free.v1',revision:1,level:4,brief:3,division:2,pattern:[0,1,0,0,1,0,1,0],previous:{division:1,pattern:[0,0,0,0]}}]},
 week2Practice:W2
};
const EMPTY={
 groovePractice:{version:1,level:1,done:{},creations:[]},
 conversationPractice:{version:2,level:1,done:{},creations:[],legacyEcho:null},
 formPractice:{version:1,level:1,done:{},creations:[]},
 programmePractice:{version:1,level:1,done:{},creations:[]},
 week2Practice:{version:1,level:1,done:{},plans:[]}
};
const TH={version:1,done:{'listen-2':true,'create-1':true},creations:[{level:1,notes:[60,62,64,67,60,62,64,69]}]};
function seeded(locale){const t=setup(locale),value=get(t,'emptyData()');Object.assign(value,copy(ARCHIVES));value.volume=.43;value.levels.rhythm=2;value.stats.rhythm={done:7,correct:4};value.observations['rhythm-2']=[true,false];value.creations=[{title:'Bevart variant',notes:[60,62,64,67,60,62,69,60]}];t.run(`data=validData(${JSON.stringify(value)});save();thStore=thValid(${JSON.stringify(TH)});thPersist()`);return t}
async function exported(t){t.run('exportData()');return JSON.parse(await t.exported.at(-1).text())}
async function upload(t,value){const text=JSON.stringify(value);await t.listeners['importFile:change']({target:{files:[{size:Buffer.byteLength(text),text:async()=>text}],value:'file'}})}
function snapshot(t){return {data:get(t,'data'),theme:get(t,'thStore'),raw:t.stored['musikkverkstad-v1'],themeRaw:t.stored['musikkverkstad-theme-ending-v1']}}
function archives(t){for(const [key,value]of Object.entries(ARCHIVES))assert.deepEqual(get(t,'data.'+key),value);assert.deepEqual(get(t,'thStore'),TH)}

// Schema6 is deliberately unchanged; Week2 inherits programme consent and levels.
assert.equal(School.defaults().schemaVersion,6);assert.equal(Object.keys(School.defaults().levels).length,11);
assert.deepEqual(Core.valid(undefined),EMPTY.week2Practice);
assert.deepEqual(Core.empty(),EMPTY.week2Practice);
const untouched=copy(W2),normalized=Core.valid(frozen(copy(W2)));assert.deepEqual(normalized,W2);normalized.plans[0].choice='model';assert.deepEqual(W2,untouched,'No aliases/mutation');
const invalidProgress=[null,[],{},...['version','level','done','plans'].map(k=>{const v=copy(W2);delete v[k];return v}),{...W2,version:2},{...W2,future:true},{...W2,level:true},{...W2,level:0},{...W2,level:5},{...W2,done:[]},{...W2,plans:{}},
 ...['w1-pulse-1','w2-plan/restart/r1/l1','w2-form/form-9/r1/l1','w2-contour/contour-1/r2/l1','w2-form/form-1/r1/l0','w2-form/contour-1/r1/l1'].map(key=>({...copy(W2),done:{[key]:1}})),
 ...[-1,0,.5,1000001,true,NaN,Infinity].map(n=>({...copy(W2),done:{'w2-form/form-1/r1/l1':n}}))];
for(const v of invalidProgress)assert.throws(()=>Core.valid(v));
const invalidPlanMutations=[c=>c.slot='w1-create',c=>c.type='contour',c=>c.challenge='future',c=>c.revision=2,c=>c.level=true,c=>c.level=0,c=>c.level=5,c=>c.choice='future',c=>c.previous='future',c=>c.previous={},c=>c.name='pupil',...Object.keys(plan()).map(k=>c=>delete c[k])];
for(const mutate of invalidPlanMutations){const c=plan();mutate(c);assert.throws(()=>Core.valid({...Core.empty(),plans:[c]}))}
assert.throws(()=>Core.valid({...Core.empty(),plans:[plan(),Object.fromEntries(Object.entries(plan()).reverse())]}),'Duplicate validation independent of key order');
// Several defensible plans, including unchanged reconsideration, remain ungraded.
for(const challenge of ['restart','transition','rhythm','coordination','energy','expression'])for(const choice of ['fragment','pulse','model'])for(const previous of [null,'fragment','pulse','model'])assert.deepEqual(Core.valid({...Core.empty(),plans:[plan({challenge,choice,previous})]}).plans[0],plan({challenge,choice,previous}));
const twenty=Array.from({length:20},(_,i)=>plan({challenge:['restart','transition','rhythm','coordination','energy','expression'][i%6],level:1+Math.floor(i/6)}));assert.equal(Core.valid({...Core.empty(),plans:twenty}).plans.length,20);assert.throws(()=>Core.valid({...Core.empty(),plans:[...twenty,plan({level:4,choice:'model'})]}));

async function persistence(){for(const locale of ['nn','nb','en']){
 const t=seeded(locale),initial=snapshot(t),backup=await exported(t);archives(t);await upload(t,backup);assert.deepEqual(snapshot(t),initial);
 const keys=Object.keys(ARCHIVES);
 for(let mask=0;mask<32;mask++){
  const incoming=copy(backup);keys.forEach((key,i)=>{if(mask&(1<<i))delete incoming[key];else incoming[key]=copy(EMPTY[key])});
  const target=seeded(locale);await upload(target,incoming);
  keys.forEach((key,i)=>assert.deepEqual(get(target,'data.'+key),mask&(1<<i)?ARCHIVES[key]:EMPTY[key],`subset${mask} independently preserves/replaces ${key}`));assert.deepEqual(get(target,'thStore'),TH);
 }
 const noTheme=copy(backup);delete noTheme.themeEnding;await upload(t,noTheme);archives(t);
 for(const key of keys){const target=seeded(locale),incoming=copy(backup);incoming[key]=copy(EMPTY[key]);const before=snapshot(target);target.run('confirm=()=>false');await upload(target,incoming);assert.deepEqual(snapshot(target),before,'Cancelled import has no mutations');target.run('confirm=()=>true');await upload(target,incoming);assert.deepEqual(get(target,'data.'+key),EMPTY[key]);for(const other of keys.filter(k=>k!==key))assert.deepEqual(get(target,'data.'+other),ARCHIVES[other]);assert.deepEqual(get(target,'thStore'),TH)}
 const mutations=[...keys.map(key=>v=>v[key]=null),...keys.map(key=>v=>v[key].version=99),v=>v.week2Practice.plans[0].challenge='unknown',v=>v.week2Practice.plans[0].previous='unknown',v=>v.week2Practice.done['w2-plan/restart/r1/l1']=1,v=>v.week2Practice.plans.push(copy(v.week2Practice.plans[0])),v=>v.programmePractice.creations[0].previous.pattern[0]=2,v=>v.themeEnding={version:99},v=>v.stats.rhythm.correct=1000001];
 for(const mutate of mutations){const bad=copy(backup);bad.volume=.8;bad.stats.rhythm={done:21,correct:20};mutate(bad);await upload(t,bad);assert.deepEqual(snapshot(t),initial,'Invalid sibling rejects every archive/base/Theme01/stored byte atomically')}
 for(const next of ['nn','nb','en']){const restored=setup(next,{stored:t.stored});archives(restored);assert.equal(restored.stored['musikkverkstad-language'],next)}
 t.run("schoolSettings.schoolName='Updated branding';schoolSettings.defaultLanguage='en';schoolSettings.levels.programme=[2];schoolSettings.formEnabled=false;go('home')");archives(t);assert.deepEqual((await exported(t)).week2Practice,W2);
 const disabled=seeded(locale);disabled.run("schoolSettings.programmeEnabled=false;go('home')");const before=snapshot(disabled);disabled.run("go('week2');w2Action('open','0');w2Action('choice','model');w2Action('save');w2Action('form-link')");assert.notEqual(disabled.run('route'),'week2');assert.notEqual(disabled.run('route'),'form');assert.deepEqual(snapshot(disabled),before,'Disabled module cannot reopen/mutate');assert.deepEqual((await exported(disabled)).week2Practice,W2);
 const raw=JSON.stringify({...copy(initial.data),week2Practice:{version:99}}),damaged=setup(locale,{stored:{'musikkverkstad-v1':raw,'musikkverkstad-theme-ending-v1':JSON.stringify(TH)}});damaged.run("go('week2');w2Action('task','plan');w2Action('choice','fragment');w2Action('save')");assert.equal(damaged.stored['musikkverkstad-v1'],raw,'Corrupt raw bytes protected against practice save');assert.equal(damaged.run('storageOK'),false);const bad=copy(backup);bad.week2Practice=null;await upload(damaged,bad);assert.equal(damaged.stored['musikkverkstad-v1'],raw);await upload(damaged,backup);assert.equal(damaged.run('storageCorrupt'),false);archives(damaged);
 const denied=setup(locale);denied.run("localStorage.setItem=()=>{throw Error('quota')};go('week2');w2Action('task','plan');w2Action('choice','fragment');w2Action('save')");assert.equal(denied.run('storageOK'),false);assert.equal((await exported(denied)).week2Practice.plans.length,1,'Quota work remains exportable in memory');
 assert.equal(t.contexts.length,0);assert.equal(t.notes.length,0);console.log(`PASS ${locale}: independent32 missing-extension subsets, explicit/cancelled replacement, invalid sibling atomicity, Theme02 preservation, locale/branding reload, corrupt/quota safety (Node simulation).`);
}}

// Independent pitch oracle: direction of EVERY adjacent pair, never endpoints alone.
function direction(events){let higher=0,lower=0,equal=0;for(let i=1;i<events.length;i++){if(events[i].notes>events[i-1].notes)higher++;else if(events[i].notes<events[i-1].notes)lower++;else equal++}return equal===events.length-1?'level':higher===events.length-1?'up':lower===events.length-1?'down':'mixed'}
let finitePitchCases=0;
for(const length of [2,3,4,5])for(let n=0;n<5**length;n++){
 let code=n;const events=Array.from({length},()=>{const notes=[60,62,64,67,69][code%5];code=Math.floor(code/5);return {notes,dur:1}});assert.equal(Core.classify(events),direction(events));finitePitchCases++;
}
assert.equal(finitePitchCases,3900);
for(const bad of [null,[],[{notes:60,dur:1}],[{notes:null,dur:1},{notes:62,dur:1}],[{notes:true,dur:1},{notes:62,dur:1}],[{notes:59,dur:1},{notes:62,dur:1}],[{notes:60,dur:0},{notes:62,dur:1}],[{notes:60,dur:Infinity},{notes:62,dur:1}]])assert.throws(()=>Core.classify(bad));
assert.equal(Core.classify([{notes:60,dur:1},{notes:67,dur:1},{notes:64,dur:1},{notes:69,dur:1}]),'mixed','A rising ending does not make every adjacent interval rise');
assert.equal(Core.classify([{notes:60,dur:1},{notes:62,dur:1},{notes:62,dur:1},{notes:67,dur:1}]),'mixed','A plateau violates STRICT rising');
assert.equal(Core.classify([{notes:67,dur:1},{notes:67,dur:1},{notes:64,dur:1},{notes:60,dur:1}]),'mixed','A plateau violates STRICT falling');
const MATERIAL={A:[60,62,64,67],Av:[60,62,64,69],B:[67,64,62,60],Bv:[67,64,62,62]};
assert.deepEqual(Core.material,MATERIAL,'Form source data matches independently specified Formverkstad musical miniatures');
function formAnswer(item,option){const [left,right]=item.pair.map(i=>option.map[i]);return item.brief==='repeat'?MATERIAL[left].every((p,i)=>p===MATERIAL[right][i]):left==='A'&&right==='B'||left==='B'&&right==='A'}
function subsets(items){return Array.from({length:2**items.length},(_,mask)=>items.filter((_,i)=>mask&(1<<i)))}
function eventTuples(events){return events.map(e=>[e.notes,e.dur])}
const tupleEvents=pairs=>pairs.map(([notes,dur])=>({notes,dur}));
// Literal curated cases: reviewed independently of production constructors/predicates.
const FORMS=[
 ['repeat',[0,1],[['A','A'],['A','B'],['B','B'],['A','Av']],['a','c']],
 ['contrast',[0,1],[['Av','A'],['B','A'],['B','Bv'],['A','B']],['b','d']],
 ['repeat',[1,2],[['B','A','A'],['A','A','Av'],['B','A','B'],['A','B','B']],['a','d']],
 ['contrast',[1,2],[['B','B','Bv'],['A','A','B'],['B','B','A'],['A','Av','B']],['b','c']],
 ['repeat',[0,1],[['A','Av'],['Av','Av'],['B','Bv'],['Bv','Bv']],['b','d']],
 ['contrast',[0,1],[['A','B','A'],['A','Av','B'],['B','Bv','B'],['Bv','B','A']],['a']],
 ['repeat',[2,3],[['A','A','B','Bv'],['B','Av','Bv','Bv'],['Av','B','Av','Av'],['B','B','Av','A']],['b','c']],
 ['contrast',[2,3],[['A','B','B','Bv'],['Av','Av','B','A'],['B','A','Av','A'],['Bv','A','A','B']],['b','d']]
];
const CONTOURS=[
 ['up',[[[60,1],[62,1],[64,1],[67,1]],[[60,1],[67,1],[64,1],[69,1]],[[60,1],[64,1],[67,1],[69,1]],[[64,1],[64,1],[64,1],[64,1]]],['a','c']],
 ['down',[[[69,1],[64,1],[67,1],[60,1]],[[69,1],[67,1],[64,1],[60,1]],[[69,1],[64,1],[62,1],[60,1]],[[60,1],[62,1],[64,1],[67,1]]],['b','c']],
 ['level',[[[64,1],[64,1],[64,1],[64,1]],[[60,.5],[60,.5],[62,1],[62,2]],[[60,1],[64,1],[69,1],[64,1]],[[67,1],[67,1],[67,2]]],['a','d']],
 ['mixed',[[[60,1],[62,1],[67,1],[69,1]],[[60,1],[64,1],[69,1],[64,1]],[[62,1],[62,1],[62,1],[62,1]],[[67,1],[64,1],[60,1],[64,1]]],['b','d']],
 ['mixed',[[[69,1],[64,1],[60,1],[62,1]],[[69,1],[67,1],[64,1],[60,1]],[[64,1],[64,1],[64,1],[64,1]],[[60,1],[62,1],[67,1],[69,1]]],['a']],
 ['mixed',[[[67,1],[64,1],[62,1],[60,1]],[[60,.5],[62,1.5],[62,1],[67,1]],[[67,1],[67,1],[64,1],[60,1]],[[60,1],[64,1],[67,1],[69,1]]],['b','c']],
 ['mixed',[[[64,1],[64,1],[64,1],[64,1]],[[60,1],[67,1],[64,1],[60,1]],[[60,1],[62,1],[64,1],[69,1]],[[67,1],[60,1],[62,1],[67,1]]],['b','d']],
 ['up',[[[60,1],[67,1],[69,2]],[[69,1],[67,1],[60,2]],[[60,1],[60,1],[69,2]],[[62,1],[64,1],[69,2]]],['a','d']]
];
assert.equal(Core.forms.length,8);assert.equal(Core.contours.length,8);assert.equal(Core.scenarios.length,6);
assert.deepEqual(Core.slots.map(s=>[s.id,s.type,s.mechanic,s.revision,s.humanValidation,s.pupilRelease]),[
 ['w2-form','form-detective','compare-pairs',1,'PENDING','BLOCKED'],['w2-contour','melody-contour','pitch-compare',1,'PENDING','BLOCKED'],['w2-plan','practice-plan','scenario-revision',1,'PENDING','BLOCKED']]);
let offeredSubsets=0;
for(const [i,item]of Core.forms.entries()){
 const [brief,pair,maps,truth]=FORMS[i];assert.equal(item.id,'form-'+(i+1));assert.equal(item.brief,brief);assert.deepEqual(item.pair,pair);assert.deepEqual(item.options.map(o=>o.map),maps);assert.deepEqual(item.options.filter(o=>formAnswer(item,o)).map(o=>o.id),truth);
 for(const o of item.options)assert.equal(Core.fitsForm(item,o.id),truth.includes(o.id));assert.equal(Core.fitsForm(item,'missing'),false);
}
for(const [i,item]of Core.contours.entries()){
 const [kind,events,truth]=CONTOURS[i];assert.equal(item.id,'contour-'+(i+1));assert.equal(item.kind,kind);assert.deepEqual(item.options.map(o=>eventTuples(o.events)),events);assert.deepEqual(item.options.filter(o=>direction(o.events)===kind).map(o=>o.id),truth);
 for(const o of item.options){assert.equal(o.events.reduce((n,e)=>n+e.dur,0),4);for(const query of ['up','down','level','mixed'])assert.equal(Core.fitsContour(item,o.id,query),direction(o.events)===query)}assert.equal(Core.fitsContour(item,'missing'),false);
}
for(const [bank,truths]of [[Core.forms,FORMS],[Core.contours,CONTOURS]])for(const level of [1,2,3,4])for(const [i,item]of bank.entries()){
 const offered=Core.options(item,level);assert.equal(offered.length,level===1?2:level===2?3:4);const truth=truths[i].at(-1).filter(id=>offered.some(o=>o.id===id));assert(truth.length>0);assert(truth.length<offered.length,'Every case/configuration has a genuine distractor');
 for(const selected of subsets(offered.map(o=>o.id))){const expected=selected.length===truth.length&&truth.every(id=>selected.includes(id));const actual=selected.length===offered.filter(o=>bank===Core.forms?Core.fitsForm(item,o.id):Core.fitsContour(item,o.id)).length&&selected.every(id=>bank===Core.forms?Core.fitsForm(item,id):Core.fitsContour(item,id));assert.equal(actual,expected);offeredSubsets++}
}
assert(new Set(FORMS.map(x=>x.at(-1).join())).size>=4);assert(new Set(CONTOURS.map(x=>x.at(-1).join())).size>=4,'Answers vary by position and cardinality, not first-button pattern');
for(const s of Core.scenarios){assert.equal(s.prompt.length,3);assert.equal(s.choices.length,3);for(const c of s.choices)for(const value of [c.label,c.feedback])assert.equal(value.length,3);for(const locale of [0,1,2]){assert.equal(new Set(s.choices.map(c=>c.label[locale])).size,3);assert.equal(new Set(s.choices.map(c=>c.feedback[locale])).size,3)}}
console.log(`PASS: 8 literal Form/8 original contour/6 scenario cases; ${finitePitchCases} independent pitch strings, ${offeredSubsets} offered answer subsets, strict versioned plans and exact schema6 (pure Node).`);

async function interaction(){for(const locale of ['nn','nb','en']){
 const t=setup(locale);for(const [key,value]of Object.entries(get(t,'w2Words')))assert.equal(value.length,key==='configs'||key==='planConfigs'?4:3,`Complete locale entries: ${key}`);
 for(const task of ['form','contour','plan'])for(const level of [1,2,3,4]){
  t.run(`w2Action('enter','${task}');w2Action('level','${level}')`);assert.equal(t.run('route'),'week2');assert.equal(t.run('w2.task'),task);assert.equal(t.run('w2.level'),level);
  t.run("go('home');nvContinue()");assert.equal(t.run('route'),'week2');assert.equal(t.run('w2.task'),task);assert.equal(t.run('w2.level'),level);
  const reloaded=setup(locale,{stored:t.stored});reloaded.run('nvContinue()');assert.equal(reloaded.run('route'),'week2');assert.equal(reloaded.run('w2.task'),task);assert.equal(reloaded.run('w2.level'),level,'Remembered configuration survives actual script reload without answers');assert.deepEqual(get(reloaded,'w2.selected'),[]);assert.equal(reloaded.run('w2.choice'),null);
 }
 let checked=0;
 for(const task of ['form','contour'])for(const level of [1,2,3,4]){
  t.run(`w2Action('enter','${task}');w2Action('level','${level}')`);
  const queries=level===4?(task==='form'?['repeat','contrast']:['up','down','level','mixed']):[null];
  for(const query of queries){if(query)t.run(`w2Action('${task==='form'?'brief':'kind'}','${query}')`);const list=get(t,'w2List()');
   for(let i=0;i<list.length;i++){
    const item=get(t,'w2Item()'),index=Number(item.id.split('-')[1])-1,truth=(task==='form'?FORMS:CONTOURS)[index].at(-1),offered=get(t,'W2Core.options(w2Item(),w2.level)').map(o=>o.id),accepted=truth.filter(id=>offered.includes(id));
    t.run("w2Action('check')");assert.equal(t.run('w2.message'),t.run("w2Text('retry')"),'Empty selection is not a completed round');
    for(const id of accepted)t.run(`w2Action('answer','${id}')`);t.run("w2Action('check')");assert.equal(t.run('w2.message'),t.run("w2Text('right')"));const key=`w2-${task}/${item.id}/r1/l${level}`,count=get(t,'data.week2Practice.done')[key];assert.equal(count,1);t.run("w2Action('check');go('home');go('week2');w2Action('check')");assert.equal(get(t,'data.week2Practice.done')[key],count,'Checking/revisiting same question cannot farm credit');checked++;
    if(i+1<list.length)t.run("w2Action('next')");
   }
  }
 }
 const beforePlan=get(t,'data.week2Practice.done');t.run("w2Action('task','plan');w2Action('level','1')");
 for(const choice of ['fragment','pulse','model']){t.run(`w2Action('choice','${choice}')`);assert.deepEqual(get(t,'data.week2Practice.done'),beforePlan,'No defensible scenario branch is graded')}
 t.run("w2Action('choice','fragment');w2Action('snapshot');w2Action('choice','pulse');w2Action('save');w2Action('save')");assert.equal(t.run('data.week2Practice.plans.length'),1);assert.deepEqual(get(t,'data.week2Practice.plans[0]'),plan({choice:'pulse',previous:'fragment'}));const saved=get(t,'data.week2Practice.plans[0]');
 const fresh=setup(locale,{stored:t.stored});fresh.run("go('progress');w2Action('open','0')");assert.equal(fresh.run('route'),'week2');assert.equal(fresh.run('w2.task'),'plan');assert.equal(fresh.run('w2.choice'),saved.choice);assert.equal(fresh.run('w2.previous'),saved.previous);
 const limited=setup(locale);limited.run("schoolSettings.levels.programme=[2,4];schoolSettings.levels.form=[4];go('week2');w2Action('task','form')");assert.equal(limited.run('w2.level'),2);const formPreference=limited.run('data.formPractice.level');limited.run("w2Action('form-link')");assert.equal(limited.run('route'),'form');assert.equal(limited.run('fo.level'),4);assert.equal(limited.run('fo.brief'),'repeat');assert.equal(limited.run('data.formPractice.level'),formPreference,'Scoped Form entry does not rewrite pupil Form preference');limited.run("w2Action('return')");assert.equal(limited.run('route'),'week2');
 for(const formLevels of [[2],[3],[2,3]]){const restricted=setup(locale);restricted.run(`schoolSettings.levels.form=${JSON.stringify(formLevels)};go('week2');w2Action('task','form');w2Action('answer','a');w2Action('check');w2Action('form-link')`);assert.equal(restricted.run('route'),'week2');assert.deepEqual(get(restricted,'data.week2Practice.done'),{});assert.equal(restricted.run('w2FormAllowed()'),false,'Never force forbidden Form1/4');restricted.run("w2Action('task','contour')");assert.equal(restricted.run('w2.task'),'contour')}
 const noForm=setup(locale);noForm.run("schoolSettings.formEnabled=false;go('week2');w2Action('task','form');w2Action('answer','a');w2Action('check');w2Action('form-link')");assert.equal(noForm.run('route'),'week2');assert.deepEqual(get(noForm,'data.week2Practice.done'),{});noForm.run("w2Action('task','plan');w2Action('choice','model');w2Action('save')");assert.equal(noForm.run('data.week2Practice.plans.length'),1,'Other task remains independent when Form unavailable');
 assert.equal(t.contexts.length,0);assert.equal(t.notes.length,0);console.log(`PASS ${locale}: ${checked} musical cases/configurations, independent three-task Continue/reload, no answer farming/plan scores, scoped Form consent/levels, explicit revision/open (Node simulation).`);
}}
(async()=>{await interaction();await persistence();console.log('No human, pupil, real assistive-technology, native rendering, physical-device or speaker validation claimed. Human validation PENDING; pupil release BLOCKED.');})().catch(error=>{console.error(error);process.exitCode=1});
