/* Shared offline lifecycle; no network/storage, no grading or progress bypass. */
const X={token:0,nodes:new Set(),timers:new Set(),heard:new Set(),busy:false,events:[],lang:()=>document.documentElement.lang,
 text:(nn,nb,en)=>document.documentElement.lang==='en'?en:document.documentElement.lang==='nb'?nb:nn,
 stop(){this.token++;this.busy=false;for(const t of this.timers)clearTimeout(t);this.timers.clear();for(const n of this.nodes)try{n.stop()}catch{}this.nodes.clear()},
 async play(events,length,after,repeat=false){this.stop();const token=this.token;this.busy=true;try{const c=await this.context();await c.resume();if(token!==this.token)return;const cycle=()=>{if(token!==this.token)return;const at=c.currentTime+.08;this.startedAt=at;this.events=events.map(e=>({...e}));for(const e of events)if(e.midi!==null)this.voice(e,at+e.at);const finish=()=>{if(token!==this.token)return;if(c.state!=='running'||c.currentTime<at+length){const t=setTimeout(finish,25);this.timers.add(t);return}this.busy=false;if(after)after();if(repeat&&(typeof repeat!=='function'||repeat())&&token===this.token)cycle()};const t=setTimeout(finish,Math.ceil((length+.1)*1000));this.timers.add(t)};cycle()}catch(e){if(token===this.token){this.stop();this.message(this.text('Lyden kunne ikkje starta. Prøv spel igjen.','Lyden kunne ikke starte. Prøv spill igjen.','Audio could not start. Try Play again.'))}}},
 message(s){const e=document.getElementById('status');if(e)e.textContent=s},
 melody(ns,step=.36,inst=0){return ns.map((midi,i)=>({midi,at:i*step,dur:step*.85,inst}))},
 synth(e,at,type='triangle',volume=.095){const c=this.audioContext;const o=c.createOscillator(),g=c.createGain();o.type=type;o.frequency.value=440*2**((e.midi-69)/12);g.gain.setValueAtTime(.0001,at);g.gain.linearRampToValueAtTime(volume,at+.01);g.gain.exponentialRampToValueAtTime(.0001,at+Math.max(.03,e.dur));o.connect(g).connect(c.destination);o.start(at);o.stop(at+e.dur+.03);this.nodes.add(o);o.onended=()=>{this.nodes.delete(o);o.disconnect();g.disconnect()}},
 need(keys){if(keys.every(k=>this.heard.has(k)))return true;this.message(this.text('Høyr døma ferdig før du svarar.','Hør eksemplene ferdig før du svarer.','Hear the examples to the end before answering.'));return false},
 // A receipt describes this scheduled playback, not whether a pupil heard it.
 // Content-answer validation must not depend on a delayed receipt callback.
 listen(key,events,length,after){return this.play(events,length,()=>{this.heard.add(key);if(after)after()})}
};
// Observe ALL original oscillator primitives too; cancellation covers their native nodes.
const AudioAPI=globalThis.AudioContext||globalThis.webkitAudioContext;const xp=AudioAPI?.prototype,xc=xp?.createOscillator;if(xp)xp.createOscillator=function(...args){const o=xc.apply(this,args);X.nodes.add(o);o.addEventListener('ended',()=>X.nodes.delete(o),{once:true});return o};
addEventListener('pagehide',()=>X.stop());document.addEventListener('visibilitychange',()=>{if(document.hidden)X.stop()});
