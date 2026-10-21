// Node regression tests only: cannot verify actual speaker output or iOS routing.
const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const path = require('node:path');

function setup(locale, options = {}) {
  const html = fs.readFileSync(path.join(__dirname, '../dist/', locale + '.html'), 'utf8');
  const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1]);
  const elements = {}, listeners = {}, contexts = [], notes = [], timers = new Map(), stored = {...(options.stored||{})};
  const addListener = (type, fn) => {const previous=listeners[type]; listeners[type]=previous ? (...args)=>{previous(...args);fn(...args)} : fn};
  let nextTimer = 0;
  const element = id => elements[id] ||= {
    innerHTML:'', textContent:'', value:'', className:'',
    classList:{ values:new Set(['hidden']), add(x){this.values.add(x)}, remove(x){this.values.delete(x)}, contains(x){return this.values.has(x)} },
    addEventListener(type, fn){listeners[id + ':' + type] = fn},
    setAttribute(){}, removeAttribute(){}, click(){}
  };
  class AudioContext {
    constructor(){this.state = options.state || 'running'; this.currentTime = 10; this.destination = {}; contexts.push(this)}
    createGain(){const gain = {value:0,setValueAtTime(){},exponentialRampToValueAtTime(){},linearRampToValueAtTime(){}}; return {gain,connect(){},disconnect(){}}}
    createOscillator(){throw Error('Synth audio is forbidden in the main app')}
    createBuffer(){return {getChannelData(){return new Float32Array(1)}}}
    decodeAudioData(bytes){return Promise.resolve({m:bytes.m,numberOfChannels:1,duration:16,getChannelData(){return new Float32Array([.5,-.5])}})}
    createBufferSource(){return {playbackRate:{value:1},connect(){},start(time){notes.push({frequency:440*Math.pow(2,(this.buffer.m-69)/12)*this.playbackRate.value,time,node:this,sampled:true})},stop(time){this.stopped=true;(this.stopCalls ||= []).push(time)},disconnect(){}}}
    resume(){this.resumeCalled = true; if(options.resume === 'reject') return Promise.reject(Error('Blocked')); if(options.resume === 'hang') return new Promise(()=>{}); this.state='running';return Promise.resolve()}
    close(){this.state='closed'; return Promise.resolve()}
  }
  const exported=[];
  const navigator = {audioSession:{type:'auto'}};
  const sandbox = {
    console, navigator, Blob, AbortController,
    fetch:options.fetch || (async url=>({ok:true,arrayBuffer:async()=>({m:({C3:48,Fs3:54,C4:60,Fs4:66,C5:72})[url.split("/").pop().replace(".mp3","")]})})), URL:{createObjectURL(blob){exported.push(blob);return 'blob:mock'},revokeObjectURL(){}}, performance:{now:()=>0},
    localStorage:{getItem:key=>stored[key]||null,setItem:(key,value)=>{stored[key]=value}},
    document:{documentElement:{lang:locale},hidden:false,visibilityState:'visible',getElementById:element,querySelectorAll:()=>[],querySelector:()=>null,addEventListener:addListener,createElement:()=>element('created')},
    window:{AudioContext,webkitAudioContext:AudioContext,navigator,scrollTo(){},addEventListener(){}},
    setTimeout(fn,ms){const id=++nextTimer;timers.set(id,{fn,ms});return id},clearTimeout(id){timers.delete(id)},
    confirm:()=>true
  };
  if(options.unsupported){delete sandbox.window.AudioContext;delete sandbox.window.webkitAudioContext}
  vm.createContext(sandbox);for(const script of scripts)vm.runInContext(script,sandbox);
  return {run:code=>vm.runInContext(code,sandbox),elements,listeners,contexts,notes,timers,navigator,stored,exported};
}
let passed=0,failed=0;
async function test(name,fn){try{await fn();passed++;console.log('PASS '+name)}catch(error){failed++;console.error('FAIL '+name+': '+error.message)}}
const flush=async()=>{for(let i=0;i<40;i++)await Promise.resolve()};
module.exports={setup,flush};
if(require.main === module)(async()=>{
  for(const locale of ['nn','nb','en']){
    await test(locale+': Test sound button schedules three notes',async()=>{
      const t=setup(locale);const button={disabled:false,dataset:{},hasAttribute:name=>name==='data-test-audio'};
      t.listeners.click({target:{closest:()=>button}});await flush();
      assert.equal(t.notes.length,3);assert(!t.elements.audioStatus.classList.contains('hidden'));
      assert(t.elements.audioStatus.textContent.length>30);
    });
    await test(locale+': Test sound keeps failure message on blocked audio',async()=>{
      const t=setup(locale,{state:'suspended',resume:'reject'});await t.run('testAudio()');
      assert.equal(t.notes.length,0);assert(!t.elements.audioStatus.classList.contains('hidden'));
      assert(!/Tre testtonar|Tre testtoner|Three test notes/.test(t.elements.audioStatus.textContent));
    });
    await test(locale+': optional audioSession absent or setter throws',async()=>{
      for(const mode of ['absent','throw']){
        const t=setup(locale);if(mode==='absent')delete t.navigator.audioSession;
        else Object.defineProperty(t.navigator.audioSession,'type',{set(){throw Error('Unsupported')}});
        await t.run('sequence([{notes:69,dur:1}])');assert.equal(t.notes.length,1);
      }
    });
    await test(locale+': A4 pitch, timing, audible gain and stop',async()=>{
      const t=setup(locale);await t.run('sequence([{notes:69,dur:1},{notes:72,dur:1}],60)');
      assert.equal(t.notes.length,2);assert(Math.abs(t.notes[0].frequency-440)<1e-8);assert.equal(t.notes[1].time-t.notes[0].time,1);
      assert(t.run('master.gain.value')>0);t.run('stopAudio()');assert(t.notes.every(n=>n.node.stopped));
    });
    await test(locale+': every task/level schedules sound',async()=>{
      const t=setup(locale);
      for(const activity of ['rhythm','melody','harmony'])for(let level=1;level<=4;level++){
        const before=t.notes.length;t.run(`data.levels.${activity}=${level};go('${activity}');playTarget()`);await flush();
        assert(t.notes.length>before,activity+' level '+level+' silent');
      }
    });
    await test(locale+': suspended and interrupted contexts resume',async()=>{
      for(const state of ['suspended','interrupted']){
        const t=setup(locale,{state});const promise=t.run('sequence([{notes:69,dur:1}])');
        assert(t.contexts[0].resumeCalled,'resume must begin synchronously within tap handler');
        await promise;assert.equal(t.notes.length,1);
      }
    });
    await test(locale+': stop while resuming cancels queued notes',async()=>{
      const t=setup(locale,{state:'suspended'});const promise=t.run('sequence([{notes:69,dur:1}])');t.run('stopAudio()');await promise;assert.equal(t.notes.length,0);
    });
    await test(locale+': unsupported/rejected audio shows error',async()=>{
      for(const opts of [{unsupported:true},{state:'suspended',resume:'reject'}]){
        const t=setup(locale,opts);await t.run('sequence([{notes:69,dur:1}])');assert.equal(t.notes.length,0);
        assert(!t.elements.audioStatus.classList.contains('hidden'));assert(t.elements.audioStatus.textContent.length>10);
      }
    });
    await test(locale+': requests playback audio session',async()=>{
      const t=setup(locale);await t.run('ensureAudio()');assert.equal(t.navigator.audioSession.type,'playback');
    });
    await test(locale+': recovers from closed audio context',async()=>{
      const t=setup(locale);await t.run('ensureAudio()');t.run("ctx.state='closed'");await t.run('sequence([{notes:69,dur:1}])');
      assert.equal(t.contexts.length,2,'closed context must be replaced');assert.equal(t.notes.length,1);
    });
    await test(locale+': zero volume gives visible feedback',async()=>{
      const t=setup(locale);t.run('data.volume=0');await t.run('sequence([{notes:69,dur:1}])');assert(!t.elements.audioStatus.classList.contains('hidden'),'muted audio silently reported as success');
    });
    await test(locale+': hanging resume resolves with feedback',async()=>{
      const t=setup(locale,{state:'suspended',resume:'hang'});let settled=false;const pending=t.run('ensureAudio()').then(()=>settled=true);
      await flush();for(const {fn} of [...t.timers.values()])fn();await flush();
      assert(settled,'resume hangs forever without timeout');await pending;assert(!t.elements.audioStatus.classList.contains('hidden'));
    });
  }
  console.log(`${passed} passed; ${failed} failed. Mock tests; no audible/device verification.`);
  if(failed)process.exitCode=1;
})();
