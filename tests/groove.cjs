const {setup,flush}=require('./audio.cjs');
const assert=require('node:assert/strict');
// Independent observable onset/time oracles; mock browser/audio, not speaker QA.
const finish=t=>{const pending=[...t.timers.values()].sort((a,b)=>a.ms-b.ms);t.timers.clear();pending.forEach(x=>x.fn())};
(async()=>{
for(const lang of ['nn','nb','en']){
 const t=setup(lang);t.run("go('groove')");
 assert(t.elements.app.innerHTML.includes(t.run("grText('title')")));
 assert(t.elements.app.innerHTML.includes(t.run("grText('local')")));
 for(let level=1;level<=4;level++){
  await t.run(`grAction('level','${level}')`);
  const cells=[4,8,8,16][level-1],step=[1,.5,1,.5][level-1],beats=level<=2?4:8;
  for(let round=0;round<80;round++){
   t.run('grNew()');
   const target=Array.from(t.run('gr.target')),options=JSON.parse(t.run('JSON.stringify(gr.options)'));
   assert.equal(target.length,cells);assert.equal(target[0],1);assert(target.every(x=>x===0||x===1));
   assert.equal(options.filter(p=>p.every((x,i)=>x===target[i])).length,1);
   assert(options.every(p=>p.length===cells&&p[0]===1));
   assert.equal(options[0].filter((x,i)=>x!==options[1][i]).length,1);
  }
  await t.run("grAction('choose','0')");assert.equal(t.run('gr.feedback'),t.run("grText('hearFirst')"));
  for(const [action,value,key] of [['reference','','reference'],['option','0','option0'],['option','1','option1']]){
   const before=t.notes.length,pattern=Array.from(t.run(action==='reference'?'gr.target':`gr.options[${value}]`));
   await t.run(`grAction('${action}','${value}')`);assert(t.run('gr.busy'));assert(!t.run(`gr.heard.${key}`));
   const notes=t.notes.slice(before),onsets=pattern.flatMap((v,i)=>v?[i*step*.625]:[]);
   assert.equal(notes.length,onsets.length);notes.forEach((n,i)=>{assert(n.sampled);assert(Math.abs(n.frequency-261.6255653005986)<1e-6);assert(Math.abs(n.time-10.1-onsets[i])<1e-8)});
   assert.equal(Math.max(...Array.from(t.timers.values()).map(x=>x.ms)),150+beats*625);
   const original=t.run('JSON.stringify(gr.target)');await t.run("grAction('new')");assert.equal(t.run('JSON.stringify(gr.target)'),original);
   finish(t);assert(!t.run('gr.busy'));assert(t.run(`gr.heard.${key}`));
  }
  const correct=t.run('gr.options.findIndex(p=>p.every((x,i)=>x===gr.target[i]))');
  await t.run(`grAction('choose','${1-correct}')`);assert(!t.run('gr.success'));
  await t.run(`grAction('choose','${correct}')`);assert(t.run('gr.success'));
  await t.run("grAction('mode','repair')");await t.run("grAction('check')");assert(!t.run('gr.success'));
  const changed=t.run('gr.answer.findIndex((x,i)=>x!==gr.target[i])');await t.run(`grAction('cell','${changed}')`);await t.run("grAction('check')");assert(t.run('gr.success'));
  await t.run("grAction('cell','0')");assert(!t.run('gr.success'));await t.run("grAction('check')");assert(!t.run('gr.success'));
  await t.run("grAction('mode','create')");assert.equal(t.run('gr.answer.length'),cells);
  t.run('gr.answer.fill(0)');let before=t.notes.length;await t.run("grAction('mine')");assert.equal(t.notes.length,before);assert.equal(t.run('gr.feedback'),t.run("grText('silent')"));assert(!t.run('gr.busy'));
  // Leading and trailing rests preserved; repeat begins after full bar duration.
  t.run('gr.answer[1]=1');before=t.notes.length;await t.run("grAction('twice')");
  assert.equal(t.notes.length-before,2);assert(Math.abs(t.notes[before].time-10.1-step*.625)<1e-8);assert(Math.abs(t.notes[before+1].time-t.notes[before].time-beats*.625)<1e-8);
  assert.equal(Math.max(...Array.from(t.timers.values()).map(x=>x.ms)),150+2*beats*625);
  await t.run("grAction('stop')");assert(!t.run('gr.busy'));assert.equal(t.timers.size,0);
 }
 await t.run("grAction('mode','listen')");await t.run("grAction('reference')");const stale=[...t.timers.values()].map(x=>x.fn);
 t.run("go('home')");stale.forEach(fn=>fn());assert.equal(t.run('route'),'home');assert(!t.run('gr.busy'));assert(!t.run('gr.heard.reference'));assert.equal(t.run('gr.playSlot'),-1);
 let release;const gate=new Promise(r=>release=r),slow=setup(lang,{fetch:async()=>{await gate;return {ok:true,arrayBuffer:async()=>({m:60})}}});
 slow.run("go('groove')");const pending=slow.run("grAction('reference')");await flush();assert(slow.run('gr.busy'));slow.run('stopAudio()');release();await pending;assert.equal(slow.notes.length,0);assert(!slow.run('gr.busy'));
 const bad=setup(lang,{fetch:async()=>({ok:false})});bad.run("go('groove')");await bad.run("grAction('reference')");assert(!bad.run('gr.busy'));assert.equal(bad.run('gr.message'),bad.run("grText('error')"));assert(!bad.run('gr.heard.reference'));
 console.log('PASS '+lang+': four grids, unique onset answers, repair, creative rests/repeat timing, sampled audio, listen gating, loading failure and cancellation');
}
})().catch(e=>{console.error(e);process.exitCode=1});
