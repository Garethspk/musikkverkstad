const {setup,flush}=require('./audio.cjs');const assert=require('node:assert/strict');
(async()=>{
for(const lang of ['nn','nb','en']){
 const t=setup(lang);t.run("go('puzzle')");assert(t.elements.app.innerHTML.includes(t.run("ppText('title')")));
 assert(t.elements.app.innerHTML.includes(t.run("ppText('audio')")));
 for(const level of [1,2,3,4]){
 await t.run("ppAction('level','"+level+"')");
 const target=[...t.run('pp.target')],pieces=JSON.parse(t.run('JSON.stringify(pp.pieces)'));
 assert.equal(target.length,level===4?4:level+1);assert.equal(new Set(pieces.map(JSON.stringify)).size,pieces.length);
 if(level===4)assert.equal(new Set(target).size,3);else assert.equal(new Set(target).size,target.length);
 await t.run("ppAction('check')");assert.equal(t.run('pp.feedback'),t.run("ppText('incomplete')"));
 const count=t.notes.length;await t.run("ppAction('mine')");assert.equal(t.notes.length,count);
 for(let i=0;i<target.length;i++)await t.run("ppAction('slot','"+i+"');ppAction('place','"+target[i]+"')");
 await t.run("ppAction('check')");assert(t.run('pp.success'));assert(t.elements.app.innerHTML.includes(t.run("ppText('finish')")));
 await t.run("ppAction('slot','0');ppAction('place','"+((target[0]+1)%pieces.length)+"');ppAction('check')");assert(!t.run('pp.success'));
 const before=t.notes.length;await t.run("ppAction('whole')");const expected=target.flatMap(i=>pieces[i]);
 assert.equal(t.notes.length-before,expected.length);assert(t.notes.slice(before).every((n,i)=>n.sampled&&Math.abs(n.frequency-440*2**((expected[i]-69)/12))<1e-8));
 assert(t.run('pp.busy'));const old=t.run('pp.selected');await t.run("ppAction('slot','1')");assert.equal(t.run('pp.selected'),old);
 await t.run("ppAction('stop')");assert(!t.run('pp.busy'));assert.equal(t.timers.size,0);
 const answer=t.run('JSON.stringify(pp.answer)');await t.run("ppAction('preview','0')");assert.equal(t.run('JSON.stringify(pp.answer)'),answer);await t.run("ppAction('stop')");
 await t.run("ppAction('clear')");assert.equal(t.run('pp.answer[pp.selected]'),null);
 }
 t.run("pp.pieces=[[60,62],[64,60],[67,64]];pp.target=[0,1,0,2];pp.level=4");
 let accepted=0;for(let a=0;a<3;a++)for(let b=0;b<3;b++)for(let c=0;c<3;c++)for(let d=0;d<3;d++){
 t.run('pp.answer='+JSON.stringify([a,b,c,d]));await t.run("ppAction('check')");const correct=a===0&&b===1&&c===0&&d===2;assert.equal(t.run('pp.success'),correct);if(correct)accepted++;
 }assert.equal(accepted,1);
 await t.run("ppAction('whole')");const stale=[...t.timers.values()].map(v=>v.fn);t.run("go('home')");stale.forEach(fn=>fn());assert(!t.run('pp.busy'));assert.equal(t.run('route'),'home');assert.equal(t.run('pp.playSlot'),-1);
 let release;const gate=new Promise(r=>release=r);const slow=setup(lang,{fetch:async()=>{await gate;return {ok:true,arrayBuffer:async()=>({m:60})}}});slow.run("go('puzzle')");const pending=slow.run("ppAction('whole')");await flush();assert(slow.run('pp.busy'));slow.run('stopAudio()');release();await pending;assert.equal(slow.notes.length,0);assert(!slow.run('pp.busy'));
 console.log('PASS '+lang+': four levels, exact answers, repeated fragment, sampled audio, separate preview/place, incomplete input, cancellation and navigation');
}
})().catch(e=>{console.error(e);process.exitCode=1});
