// Source-integrity and shared-playback simulations; not real-browser evidence.
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const B=vm.runInNewContext(fs.readFileSync('src/seven-week/barlines.js','utf8')+';Barlines');
assert.deepEqual(Array.from(B.required(3)),[3,6,9]);assert.deepEqual(Array.from(B.required(4)),[4,8]);
for(const m of [3,4]){
  assert(B.inspect(m,B.required(m)).ok);assert(!B.inspect(m,[]).ok);
  assert.equal(B.inspect(m,[]).kind,'few');assert.equal(B.inspect(m,Array.from({length:11},(_,i)=>i+1)).kind,'many');
  assert.equal(B.inspect(m,m===3?[2,6,9]:[3,8]).kind,'positions');
}
assert.throws(()=>B.required(6),/3\/4 or 4\/4/);
for(const n of [2,3,5,6,7])assert(!fs.readFileSync(`src/seven-week/week-${n}.js`,'utf8').includes('X.need('),'Answer grading cannot depend on a playback receipt');

// Execute actual X.play/X.listen with a deterministic fake audio clock and timers.
// The waveform would already have ended before the shared completion receipt.
const timers=new Map();let next=0;
const context={globalThis:{},addEventListener(){},document:{addEventListener(){}},
  setTimeout(fn,ms){const id=++next;timers.set(id,{fn,ms});return id},clearTimeout(id){timers.delete(id)}};
vm.createContext(context);vm.runInContext(fs.readFileSync('src/seven-week/bridge.js','utf8')+';globalThis.bridge=X',context);
const X=context.globalThis.bridge,audio={currentTime:0,state:'running',async resume(){}};
X.context=async()=>audio;X.voice=()=>{};
(async()=>{
  await X.listen('target',[{midi:64,at:0,dur:.46*.85}],.46);
  assert.equal([...timers.values()][0].ms,560);
  audio.currentTime=.08+.46*.85+.03;assert(Math.abs(audio.currentTime-.501)<1e-8);
  assert(!X.heard.has('target'));await X.play([{midi:69,at:0,dur:.46*.85}],.46);
  assert(!X.heard.has('target'),'A naturally ended note has no receipt once the following example cancels its silent tail');
  console.log('PASS: exact barline criteria, no answer-receipt vetoes, deterministic naturally-ended-note/receipt race (simulation).');
})().catch(e=>{console.error(e);process.exitCode=1});
