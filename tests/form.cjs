// Independent musical/visual finite oracles and simulated DOM/storage regressions.
// No browser rendering, hearing, human teacher or pupil evidence is claimed here.
const assert=require('node:assert/strict');
const {setup}=require('./audio.cjs');
const plain=x=>JSON.parse(JSON.stringify(x));
const get=(t,code)=>plain(t.run(code));
const copy=plain;
const upload=(t,value)=>t.listeners['importFile:change']({target:{files:[{size:100,text:async()=>JSON.stringify(value)}],value:'file'}});
const MATERIAL={A:[60,62,64,67],Av:[60,62,64,69],B:[67,64,62,60],Bv:[67,64,62,62],X:[62,64,67,69],Xv:[62,64,67,67],Y:[69,67,64,62],Yv:[69,67,64,60]};
const PITCH_NAMES={60:'C4',62:'D4',64:'E4',67:'G4',69:'A4'};
const PALETTE=['A','Av','B','Bv'];
const EXPECTED={repeat:[['A','A'],['B','B']],contrast:[['A','B'],['B','A']],return:[['A','B','A'],['B','A','B']],variation:[['A','Av'],['B','Bv']]};
const MODEL={repeat:['X','X'],contrast:['X','Y'],return:['X','Y','X'],variation:['X','Xv']};
const BRIEFS=[['repeat','contrast'],['return'],['variation'],['repeat','contrast','return','variation']];
function maps(palette,length){if(!length)return [[]];return maps(palette,length-1).flatMap(prefix=>palette.map(id=>[...prefix,id]));}
const ALL=Array.from({length:5},(_,i)=>maps(PALETTE,i+2)).flat();
assert.equal(ALL.length,5456);
function oracle(map,brief){return EXPECTED[brief]?.some(m=>JSON.stringify(m)===JSON.stringify(map))||false;}
function fill(t,map){map.forEach((id,i)=>{t.run(`foAction('slot','${i}');foAction('place',${JSON.stringify(id)})`);});}
(async()=>{for(const lang of ['nn','nb','en']){
 const t=setup(lang);t.run("go('form')");assert.equal(t.run('route'),'form');
 assert.deepEqual(get(t,'foPalette'),PALETTE);
 for(const [id,pitches]of Object.entries(MATERIAL)){
  assert.deepEqual(get(t,`foEvents('${id}')`),pitches.map(notes=>({notes,dur:1})),`fixed musical referent ${id}`);
  const card=t.run(`foSection('${id}')`);
  const circles=[...card.matchAll(/<circle data-pitch="(\d+)" data-beat="(\d+)" cx="(\d+)" cy="(\d+)"/g)].map(m=>m.slice(1).map(Number));
  assert.deepEqual(circles,pitches.map((p,i)=>[p,i+1,20+40*i,76-(p-60)*6]),`fixed shared C4–A4 scale ${id}`);
  assert(card.includes(`points="${pitches.map((p,i)=>(20+40*i)+','+(76-(p-60)*6)).join(' ')}"`));
  assert(card.includes('<svg viewBox="0 0 160 105" aria-hidden="true" focusable="false">'));
  const text=card.match(/<p class="fo-notes">([^<]+)<\/p>/)?.[1];
  assert.equal(text,pitches.map((p,i)=>`${i+1}: ${PITCH_NAMES[p]}`).join(' · '));
  assert(card.includes(t.run("foText('beats')")),'Quarter-duration text must accompany pitches');
  assert(card.includes(`fo-family-${['A','X'].includes(id[0])?'a':'b'}`));
  assert.equal(card.includes('stroke-dasharray="2 2"'),id.endsWith('v'));
 }
 for(const [base,variant]of [['A','Av'],['B','Bv'],['X','Xv'],['Y','Yv']]){
  assert.deepEqual(MATERIAL[base].slice(0,3),MATERIAL[variant].slice(0,3));assert.notEqual(MATERIAL[base][3],MATERIAL[variant][3]);
 }
 assert(MATERIAL.A.every((p,i)=>p!==MATERIAL.B[i]));assert(MATERIAL.X.every((p,i)=>p!==MATERIAL.Y[i]));
 assert.throws(()=>t.run("foEvents('unavailable')"));
 assert.equal(t.run("foMapValid(['X','Y'])"),false,'Separate demonstration cards are not selectable/savable');
 assert.equal(t.run("foFits(['Av','Av'],'repeat')"),false,'This explicitly base-only brief does not expose prime repeats');
 assert.equal(t.run("foFits(['Av','A'],'variation')"),false,'Named base-to-variation relation is ordered');
 for(const [brief,correct]of Object.entries(EXPECTED)){
  const universe=brief==='return'?maps(['A','B'],3):maps(brief==='variation'?PALETTE:['A','B'],2);
  assert.equal(universe.length,brief==='return'?8:brief==='variation'?16:4);
  const actual=get(t,`(${JSON.stringify(universe)}).filter(m=>foFits(m,'${brief}'))`);assert.deepEqual(actual,correct);
  for(const m of maps(PALETTE,brief==='return'?3:2))assert.equal(t.run(`foFits(${JSON.stringify(m)},'${brief}')`),oracle(m,brief));
 }
 for(const bad of [null,[],['A'],Array(7).fill('A'),['A',null],['A','unknown'],['X','X'],['A',1]])assert.equal(t.run(`foMapValid(${JSON.stringify(bad)})`),false);
 // Exhaustive creative-map acceptance is structural, not an aesthetic ranking.
 const accepted=get(t,`(${JSON.stringify(ALL)}).map(m=>[1,2,3,4].every(level=>{const v={version:1,level,done:{},creations:[{level,map:m,previous:null}]};return foMapValid(m)&&foValid(v).creations[0].map.join(',')===m.join(',')}))`);
 assert.equal(accepted.length,5456);assert(accepted.every(Boolean));
 for(let level=1;level<=4;level++){
  t.run(`foAction('level','${level}')`);assert.deepEqual(get(t,`foBriefs(${level})`),BRIEFS[level-1]);
  for(const brief of BRIEFS[level-1]){
   t.run(`foAction('mode','puzzle');foAction('brief','${brief}')`);
   assert(t.elements.app.innerHTML.includes(t.run(`foText('${brief}')`)),'Teach current brief before marking');
   assert(t.elements.app.innerHTML.includes(t.run("foText('choose')")));
   const rotations=new Set();
   for(let round=0;round<3;round++){
    if(round)t.run("foAction('new')");
    const options=get(t,'fo.options');rotations.add(JSON.stringify(options));assert.equal(new Set(options.map(JSON.stringify)).size,3);
    const correct=options.flatMap((m,i)=>oracle(m,brief)?[i]:[]);assert.equal(correct.length,2);
    for(let mask=0;mask<8;mask++){
     const selected=[0,1,2].filter(i=>mask&(1<<i));t.run(`fo.selectedMaps=${JSON.stringify(selected)};foAction('check')`);
     assert.equal(t.run('fo.feedback')===t.run("foText('rightAnswer')"),JSON.stringify(selected)===JSON.stringify(correct),`${lang}/${level}/${brief}/subset${mask}`);
    }
    const key=`puzzle-${level}`,once=t.run(`data.formPractice.done['${key}']||0`);
    t.run(`fo.selectedMaps=${JSON.stringify(correct)};foAction('check');foAction('check')`);
    assert.equal(t.run(`data.formPractice.done['${key}']`),once,'Repeated success never farms counts');
    t.run("foAction('hint')");const html=t.run('foView()'),model=html.split('<section class="fo-model">')[1]?.split('</section>')[0];assert(model);
    assert.deepEqual([...model.matchAll(/data-fo-section="([^"]+)"/g)].map(m=>m[1]),MODEL[brief]);
    assert(!/data-fo-action="(?:select|place)"/.test(model),'Separate model is not a current-answer control');
    assert.equal(t.run(`data.formPractice.done['${key}']`),once);
   }
   assert.equal(rotations.size,3,'New trials rotate candidate positions without changing music');
   t.run("foAction('mode','build')");t.run('fo.answer=Array(foLength(fo.brief)).fill(null);foAction("check")');assert.equal(t.run('fo.feedback'),t.run("foText('incomplete')"));
   const universe=maps(brief==='variation'?PALETTE:['A','B'],brief==='return'?3:2);
   for(const m of universe){t.run(`fo.answer=${JSON.stringify(m)};foAction('check')`);assert.equal(t.run('fo.feedback')===t.run("foText('rightAnswer')"),oracle(m,brief));}
   const buildKey=`build-${level}`,once=t.run(`data.formPractice.done['${buildKey}']`);
   t.run(`fo.answer=${JSON.stringify(EXPECTED[brief][0])};foAction('check');foAction('check')`);assert.equal(t.run(`data.formPractice.done['${buildKey}']`),once);
   // Reordering/replacement is reversible and does not touch independent creation.
   fill(t,EXPECTED[brief][0]);const beforeMove=get(t,'fo.answer');t.run("foAction('slot','0');foAction('right');foAction('undo')");assert.deepEqual(get(t,'fo.answer'),beforeMove);
  }
 }
 for(const invalid of [0,5,'1',1.5])assert.throws(()=>t.run(`foBriefs(${JSON.stringify(invalid)})`));
 const words=get(t,'foWords');
 for(const key of ['repeat','contrast','return','variation','grammar','visual','choose','createHelp','model','local'])assert(words[key].every(s=>typeof s==='string'&&s.length>20));
 assert.match(words.repeat[2],/Repeat A or B exactly/);assert.match(words.variation[2],/named variation.*first three pitches.*last pitch/);
 assert.match(words.grammar[2],/same C4–A4 scale.*not glissandos.*other lengths and metres/);
 assert.match(words.visual[2],/not auditory recognition/);assert.match(words.createHelp[2],/not marked or ranked/);
 // A distinct objective credit is reset by a changed brief, but the creation/before survive.
 t.run("foAction('level','4');foAction('brief','contrast');foAction('mode','create')");
 fill(t,['A','B','A']);t.run("foAction('snapshot');foAction('slot','2');foAction('place','Av')");
 const original=['A','B','A'],revision=['A','B','Av'];assert.deepEqual(get(t,'fo.previous'),original);assert.deepEqual(get(t,'fo.creation'),revision);
 t.run("foAction('mode','build');foAction('brief','return')");assert.deepEqual(get(t,'fo.creation'),revision);assert.deepEqual(get(t,'fo.previous'),original);assert.deepEqual(get(t,'fo.answer'),[null,null,null]);
 t.run("foAction('mode','create');foAction('level','1');foAction('level','4')");assert.deepEqual(get(t,'fo.creation'),revision);assert.deepEqual(get(t,'fo.previous'),original);
 const progressBefore=get(t,'data.formPractice.done');t.run("foAction('check')");assert.deepEqual(get(t,'data.formPractice.done'),progressBefore,'Creation is not marked');
 t.run("foAction('slot','0');foAction('left')");assert.deepEqual(get(t,'fo.creation'),revision);
 t.run("foAction('slot','2');foAction('left')");assert.deepEqual(get(t,'fo.creation'),['A','Av','B']);t.run("foAction('undo')");assert.deepEqual(get(t,'fo.creation'),revision);
 t.run("foAction('add');foAction('undo')");assert.deepEqual(get(t,'fo.creation'),revision);assert.deepEqual(get(t,'fo.previous'),original);
 t.run("foAction('remove');foAction('undo')");assert.deepEqual(get(t,'fo.creation'),revision);
 t.run("foAction('save');foAction('save')");assert.equal(t.run('data.formPractice.creations.length'),1);assert.equal(t.run('fo.feedback'),t.run("foText('duplicate')"));
 const saved=get(t,'data.formPractice.creations[0]');assert.deepEqual(saved.map,revision);assert.deepEqual(saved.previous,original);
 t.run("foAction('slot','0');foAction('place','B');foAction('open','0')");assert.deepEqual(get(t,'fo.creation'),revision);assert.deepEqual(get(t,'fo.previous'),original);
 t.run("document.documentElement.lang='en';foDraw();schoolSettings.schoolName='New branding';foDraw()");assert.deepEqual(get(t,'data.formPractice.creations[0]'),saved);t.run(`document.documentElement.lang='${lang}'`);
 const reload=setup(lang,{stored:t.stored});assert.deepEqual(get(reload,'data.formPractice.creations[0]'),saved);assert.deepEqual(get(reload,'fo.creation'),['A','B','A']);assert.equal(reload.run('fo.previous'),null,'Unfinished revisions are not resumed');
 // Snapshot replacement is explicit and old/current arrays never alias.
 t.run("foAction('snapshot')");assert.equal(t.run('fo.feedback'),t.run("foText('replaced')"));t.run("foAction('slot','2');foAction('place','B')");assert.deepEqual(get(t,'fo.previous'),revision);
 t.run('exportData()');const backup=JSON.parse(await t.exported[0].text()),stable=t.run('JSON.stringify(data)'),theme=t.run('JSON.stringify(thStore)');
 for(const change of [v=>v.formPractice=null,v=>v.formPractice.version=2,v=>v.formPractice.level=5,v=>v.formPractice.done={'create-1':1},v=>v.formPractice.done={'puzzle-1':-1},v=>v.formPractice.done={'build-1':.5},v=>v.formPractice.creations[0].map=['X','Y'],v=>v.formPractice.creations[0].map=['A'],v=>v.formPractice.creations[0].map=Array(7).fill('A'),v=>v.formPractice.creations[0].previous=['A',null],v=>v.formPractice.creations[0].level=0,v=>v.formPractice.creations[0].pupilName='no',v=>v.formPractice.creations=Array(21).fill(v.formPractice.creations[0]),v=>v.formPractice.future=true,v=>v.themeEnding={version:99}]){
  const bad=copy(backup);change(bad);await upload(t,bad);assert.equal(t.run('JSON.stringify(data)'),stable,'Invalid imports are atomic');assert.equal(t.run('JSON.stringify(thStore)'),theme);
 }
 await upload(t,backup);assert.equal(t.run('JSON.stringify(data)'),stable);
 const older=copy(backup);delete older.formPractice;await upload(t,older);assert.equal(t.run('JSON.stringify(data.formPractice)'),JSON.stringify(backup.formPractice),'Missing old backup extension preserves newer form work');
 t.run('confirm=()=>false');const declined=copy(backup);declined.formPractice.creations=[];await upload(t,declined);assert.equal(t.run('data.formPractice.creations.length'),1);t.run('confirm=()=>true');await upload(t,declined);assert.equal(t.run('data.formPractice.creations.length'),0,'Explicit valid confirmed replacement has predictable semantics');
 const denied=setup(lang);denied.run("localStorage.setItem=()=>{throw Error('denied')};go('form');foAction('mode','create');foAction('save')");assert.equal(denied.run('storageOK'),false);assert.equal(denied.run('data.formPractice.creations.length'),1);assert(denied.elements.app.innerHTML.includes(denied.run("foText('storage')")));denied.run('exportData()');assert.equal(JSON.parse(await denied.exported[0].text()).formPractice.creations.length,1);
 const full=setup(lang);full.run("go('form');foAction('mode','create');data.formPractice.creations=Array.from({length:20},()=>({level:1,map:['B','B'],previous:null}));foAction('save')");assert.equal(full.run('data.formPractice.creations.length'),20);assert.equal(full.run('fo.feedback'),full.run("foText('limit')"));
 const corrupt='{broken';const damaged=setup(lang,{stored:{'musikkverkstad-v1':corrupt}});damaged.run("go('form');foAction('mode','create');foAction('save')");assert.equal(damaged.stored['musikkverkstad-v1'],corrupt);assert.equal(damaged.run('storageOK'),false);assert.equal(damaged.run('data.formPractice.creations.length'),1);
 const restricted=setup(lang,{stored:{'musikkverkstad-v1':JSON.stringify(backup)}});restricted.run("schoolSettings.levels.form=[2];go('form')");restricted.run("foAction('open','0')");assert.equal(restricted.run('fo.level'),2);assert.equal(restricted.run('data.formPractice.creations.length'),1);restricted.run("go('home');schoolSettings.formEnabled=false");const unavailable=restricted.run('JSON.stringify(data.formPractice)');restricted.run("foAction('open','0')");assert.equal(restricted.run('route'),'home');assert.equal(restricted.run('JSON.stringify(data.formPractice)'),unavailable);
 assert.equal(t.notes.length,0);assert.equal(t.contexts.length,0,'Visual activity does not initialise audio');
 console.log(`PASS ${lang}: fixed visual/music grammar, complete finite answer sets, 5456 ungraded maps, all modes/configurations, revision/undo/persistence/import/storage/school restrictions (Node simulation)`);
}
console.log('No browser rendering, hearing, human teacher, pupil or real-device claim.');
})().catch(error=>{console.error(error);process.exitCode=1});
