// Deterministic scoring/clock simulations, not real-browser or speaker evidence.
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const Pulse=vm.runInNewContext(fs.readFileSync('src/seven-week/pulse.js','utf8')+';Pulse');
const beats=Array.from({length:8},(_,i)=>(4+i)*550);
function accepts(name,taps){const r=Pulse.assess(taps);assert(r.ok,name+': '+JSON.stringify(r));return r}
function rejects(name,taps){const r=Pulse.assess(taps);assert(!r.ok,name+': '+JSON.stringify(r));return r}
accepts('eight steady taps',beats);
accepts('constant220ms delay formerly rejected',beats.map(t=>t+220));
accepts('constant320ms delay',beats.map(t=>t+320));
accepts('delayed with ordinary variation',beats.map((t,i)=>t+180+[-40,35,-25,40,-45,30,-10,20][i]));
accepts('alternating100ms variation',beats.map((t,i)=>t+(i%2?100:-100)+120));
accepts('slightly faster steady pulse',beats.map((_,i)=>2300+i*510));
accepts('slightly slower steady pulse',beats.map((_,i)=>2300+i*590));
accepts('naturally ten slightly faster steady taps',Array.from({length:10},(_,i)=>2200+i*500));
accepts('two missed beats across both repeats',beats.filter((_,i)=>![2,5].includes(i)));
accepts('one misplaced tap',beats.map((t,i)=>t+(i===3?190:0)));
rejects('eight irregular taps',[2250,2410,3150,3290,4300,4480,5550,5750]);
rejects('repeated clicks at one instant',Array(20).fill(2200));
rejects('fast clustered clicks',Array.from({length:8},(_,i)=>2300+i*60));
rejects('double tempo',Array.from({length:16},(_,i)=>2200+i*275));
rejects('half tempo',Array.from({length:4},(_,i)=>2200+i*1100));
rejects('consistently too slow',Array.from({length:7},(_,i)=>2200+i*700));
rejects('steady650ms must not alias onto550ms',Array.from({length:8},(_,i)=>2200+i*650));
rejects('three hidden misses on a sparse inferred grid',[2200,2700,3200,4150,5100,6050]);
rejects('fast cluster followed by slow isolated taps',[2300,2550,2800,3050,4000,4950,5900,6400]);
rejects('one repetition only',Array.from({length:8},(_,i)=>2250+i*270));
rejects('only five taps',beats.slice(0,5));
assert.equal(Pulse.assess([2200,2750,3300]).reason,'few');
assert.equal(Pulse.assess(Array.from({length:8},(_,i)=>2300+i*60)).reason,'fast');
assert.equal(Pulse.assess(Array.from({length:7},(_,i)=>2200+i*700)).reason,'slow');
assert.equal(Pulse.assess([2250,2410,3150,3290,4300,4480,5550,5750]).reason,'uneven');
assert.equal(Pulse.assess(beats).matched,8);
assert.equal(Pulse.assess(beats.map(t=>t+220)).periodMs,550);
// The old actual scoring rule fails all eight220ms-late taps.
assert.equal(beats.map(t=>t+220).filter(t=>Math.min(t%550,550-t%550)<175).length,0);

const clock=Pulse.timeline({performanceTime:10000,contextTime:10.2,
  outputTimestamp:{contextTime:10,performanceTime:10000},baseLatency:.05,outputLatency:.15});
assert.equal(clock.source,'output-timestamp');assert.equal(clock.contextTime,10);
// An event timestamp at10200, dispatched at10300, must retain its200ms timing.
const event=Pulse.eventTime(10200,10300,1700000000000);
assert(Math.abs((clock.contextTime+(event-clock.performanceTime)/1000-10)*1000-200)<1e-8);
assert.equal(Pulse.eventTime(1700000010200,10300,1700000000000),10200);
assert.equal(Pulse.eventTime(undefined,10300,1700000000000),10300);
const fallback=Pulse.timeline({performanceTime:10000,contextTime:10.2,baseLatency:.05,outputLatency:.15});
assert.equal(fallback.source,'latency-estimate');assert(Math.abs(fallback.contextTime-10)<1e-10);
for(const outputTimestamp of [{contextTime:0,performanceTime:0},{contextTime:10,performanceTime:1},{contextTime:99,performanceTime:10000}]){
  assert.equal(Pulse.timeline({performanceTime:10000,contextTime:10.2,outputTimestamp}).source,'latency-estimate');
}
console.log('PASS: pulse/latency clock simulations; steady/delayed/jitter/missed beats accepted; irregular, fast, slow and clickspam rejected. Human device validation PENDING.');
