// Independently authored Week4 musical/domain/controller/backup QA.
// Node VM/DOM/storage/audio simulations, not native browser or human/device evidence.
const assert=require('node:assert/strict');
const Core=require('../src/week4-core.js');
const School=require('../src/school/config.js');
const {setup}=require('./audio.cjs');
const copy=v=>JSON.parse(JSON.stringify(v));
const get=(t,s)=>copy(t.run(s));
const freeze=v=>{if(v&&typeof v==='object'){Object.values(v).forEach(freeze);Object.freeze(v)}return v};
// Exact worked material and alternatives frozen BEFORE production code.
const MATERIAL={A:[60,62,64,67],Av:[60,62,64,69],B:[67,64,62,60],Bv:[67,64,62,62],X:[62,64,67,69],Y:[69,67,64,62]};
const PATHS=[
 {id:'path-1',before:['A','B','A'],revised:['A','B','B','A'],pairs:[[0,3]]},
 {id:'path-2',before:['B','A','B'],revised:['B','A','A','B'],pairs:[[0,3]]},
 {id:'path-3',before:['A','B','A'],revised:['A','B','A','B'],pairs:[[0,2],[1,3]]},
 {id:'path-4',before:['A','B','B','A'],revised:['A','A','B','A'],pairs:[[0,3],[1,3]]},
 {id:'path-5',before:['A','B','A','B'],revised:['A','B','B','A','B'],pairs:[[0,3],[1,4],[2,4]]},
 {id:'path-6',before:['A','Av','A'],revised:['A','B','Av','A'],pairs:[[0,3]]},
 {id:'path-7',before:['B','Bv','B'],revised:['B','A','Bv','B'],pairs:[[0,3]]},
 {id:'path-8',before:['A','B','A'],revised:['A','B','A','Av','B','A'],pairs:[[0,2],[0,5],[1,4],[2,5]]}
];
const STORY_MAPS=[['A','B','A'],['X','X'],['A','B'],['B','A'],['Av','A'],['X','Y','X'],['A','Bv'],['B','B','A']];
const TILE={q:{ticks:2,note:true},r:{ticks:2,note:false},e:{ticks:1,note:true},er:{ticks:1,note:false},h:{ticks:4,note:true},hr:{ticks:4,note:false}};
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
function independentPairs(map){const out=[];for(let a=0;a<map.length;a++)for(let b=a+2;b<map.length;b++)if(same(MATERIAL[map[a]],MATERIAL[map[b]])&&map.slice(a+1,b).some(id=>!same(MATERIAL[id],MATERIAL[map[a]])))out.push([a,b]);return out}
const exactCount=(p,k,n)=>p.filter(x=>x===k).length===n;
const only=(p,keys)=>p.every(k=>keys.includes(k));
const sum=p=>p.reduce((n,k)=>n+TILE[k].ticks,0);
function matches(index,p){if(sum(p)!==8)return false;switch(index){
 case 0:return only(p,['q','r'])&&p.length===4&&exactCount(p,'r',1);
 case 1:return only(p,['h','hr'])&&exactCount(p,'h',1)&&exactCount(p,'hr',1);
 case 2:return only(p,['e','er'])&&p.length===8&&exactCount(p,'er',2)&&p.every((k,i)=>k!=='er'||p[i+1]!=='er');
 case 3:return only(p,['q','r','h'])&&['q','r','h'].every(k=>exactCount(p,k,1));
 case 4:return only(p,['q','e','r'])&&exactCount(p,'r',1)&&p.filter(k=>TILE[k].note).length===4;
 case 5:return only(p,['q','e','hr'])&&p.at(-1)==='hr'&&p.slice(0,-1).every(k=>['q','e'].includes(k));
 case 6:return only(p,['q','e','h','er'])&&p[0]==='er'&&p[1]==='e'&&p.at(-1)==='q'&&p.slice(2,-1).every(k=>['q','e','h'].includes(k));
 case 7:{if(!only(p,['q','r','e','er'])||p.length%2)return false;const first=p.slice(0,p.length/2),second=p.slice(p.length/2);return sum(first)===4&&same(first,second)&&first.some(k=>TILE[k].note)&&first.some(k=>!TILE[k].note)}
 default:return false;
}}
const BARS=[];
function bars(prefix=[],remaining=8){if(!remaining){BARS.push(prefix);return}for(const id of Object.keys(TILE))if(TILE[id].ticks<=remaining)bars([...prefix,id],remaining-TILE[id].ticks)}bars();
assert.equal(BARS.length,2828,'Independent recurrence, not the initial erroneous2836 count');
const EXPECTED_COUNTS=[4,2,21,6,30,5,6,34];
assert.deepEqual(EXPECTED_COUNTS.map((_,i)=>BARS.filter(p=>matches(i,p)).length),EXPECTED_COUNTS);
const COMPLETE=EXPECTED_COUNTS.map((_,i)=>BARS.filter(p=>matches(i,p)));
const segment=(start='p',end='mf',accent=false)=>({start,end,accent});
const plan=(i=0,start='p',end='mf',accent=false)=>STORY_MAPS[i].map(()=>segment(start,end,accent));
const pathCreation=(change={})=>({slot:'w4-paths',type:'return-investigation',challenge:'path-1',revision:1,level:4,value:[0,3],previous:[0,3],...change});
const storyCreation=(change={})=>({slot:'w4-story',type:'dynamics-storyboard',challenge:'story-1',revision:1,level:3,value:plan(),previous:plan(0,'mf','mf',true),...change});
const tileCreation=(change={})=>({slot:'w4-tiles',type:'rhythm-tiles',challenge:'tiles-1',revision:1,level:2,value:['q','r','q','q'],previous:[],...change});
const W4={version:1,level:4,done:{'w4-paths/path-1/r1/l4':7,'w4-tiles/tiles-3/r1/l2':5},creations:[pathCreation(),storyCreation(),tileCreation(),tileCreation({challenge:'free',level:4,value:['hr','hr'],previous:['e']})]};
const EMPTY4={version:1,level:1,done:{},creations:[]};
const ARCHIVES={
 groovePractice:{version:1,level:2,done:{'listen-2':11,'repair-1':2},creations:[{level:2,pattern:[1,0,1,1,0,1,0,1]}]},
 conversationPractice:{version:2,level:4,done:{'listen-4':7,'build-2':3},creations:[{level:4,brief:'down',call:[60,62,64,67].map(notes=>({notes,dur:1})),response:[69,67,64,60].map(notes=>({notes,dur:1})),previous:null}],legacyEcho:null},
 formPractice:{version:1,level:3,done:{'puzzle-3':5,'build-2':4},creations:[{level:3,map:['B','Bv','A','A'],previous:['A','B','A']}]},
 programmePractice:{version:1,level:4,done:{'w1-pulse-3':6,'w1-symbol-1':4},creations:[{slot:'w1-create',challenge:'rhythm-free.v1',revision:1,level:4,brief:3,division:2,pattern:[0,1,0,0,1,0,1,0],previous:{division:1,pattern:[0,0,0,0]}}]},
 week2Practice:{version:1,level:3,done:{'w2-form/form-1/r1/l1':4,'w2-contour/contour-6/r1/l3':6},plans:[{slot:'w2-plan',type:'practice-plan',challenge:'energy',revision:1,level:3,choice:'pulse',previous:'fragment'}]},
 week3Practice:{version:1,level:4,done:{'w3-debug/debug-1/r1/l1':4},repairs:[{slot:'w3-debug',type:'notation-repair',challenge:'debug-1',revision:1,level:4,events:[{kind:'note',ticks:2},{kind:'note',ticks:2},{kind:'note',ticks:4}],previous:[{kind:'note',ticks:2},{kind:'note',ticks:4},{kind:'note',ticks:4}]}]},
 week4Practice:W4
};
const EMPTY={groovePractice:{version:1,level:1,done:{},creations:[]},conversationPractice:{version:2,level:1,done:{},creations:[],legacyEcho:null},formPractice:{version:1,level:1,done:{},creations:[]},programmePractice:{version:1,level:1,done:{},creations:[]},week2Practice:{version:1,level:1,done:{},plans:[]},week3Practice:{version:1,level:1,done:{},repairs:[]},week4Practice:EMPTY4};
const TH={version:1,done:{'listen-2':true,'create-1':true},creations:[{level:1,notes:[60,62,64,67,60,62,64,69]}]};
function seeded(locale){const t=setup(locale),d=get(t,'emptyData()');Object.assign(d,copy(ARCHIVES));d.volume=.43;d.levels.rhythm=2;d.stats.rhythm={done:7,correct:4};d.observations['rhythm-2']=[true,false];d.creations=[{title:'Bevart variant',notes:[60,62,64,67,60,62,69,60]}];t.run(`data=validData(${JSON.stringify(d)});save();thStore=thValid(${JSON.stringify(TH)});thPersist()`);return t}
async function exported(t){t.run('exportData()');return JSON.parse(await t.exported.at(-1).text())}
async function upload(t,v){const text=JSON.stringify(v);await t.listeners['importFile:change']({target:{files:[{size:Buffer.byteLength(text),text:async()=>text}],value:'file'}})}
function snapshot(t){return {data:get(t,'data'),theme:get(t,'thStore'),raw:t.stored['musikkverkstad-v1'],themeRaw:t.stored['musikkverkstad-theme-ending-v1']}}
function archives(t){for(const [key,v]of Object.entries(ARCHIVES))assert.deepEqual(get(t,'data.'+key),v);assert.deepEqual(get(t,'thStore'),TH)}
async function persistence(){for(const locale of ['nn','nb','en']){
 const t=seeded(locale),initial=snapshot(t),backup=await exported(t);archives(t);await upload(t,backup);assert.deepEqual(snapshot(t),initial);
 const keys=Object.keys(ARCHIVES);for(let mask=0;mask<128;mask++){const incoming=copy(backup);keys.forEach((key,i)=>{if(mask&(1<<i))delete incoming[key];else incoming[key]=copy(EMPTY[key])});const target=seeded(locale);await upload(target,incoming);keys.forEach((key,i)=>assert.deepEqual(get(target,'data.'+key),mask&(1<<i)?ARCHIVES[key]:EMPTY[key],`Missing-subset${mask} independently preserves/replaces${key}`));assert.deepEqual(get(target,'thStore'),TH)}
 for(const key of keys){const target=seeded(locale),incoming=copy(backup);incoming[key]=copy(EMPTY[key]);const before=snapshot(target);target.run('confirm=()=>false');await upload(target,incoming);assert.deepEqual(snapshot(target),before,'Cancellation changes no raw or archive data');target.run('confirm=()=>true');await upload(target,incoming);assert.deepEqual(get(target,'data.'+key),EMPTY[key]);for(const sibling of keys.filter(k=>k!==key))assert.deepEqual(get(target,'data.'+sibling),ARCHIVES[sibling]);assert.deepEqual(get(target,'thStore'),TH)}
 const mutations=[...keys.map(key=>v=>v[key]=null),...keys.map(key=>v=>v[key].version=99),v=>v.week4Practice.creations[0].challenge='path-99',v=>v.week4Practice.creations[1].value[0].start='loud',v=>v.week4Practice.creations[1].value[0].accent=1,v=>v.week4Practice.creations[2].value=['h'],v=>v.week4Practice.creations[2].previous=['unknown'],v=>v.week4Practice.done['w4-story/story-1/r1/l1']=1,v=>v.week4Practice.creations.push(copy(v.week4Practice.creations[0])),v=>v.week3Practice.repairs[0].previous[0].ticks=99,v=>v.week2Practice.plans[0].choice='bad',v=>v.themeEnding={version:99},v=>v.stats.rhythm.correct=1000001];
 for(const mutate of mutations){const bad=copy(backup);mutate(bad);bad.stats.melody={done:23,correct:12};const before=snapshot(t);await upload(t,bad);assert.deepEqual(snapshot(t),before,'Malformed sibling aborts every module/raw mutation')}
 const noTheme=copy(backup);delete noTheme.themeEnding;await upload(t,noTheme);archives(t);
 const reload=setup(locale,{stored:t.stored});archives(reload);reload.run("schoolSettings.schoolName='New branding';schoolSettings.defaultLanguage='en';schoolSettings.levels.programme=[2];schoolSettings.themes=['groove'];schoolSettings.formEnabled=false;go('home')");archives(reload);assert.deepEqual((await exported(reload)).week4Practice,W4);reload.run("w4Action('open','0');w4Action('open','1')");assert.notEqual(reload.run('route'),'week4');archives(reload);
 console.log(`PASS ${locale}: all128 independent missing-extension subsets, explicit/cancelled replacement, malformed-sibling atomicity, all histories/branding/reload preserved (Node simulation).`);
}}
function pure(){
 assert.equal(School.defaults().schemaVersion,6);assert.equal(Object.keys(School.defaults().levels).length,11);assert.deepEqual(Core.material,MATERIAL);
 assert.deepEqual(Core.slots.map(s=>[s.id,s.type,s.revision,s.state,s.humanValidation,s.pupilRelease]),[['w4-paths','return-investigation',1,'implemented-prototype','PENDING','BLOCKED'],['w4-story','dynamics-storyboard',1,'implemented-prototype','PENDING','BLOCKED'],['w4-tiles','rhythm-tiles',1,'implemented-prototype','PENDING','BLOCKED']]);
 assert.equal(Core.paths.length,8);let pairs=0;
 for(const [i,p]of PATHS.entries()){
  const actual=Core.paths[i];assert.equal(actual.id,p.id);assert.equal(actual.revision,1);assert.deepEqual(actual.before,p.before);assert.deepEqual(actual.map,p.revised);assert(Object.isFrozen(actual)&&Object.isFrozen(actual.before)&&Object.isFrozen(actual.map));
  assert.deepEqual(independentPairs(p.revised),p.pairs);assert.deepEqual(Core.pathPairs(freeze(copy(p.revised))),p.pairs);pairs+=p.pairs.length;
  for(let a=-1;a<=p.revised.length;a++)for(let b=-1;b<=p.revised.length;b++){const selected=[a,b],fits=p.pairs.some(pair=>same(pair,selected));assert.equal(Core.pathFits(actual,selected),fits);const expected=fits?independentPairs(p.before).filter(pair=>same(MATERIAL[p.before[pair[0]]],MATERIAL[p.revised[a]])):[];assert.deepEqual(Core.beforePairs(actual,selected),expected,'Original/revised relation based on exact musical anchor, not symbol shape')}
  for(const bad of [null,[],[0],['0',3],[true,3],[0,3,4],[NaN,3],[0,Infinity]])assert.equal(Core.pathFits(actual,bad),false);
 }
 assert.equal(pairs,15);assert.deepEqual(Core.pathPairs(['A','A']),[]);assert.deepEqual(Core.pathPairs(['A','A','A']),[]);assert.deepEqual(Core.pathPairs(['A','Av','A']),[[0,2]],'Related middle variation differs in real ending notes');assert.deepEqual(Core.pathPairs(['A','B','Av']),[],'A prime is not a literal return to A');assert.deepEqual(Core.pathPairs(['A','unknown','A']),[]);
 assert.deepEqual(Object.fromEntries(Core.tiles.map(x=>[x.id,{ticks:x.ticks,note:x.kind==='note'}])),TILE);
 let prefixes=0;function inspectDraft(p=[],left=8){prefixes++;assert.equal(Core.draft(p),true);assert.equal(Core.ticks(p),sum(p));assert.equal(Core.free(p),left===0);for(let i=0;i<8;i++)assert.equal(Core.fitsTiles(Core.briefs[i],p),matches(i,p));for(const id of Object.keys(TILE))if(TILE[id].ticks<=left)inspectDraft([...p,id],left-TILE[id].ticks)}inspectDraft();assert.equal(prefixes,4395);
 const counts=[];for(let i=0;i<8;i++){const item=Core.briefs[i];assert.equal(item.id,'tiles-'+(i+1));assert.equal(item.revision,1);const accepted=BARS.filter(p=>Core.fitsTiles(item,p));assert.deepEqual(accepted,COMPLETE[i]);counts.push(accepted.length);for(const p of COMPLETE[i])assert.equal(Core.fitsTiles(item.id,p),true)}assert.deepEqual(counts,EXPECTED_COUNTS);
 for(const bad of [null,{},'q',Array(9).fill('e'),['h','h','e'],['future'],[true],['q',null],['Q']]){assert.equal(Core.draft(bad),false);assert.equal(Core.free(bad),false);for(const brief of Core.briefs)assert.equal(Core.fitsTiles(brief,bad),false)}
 assert.equal(Core.free(['hr','hr']),true,'Silence is valid free creation');assert.equal(Core.fitsTiles('tiles-99',['q','r','q','q']),false);assert.equal(Core.free([]),false,'An incomplete bar remains draft, not a completed bar');
 const segments=[];for(const start of ['p','mf','f'])for(const end of ['p','mf','f'])for(const accent of [false,true])segments.push(segment(start,end,accent));let storyPlans=0;
 assert.equal(Core.stories.length,8);for(const [i,item]of Core.stories.entries()){
  assert.equal(item.id,'story-'+(i+1));assert.deepEqual(item.sections,STORY_MAPS[i]);assert.equal(item.revision,1);assert.equal(item.models.length,2);assert(!same(item.models[0],item.models[1]),'Worked interpretations must actually differ');for(const model of item.models)assert.equal(Core.storyValid(item,freeze(copy(model))),true);for(const text of item.brief)assert.equal(typeof text,'string');assert(item.brief.every(text=>text.length>10));
  function visit(p=[]){if(p.length===STORY_MAPS[i].length){storyPlans++;assert.equal(Core.storyValid(item,p),true,'Every coherent interpretation is valid, not just the supplied examples');return}for(const s of segments)visit([...p,s])}visit();
  for(const bad of [null,[],plan(i).slice(1),[...plan(i),segment()],plan(i).map(s=>({...s,start:'ppp'})),plan(i).map(s=>({...s,end:4})),plan(i).map(s=>({...s,accent:1})),plan(i).map(s=>({...s,direction:'crescendo'})),plan(i).map(s=>({start:s.start,end:s.end}))])assert.equal(Core.storyValid(item,bad),false);
 }
 assert.equal(storyPlans,19116);for(const s of segments){const a=['p','mf','f'].indexOf(s.start),b=['p','mf','f'].indexOf(s.end);assert.equal(Core.direction(s),a===b?'constant':a<b?'crescendo':'decrescendo')}
 for(const bad of [null,{},segment('unknown','mf'),segment('p','unknown')])assert.throws(()=>Core.direction(bad));
 assert.deepEqual(Core.empty(),EMPTY4);assert.deepEqual(Core.valid(undefined),EMPTY4);const before=copy(W4),out=Core.valid(freeze(copy(W4)));assert.deepEqual(out,W4);out.creations[0].value[0]=99;out.creations[1].previous[0].accent=false;out.creations[2].value[0]='e';assert.deepEqual(W4,before,'Validation must neither mutate inputs nor return aliases');
 for(const bad of [null,[],{},...Object.keys(EMPTY4).map(key=>{const v=copy(W4);delete v[key];return v}),{...W4,version:2},{...W4,level:0},{...W4,level:5},{...W4,level:true},{...W4,future:1},{...W4,done:[]},{...W4,creations:{}},...['w4-story/story-1/r1/l1','w4-tiles/free/r1/l1','w4-paths/path-9/r1/l1','w4-paths/path-1/r2/l1','w4-paths/tiles-1/r1/l1','w5-tiles/tiles-1/r1/l1'].map(key=>({...W4,done:{[key]:1}})),...[-1,0,.5,1000001,true,NaN,Infinity].map(n=>({...W4,done:{'w4-paths/path-1/r1/l1':n}}))])assert.throws(()=>Core.valid(bad));
 const mutations=[c=>c.slot='w5-paths',c=>c.type='wrong',c=>c.challenge='path-99',c=>c.revision=2,c=>c.level=0,c=>c.level=5,c=>c.level=true,c=>c.value=[0,1],c=>c.previous=[99,100],c=>c.pupilName='no',...Object.keys(pathCreation()).map(k=>c=>delete c[k])];for(const mutate of mutations){const c=pathCreation();mutate(c);assert.throws(()=>Core.valid({...EMPTY4,creations:[c]}))}
 for(const bad of [storyCreation({value:plan(0,'unknown','mf')}),storyCreation({previous:[]}),tileCreation({value:['q']}),tileCreation({previous:['unknown']}),tileCreation({challenge:'free',value:['hr']}),tileCreation({previous:['h','h','e']})])assert.throws(()=>Core.valid({...EMPTY4,creations:[bad]}));
 for(const creation of [pathCreation(),storyCreation(),tileCreation()]){const reordered=Object.fromEntries(Object.entries(copy(creation)).reverse());if(creation.slot==='w4-story'){reordered.value=reordered.value.map(s=>Object.fromEntries(Object.entries(s).reverse()));reordered.previous=reordered.previous.map(s=>Object.fromEntries(Object.entries(s).reverse()))}assert.throws(()=>Core.valid({...EMPTY4,creations:[creation,reordered]}),'Canonical duplicate identity independent of key order')}
 const thirty=BARS.slice(0,30).map(value=>tileCreation({challenge:'free',level:1,value,previous:null}));assert.equal(Core.valid({...EMPTY4,creations:thirty}).creations.length,30);assert.throws(()=>Core.valid({...EMPTY4,creations:[...thirty,tileCreation({challenge:'free',value:BARS[30],level:1,previous:null})]}));
 for(const c of [pathCreation(),storyCreation(),tileCreation(),tileCreation({challenge:'free',value:['hr','hr']})])assert.deepEqual(Core.valid({...EMPTY4,creations:[c]}).creations[0],c);
 console.log('PASS: independently frozen8path/8story/8tile banks,15 exact return pairs,2828 fullbars/4395 drafts, exhaustive tile counts4/2/21/6/30/5/6/34 and19116 ungraded expressive plans; strict versioned records/schema6 (pure Node).');
}
pure();
async function interaction(){for(const locale of ['nn','nb','en']){
 const t=setup(locale);t.run("go('week4');w4Action('task','paths')");let pathChecks=0,tileChecks=0;
 for(const level of [1,2,3,4]){
  t.run(`w4Action('level','${level}')`);
  for(const [index,p]of PATHS.entries()){
   t.run(`w4.index=${index};w4Reset()`);const key=`w4-paths/${p.id}/r1/l${level}`,before=t.run(`data.week4Practice.done['${key}']||0`);t.run("w4Action('check')");assert.equal(t.run(`data.week4Practice.done['${key}']||0`),before,'Empty trace earns no practice credit');
   for(const pair of p.pairs){t.run(`w4Action('anchor','${pair[0]}');w4Action('return','${pair[1]}');w4Action('compare');w4Action('check');w4Action('check')`);assert.deepEqual(get(t,'w4.pair'),pair);assert.equal(t.run(`data.week4Practice.done['${key}']`),before+1,'All matching paths accepted, at most one credit per case');}pathChecks++;
  }
 }
 for(const task of ['paths','story','tiles'])for(const level of [1,2,3,4]){t.run(`go('week4');w4Action('task','${task}');w4Action('level','${level}');go('home');nvContinue()`);assert.equal(t.run('route'),'week4');assert.equal(t.run('w4.task'),task);assert.equal(t.run('w4.level'),level);const fresh=setup(locale,{stored:t.stored});fresh.run('nvContinue()');assert.equal(fresh.run('route'),'week4');assert.equal(fresh.run('w4.task'),task);assert.equal(fresh.run('w4.level'),level)}
 const stories=setup(locale);stories.run("go('week4');w4Action('task','story');w4Action('level','3')");const done=get(stories,'data.week4Practice.done');
 for(let index=0;index<8;index++){stories.run(`w4.index=${index};w4Reset()`);for(const model of [0,1]){stories.run(`w4Action('model','${model}');w4Action('check')`);assert.deepEqual(get(stories,'data.week4Practice.done'),done,'Neither supplied aesthetic model is graded')}}
 stories.run("w4.index=0;w4Reset();w4Action('model','0');w4Action('snapshot')");const storyBefore=get(stories,'w4.plan');stories.run("w4Action('segment','0');w4Action('start','f');w4Action('end','p');w4Action('accent');w4Action('save');w4Action('save')");const current=get(stories,'w4.plan');assert.equal(stories.run('data.week4Practice.creations.length'),1);assert.deepEqual(get(stories,'data.week4Practice.creations[0]'),storyCreation({value:current,previous:storyBefore}));assert.deepEqual(get(stories,'data.week4Practice.done'),done);
 const reopened=setup(locale,{stored:stories.stored});reopened.run("go('progress');w4Action('open','0')");assert.equal(reopened.run('route'),'week4');assert.equal(reopened.run('w4.task'),'story');assert.deepEqual(get(reopened,'w4.plan'),current);assert.deepEqual(get(reopened,'w4.previous'),storyBefore);
 const rhythms=setup(locale);rhythms.run("go('week4');w4Action('task','tiles')");
 for(const level of [1,2,3,4]){rhythms.run(`w4Action('level','${level}')`);for(let index=0;index<8;index++){rhythms.run(`w4.index=${index};w4Reset()`);const pattern=COMPLETE[index][0],key=`w4-tiles/tiles-${index+1}/r1/l${level}`,before=rhythms.run(`data.week4Practice.done['${key}']||0`);rhythms.run("w4Action('check')");assert.equal(rhythms.run(`data.week4Practice.done['${key}']||0`),before);for(const tile of pattern)rhythms.run(`w4Action('position',String(w4.pattern.length));w4Action('add','${tile}')`);assert.deepEqual(get(rhythms,'w4.pattern'),pattern);rhythms.run("w4Action('check');w4Action('check')");assert.equal(rhythms.run(`data.week4Practice.done['${key}']`),before+1);const full=get(rhythms,'w4.pattern');rhythms.run(`w4Action('add','${pattern[0]}')`);assert.deepEqual(get(rhythms,'w4.pattern'),full,'Overflow insertion is rejected, not silently clipped');rhythms.run("w4Action('undo')");assert.notDeepEqual(get(rhythms,'w4.pattern'),full,'Undo edits actual variable-duration tiles');tileChecks++}}
 rhythms.run("w4Action('mode','free');w4Action('reset')");const freeDone=get(rhythms,'data.week4Practice.done');for(const tile of ['hr','hr'])rhythms.run(`w4Action('position',String(w4.pattern.length));w4Action('add','${tile}')`);rhythms.run("w4Action('snapshot');w4Action('check');w4Action('save')");assert.equal(rhythms.run('data.week4Practice.creations.at(-1).challenge'),'free');assert.deepEqual(get(rhythms,'data.week4Practice.creations.at(-1).value'),['hr','hr']);assert.deepEqual(get(rhythms,'data.week4Practice.done'),freeDone,'Silent/free creation is ungraded');
 const scoped=setup(locale);scoped.run("schoolSettings.formEnabled=false;go('week4');w4Action('task','paths');w4Action('anchor','0');w4Action('return','3');w4Action('compare');w4Action('check');w4Action('save')");assert.deepEqual(get(scoped,'data.week4Practice.done'),{});assert.equal(scoped.run('data.week4Practice.creations.length'),0);scoped.run("w4Action('task','story');w4Action('save')");assert.equal(scoped.run('data.week4Practice.creations.length'),1,'Neutral story remains independent of Form restriction');scoped.run("w4Action('task','tiles')");assert.equal(scoped.run('w4.task'),'tiles');
 for(const formLevels of [[1],[3],[1,3]]){const source=setup(locale);source.run(`schoolSettings.levels.form=${JSON.stringify(formLevels)};go('week4');w4Action('task','paths');w4Action('anchor','0');w4Action('return','3');w4Action('compare');w4Action('check');w4Action('save')`);assert.deepEqual(get(source,'data.week4Practice.done'),{});assert.equal(source.run('data.week4Practice.creations.length'),0)}
 const limitedEntry=setup(locale);limitedEntry.run("schoolSettings.levels.programme=[2,4];w4.level=1;w4Action('enter','story')");assert.equal(limitedEntry.run('w4.level'),2,'Clamp school-enabled configuration before preparing entry support');assert.deepEqual(get(limitedEntry,'w4.previous'),get(limitedEntry,'w4.plan'),'Configuration2 entry starts with its promised comparison snapshot');assert.equal(limitedEntry.run('data.week4Practice.level'),1,'Entry does not overwrite the saved preference');limitedEntry.run("w4Action('task','paths');w4Action('anchor','0');w4Action('return','3')");assert.equal(limitedEntry.run('w4.compared'),true,'Configuration2 exposes the matching-before comparison when the pair becomes valid');
 const blocked=seeded(locale),initial=snapshot(blocked);blocked.run("schoolSettings.programmeEnabled=false;go('home');go('week4');w4Action('enter','story');w4Action('open','0');w4Action('open','1');w4Action('open','2');w4Action('save')");assert.notEqual(blocked.run('route'),'week4');assert.deepEqual(snapshot(blocked),initial,'Disabled programme rejects every direct/archived mutation');
 const pathOff=seeded(locale);pathOff.run("schoolSettings.formEnabled=false;go('home');w4Action('open','0')");assert.notEqual(pathOff.run('route'),'week4');pathOff.run("w4Action('open','1')");assert.equal(pathOff.run('route'),'week4');assert.equal(pathOff.run('w4.task'),'story');
 for(const test of [t,stories,rhythms,scoped]){assert.equal(test.contexts.length,0);assert.equal(test.notes.length,0)}
 console.log(`PASS ${locale}: ${pathChecks} return-trace/${tileChecks} tile configurations, three-task Continue/reload, ungraded models/free silence, explicit revision/reopen, school guards and no auto audio (Node simulation).`);
}}
async function storage(){for(const locale of ['nn','nb','en']){
 const t=seeded(locale),valid=await exported(t),raw=JSON.stringify({...copy(snapshot(t).data),week4Practice:{version:99}});const damaged=setup(locale,{stored:{'musikkverkstad-v1':raw,'musikkverkstad-theme-ending-v1':JSON.stringify(TH)}});damaged.run("go('week4');w4Action('task','story');w4Action('model','1');w4Action('save')");assert.equal(damaged.stored['musikkverkstad-v1'],raw,'Practice cannot overwrite corrupt raw bytes');const bad=copy(valid);bad.week4Practice=null;await upload(damaged,bad);assert.equal(damaged.stored['musikkverkstad-v1'],raw);await upload(damaged,valid);assert.equal(damaged.run('storageCorrupt'),false);archives(damaged);
 const denied=setup(locale);denied.run("localStorage.setItem=()=>{throw Error('quota')};go('week4');w4Action('task','story');w4Action('model','1');w4Action('save')");assert.equal(denied.run('storageOK'),false);assert.equal((await exported(denied)).week4Practice.creations.length,1,'In-memory expressive work remains exportable on quota denial');
 console.log(`PASS ${locale}: protected corrupt bytes, atomic recovery and quota export without claiming durable save (Node simulation).`);
}}
(async()=>{await interaction();await persistence();await storage();console.log('No native browser, human translation/AT/teacher/pupil, physical-device or speaker validation claimed. Human validation PENDING; pupil release BLOCKED.');})().catch(error=>{console.error(error);process.exitCode=1});
