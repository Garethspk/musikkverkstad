const assert=require('node:assert/strict'),{setup,flush}=require('./audio.cjs');
const plain=v=>JSON.parse(JSON.stringify(v));
(async()=>{for(const lang of ['nn','nb','en']){
 const t=setup(lang);t.run("var seed=123;function seeded(){seed=(seed*1664525+1013904223)>>>0;return seed/4294967296}");
 for(let level=1;level<=4;level++)for(let n=0;n<200;n++){
  const q=plain(t.run(`cvItem(${level},seeded)`)),len=[2,4,4,6][level-1];
  assert.deepEqual(q.call.slice(-len),q.target);assert.equal(q.options.filter(p=>JSON.stringify(p)===JSON.stringify(q.target)).length,1);
  const a=q.options[0],b=q.options[1],changed=a.map((e,i)=>e.notes!==b[i].notes?i:-1).filter(i=>i>=0);assert.equal(changed.length,1);const i=changed[0];assert(a[i].notes!==null&&b[i].notes!==null);assert(Math.abs(a[i].notes-b[i].notes)>=2,'Distractor must differ audibly by at least a whole tone');
  assert(a.every((e,i)=>e.dur===b[i].dur));assert.equal(q.target.reduce((x,e)=>x+e.dur,0),level===1?2:4);
  const permutations=q.pieces.length===2?[[0,1],[1,0]]:[[0,1,2],[0,2,1],[1,0,2],[1,2,0],[2,0,1],[2,1,0]];assert.equal(permutations.filter(p=>JSON.stringify(p.flatMap(i=>q.pieces[i]))===JSON.stringify(q.target)).length,1);
  t.run(`var candidate=${JSON.stringify(q)}`);t.run('candidate.options[1]=candidate.options[0]');assert.throws(()=>t.run('cvItemValid(candidate)'),/Ambiguous/);
 }
 assert.equal(t.run('cvSignature([{notes:60,dur:1}])'),t.run('cvSignature([{dur:1,notes:60}])'),'Music equality must not depend on JSON field order');
 for(let level=1;level<=4;level++){
  const a=setup(lang);a.run("go('conversation')");await a.run(`cvAction('level','${level}')`);const events=plain(a.run('cv.item.target'));await a.run('cvPlay(cv.item.target)');
  let beat=0,index=0;for(const e of events){if(e.notes!==null){const note=a.notes[index++];assert(note.sampled);assert(Math.abs(note.frequency-440*Math.pow(2,(e.notes-69)/12))<1e-6);assert(Math.abs(note.time-(10.1+beat*60/108))<1e-7);}beat+=e.dur;}
  assert.equal(a.notes.length,index);assert.equal(Math.max(...[...a.timers.values()].map(t=>t.ms)),150+beat*60000/108);a.run('stopAudio()');assert(a.notes.every(n=>n.node.stopped));
 }
 t.run("go('conversation')");await t.run("cvAction('choose','0')");assert.equal(t.run('cv.feedback'),t.run("cvText('heard')"));
 await t.run("cvAction('mode','build')");await t.run("cvAction('check')");assert.equal(t.run('cv.feedback'),t.run("cvText('incomplete')"));
 t.run('cv.order=cv.item.pieces.map((_,i)=>i).sort((a,b)=>cv.item.target.findIndex(e=>e===cv.item.pieces[a][0])-cv.item.target.findIndex(e=>e===cv.item.pieces[b][0]))');await t.run("cvAction('check');cvAction('check')");assert.equal(t.run('data.conversationPractice.done["build-1"]'),1);
 await t.run("cvAction('level','4');cvAction('mode','create');cvAction('save');cvAction('save')");assert.equal(t.run('data.conversationPractice.creations.length'),1);const reloaded=setup(lang,{stored:t.stored});assert.deepEqual(plain(reloaded.run('data.conversationPractice')),plain(t.run('data.conversationPractice')));
 t.run('exportData()');const backup=JSON.parse(await t.exported[0].text()),upload=async v=>t.listeners['importFile:change']({target:{files:[{size:100,text:async()=>JSON.stringify(v)}],value:'file'}}),before=plain(t.run('data'));
 for(const change of [v=>v.conversationPractice.version=99,v=>v.conversationPractice.done={'build-4':-1},v=>v.conversationPractice.creations[0].response[0].notes=999,v=>v.conversationPractice.creations[0].response[0].dur=3,v=>v.conversationPractice.creations[0].response=[],v=>v.conversationPractice.name='No']){const bad=structuredClone(backup);change(bad);await upload(bad);assert.deepEqual(plain(t.run('data')),before)}
 const legacy=structuredClone(backup);delete legacy.conversationPractice;await upload(legacy);assert.deepEqual(plain(t.run('data.conversationPractice')),before.conversationPractice);
 t.run("go('conversation')");await t.run("cvAction('mode','listen');cvAction('call')");const stale=[...t.timers.values()].map(x=>x.fn);t.run("go('home')");stale.forEach(fn=>fn());assert(!t.run('cv.heard.call'));assert(!t.run('cv.busy'));assert(t.notes.every(n=>n.node.stopped));
 const denied=setup(lang);denied.run("localStorage.setItem=()=>{throw Error('denied')};go('conversation')");await denied.run("cvAction('mode','create');cvAction('save')");assert(!denied.run('storageOK'));assert.equal(denied.run('data.conversationPractice.creations.length'),1);
 console.log('PASS '+lang+': 800 deterministic items, unique audible answers/reconstructions, bounded history, legacy atomic imports, denied storage and cancellation');
}})().catch(e=>{console.error(e);process.exitCode=1});
