const {setup,flush}=require('./audio.cjs');const assert=require('node:assert/strict');
(async()=>{
for(const lang of ['nn','nb','en']){
 const t=setup(lang);t.run("go('notation')");
 assert(t.elements.app.innerHTML.includes(t.run("nmText('context')")));
 // Independent engraving anchors: C4 ledger, E4 bottom line, B4 middle, C5 space.
 for(const [m,y]of [[60,98],[62,93],[64,88],[65,83],[67,78],[69,73],[71,68],[72,63]])assert.equal(t.run('nmY('+m+')'),y);
 const score=t.run("nmScore([60,64,71,72],'A')");assert(score.includes('y1="98" y2="98"'));assert(score.includes('cy="63"'));
 assert(!score.includes('C4, E4'));t.run('nm.support=true');assert(t.run("nmScore([60,64],'A')").includes('C4, E4'));
 for(const level of [1,2,3,4]){
 await t.run("nmAction('level','"+level+"')");
 for(let j=0;j<50;j++){
 t.run('nmNew()');const q=JSON.parse(t.run('JSON.stringify(nm)'));
 assert.equal(q.target.length,level+2);assert.equal(q.target[0],60);
 const pool=level===1?[60,62,64]:level===2?[60,62,64,67,69]:[60,62,64,65,67,69,71,72];
 assert(q.options.every(a=>a.length===q.target.length&&a[0]===60&&a.every(n=>pool.includes(n))));
 assert.equal(new Set(q.options.map(JSON.stringify)).size,q.options.length);
 assert.equal(q.options.filter(a=>JSON.stringify(a)===JSON.stringify(q.target)).length,1);
 assert.deepEqual(q.options[q.correct],q.target);
 }
 await t.run("nmAction('check')");assert.equal(t.run('nm.feedback'),t.run("nmText('selectFirst')"));
 const wrong=t.run('(nm.correct+1)%nm.options.length');await t.run("nmAction('answer','"+wrong+"')");assert.equal(t.run('nm.feedback'),'');assert(!t.run('nm.success'));
 await t.run("nmAction('check')");assert.equal(t.run('nm.feedback'),t.run("nmText('wrong')"));
 const right=t.run('nm.correct');await t.run("nmAction('answer','"+right+"')");assert(!t.run('nm.success'));await t.run("nmAction('check')");assert(t.run('nm.success'));
 const result=t.run('nm.feedback');await t.run("nmAction('answer','"+wrong+"');nmAction('check')");assert.equal(t.run('nm.feedback'),result);
 const before=t.notes.length,notes=[...t.run('nm.target')];await t.run("nmAction('play')");assert.equal(t.notes.length-before,notes.length);
 assert(t.notes.slice(before).every((n,i)=>n.sampled&&Math.abs(n.frequency-440*2**((notes[i]-69)/12))<1e-8));
 const stale=[...t.timers.values()].map(v=>v.fn);await t.run("nmAction('stop')");stale.forEach(fn=>fn());assert(!t.run('nm.busy'));assert.equal(t.run('nm.message'),'');
 const start=t.notes.length;await t.run("nmAction('slow')");assert(Math.abs(t.notes[start+1].time-t.notes[start].time-60/65)<1e-8);t.run('stopAudio()');
 }
 let release;const gate=new Promise(r=>release=r);const slow=setup(lang,{fetch:async()=>{await gate;return {ok:true,arrayBuffer:async()=>({m:60})}}});slow.run("go('notation')");const pending=slow.run("nmAction('play')");await flush();assert(slow.run('nm.busy'));slow.run("go('home')");release();await pending;assert.equal(slow.notes.length,0);assert(!slow.run('nm.busy'));
 console.log('PASS '+lang+': notation anchors, unique choices, select/check separation, immutable success, piano sequence, tempo and cancellation');
}
})().catch(e=>{console.error(e);process.exitCode=1});
