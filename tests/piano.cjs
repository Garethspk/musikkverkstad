const {setup,flush}=require('./audio.cjs');
const assert=require('node:assert/strict');
(async()=>{
for(const locale of ['nn','nb','en']){
 let requests=0;
 const t=setup(locale);await t.run('sequence([{notes:[36,60,79],dur:1}])');
 assert(t.notes.every(n=>n.sampled));assert.equal(t.notes.length,3);
 for(const [i,m]of [36,60,79].entries())assert(Math.abs(t.notes[i].frequency-440*2**((m-69)/12))<1e-8);
 t.run('stopAudio()');assert(t.notes.every(n=>n.node.stopped));
 const bad=setup(locale,{fetch:async()=>{requests++;return {ok:false}}});
 assert.equal(await bad.run('sequence([{notes:60,dur:1}])'),false);
 assert.equal(bad.notes.length,0);assert(!bad.elements.audioStatus.classList.contains('hidden'));
 await bad.run('sequence([{notes:60,dur:1}])');assert.equal(requests,10);
 const beat=setup(locale);
 await beat.run('sequence(rhythmEvents([1,1]))');assert.equal(beat.notes.length,2);assert(beat.notes.every(n=>n.sampled));
 let release;const gate=new Promise(r=>release=r);
 const slow=setup(locale,{fetch:async()=>{await gate;return {ok:true,arrayBuffer:async()=>({m:60})}}});
 const pending=slow.run('sequence([{notes:60,dur:1}])');await flush();slow.run('stopAudio()');release();await pending;assert.equal(slow.notes.length,0);
 await slow.run('sequence([{notes:60,dur:1}])');assert.equal(slow.notes.length,1);
 console.log('PASS '+locale+': sampled range, stop, failure/retry, piano rhythm and cancellation during load');
}
})().catch(e=>{console.error(e);process.exitCode=1});
