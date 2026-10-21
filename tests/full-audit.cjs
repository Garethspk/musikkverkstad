// UI-handler audit with DOM and Web Audio mocks, not a browser/audibility test.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {setup,flush}=require('./audio.cjs');
let passed=0,failed=0;
async function test(name,fn){try{await fn();passed++;console.log('PASS '+name)}catch(e){failed++;console.error('FAIL '+name+': '+e.message)}}
function dispatch(t,attrs,disabled=false){const dataset={};for(const [k,v]of Object.entries(attrs))if(k.startsWith('data-'))dataset[k.slice(5).replace(/-([a-z])/g,(_,x)=>x.toUpperCase())]=String(v);const b={disabled,dataset,hasAttribute:k=>k in attrs};t.listeners.click({target:{closest:s=>s==='button'||s==='[data-theme-action]'&&'data-theme-action'in attrs?b:null}})}
async function click(t,attrs,disabled=false){dispatch(t,attrs,disabled);await flush()}
function themeButtons(t,action,value){return [...t.run('themeView()').matchAll(/<button\b[^>]*>/g)].map(x=>x[0]).filter(x=>x.includes(`data-theme-action="${action}"`)&&(value===undefined||x.includes(`data-theme-value="${value}"`)))}
async function themeClick(t,action,value=''){const tags=themeButtons(t,action,value);assert(tags.length,`missing rendered button ${action}:${value}`);await click(t,{'data-theme-action':action,'data-theme-value':value},/\sdisabled(?:\s|>|=)/.test(tags[0]))}
async function timers(t){for(const [id,{fn}]of [...t.timers]){t.timers.delete(id);fn()}await flush()}
(async()=>{for(const lang of ['nn','nb','en']){
 await test(lang+': original activity click routes all 4 levels',async()=>{const t=setup(lang);for(const kind of ['rhythm','melody','harmony'])for(let level=1;level<=4;level++){
  await click(t,{'data-go':kind});await click(t,{'data-level':level});assert.equal(t.run('q.level'),level);assert.equal(t.run('activity'),kind);
  let before=t.notes.length;await click(t,{'data-play':'target'});assert(t.notes.length>before);before=t.notes.length;await click(t,{'data-play':'slow'});assert(t.notes.length>before);
  await click(t,{'data-check':''});assert.equal(t.run('solved'),false);await click(t,{'data-hint':''});assert(t.run('hinted'));before=t.notes.length;await click(t,{'data-demo':''});assert(t.notes.length>before);
  await click(t,{'data-reveal':''});assert(t.run('revealed'));const done=t.run(`data.stats.${kind}.done`);await click(t,{'data-check':''});assert.equal(t.run(`data.stats.${kind}.done`),done);
  await click(t,{'data-next':''});assert(!t.run('revealed'));assert(!t.run('hinted'));
  if(kind==='rhythm')await click(t,{'data-duration':t.run('q.correct')});
  if(kind==='melody'){const notes=[...t.run('q.notes')];for(let i=0;i<notes.length;i++){await click(t,{'data-select':i});await click(t,{'data-note':notes[i]})}before=t.notes.length;await click(t,{'data-play':'answer'});assert.equal(t.notes.length-before,notes.length)}
  if(kind==='harmony'){for(let i=0;i<t.run('q.options.length');i++){before=t.notes.length;await click(t,{'data-audition':i});assert(t.notes.length>before)}await click(t,{'data-chord':t.run('q.correct')})}
  await click(t,{'data-check':''});assert(t.run('solved'));assert.equal(t.run(`data.stats.${kind}.done`),done+1);await click(t,{'data-check':''});assert.equal(t.run(`data.stats.${kind}.done`),done+1);
  await click(t,{'data-stop':''});assert(t.notes.every(n=>n.node.stopCalls.includes(undefined)));
 }});
 await test(lang+': creative save open replay plus progress export/import volume/navigation',async()=>{const t=setup(lang);await click(t,{'data-go':'create'});await click(t,{'data-save-creation':''});assert.equal(t.run('data.creations.length'),0);
  const select={hasAttribute:k=>k==='data-create',dataset:{create:'7'},value:'69'};t.listeners.change({target:select});await click(t,{'data-save-creation':''});assert.equal(t.run('data.creations.length'),1);
  for(const mode of ['creation','original']){const before=t.notes.length;await click(t,{'data-play':mode});assert.equal(t.notes.length-before,8)}
  await click(t,{'data-go':'progress'});let before=t.notes.length;await click(t,{'data-play-saved':'0'});assert.equal(t.notes.length-before,8);await click(t,{'data-open-saved':'0'});assert.equal(t.run('route'),'create');assert.equal(t.run('creative[7]'),69);
  t.listeners['volume:input']({target:{value:'37'}});assert.equal(t.run('data.volume'),.37);assert.equal(t.run('master.gain.value'),.37*.22);
  await click(t,{'data-export':''});const backup=JSON.parse(await t.exported.at(-1).text());assert.equal(backup.creations[0].notes[7],69);assert(backup.themeEnding);
  await t.listeners['importFile:change']({target:{files:[{size:100,text:async()=>JSON.stringify(backup)}],value:'x'}});assert.equal(t.run('route'),'progress');assert.equal(t.run('data.creations[0].notes[7]'),69);
  for(const route of ['home','about','progress','theme']){await click(t,{'data-go':route});assert.equal(t.run('route'),route);assert(t.elements.app.innerHTML.length>100)}
  const html=fs.readFileSync(path.join(__dirname,'../dist',lang+'.html'),'utf8');for(const target of ['nn','nb','en'])assert(html.includes(`href="${target}.html"`));assert.equal(t.stored['musikkverkstad-language'],lang);
 });
 await test(lang+': wrong follow-up cannot look like another correct answer',async()=>{const t=setup(lang);await click(t,{'data-go':'theme'});await themeClick(t,'quick');await themeClick(t,'play','reference');await timers(t);const wrong=t.run('thState.question.odd'),right=wrong==='A'?'B':'A';
  await themeClick(t,'answer',right);assert(t.run('thState.success'));const tag=themeButtons(t,'answer',wrong)[0];if(tag&&!/\sdisabled(?:\s|>|=)/.test(tag)){await themeClick(t,'answer',wrong);assert.notEqual(t.run('thState.feedback'),t.run("thText('right')"),'wrong button still enabled and retains correct feedback')}
 });
 await test(lang+': rapid A/B playback cannot silently cut off distinguishing ending',async()=>{const t=setup(lang);await click(t,{'data-go':'theme'});await themeClick(t,'quick');await themeClick(t,'play','reference');await timers(t);await themeClick(t,'play','A');const count=t.notes.length;await themeClick(t,'play','B');
  const pending=t.run('typeof thState.playing !== "undefined" ? thState.playing : null');assert(t.notes.length===count||pending!==null,'B starts immediately with no playback state; A ending gets cut off');
 });
 await test(lang+': exact ending excerpts; busy completion Stop and navigation unlock',async()=>{const t=setup(lang);await click(t,{'data-go':'theme'});await themeClick(t,'explore');for(let level=1;level<=4;level++){await themeClick(t,'level',String(level));for(const value of ['reference','A','B']){const expected=[...t.run(value==='reference'?'thState.question.target':`thState.question.${value}`)].slice(8-level).map(n=>440*2**((n-69)/12));const before=t.notes.length;await themeClick(t,'excerpt',value);assert.equal(t.notes.slice(before).length,expected.length);assert(t.notes.slice(before).every((n,i)=>Math.abs(n.frequency-expected[i])<1e-8));assert.notEqual(t.run('thState.playing'),null);assert(themeButtons(t,'answer').every(tag=>/\sdisabled(?:\s|>|=)/.test(tag)));await timers(t);assert.equal(t.run('thState.playing'),null);assert(!themeButtons(t,'play','A')[0].includes('disabled'))}}
  await themeClick(t,'play','A');await click(t,{'data-stop':''});assert.equal(t.run('thState.playing'),null);assert(!themeButtons(t,'play','B')[0].includes('disabled'));await themeClick(t,'play','B');await click(t,{'data-go':'home'});assert.equal(t.run('thState.playing'),null);assert.equal(t.run('route'),'home');await timers(t);assert.equal(t.run('thState.playing'),null)
 });
 await test(lang+': all generated option pairs differ in scheduled ending audio',async()=>{const t=setup(lang);await click(t,{'data-go':'theme'});await themeClick(t,'explore');for(let level=1;level<=4;level++){await themeClick(t,'level',String(level));let before=t.notes.length;await themeClick(t,'play','A');await timers(t);const A=t.notes.slice(before).map(x=>x.frequency);before=t.notes.length;await themeClick(t,'play','B');await timers(t);const B=t.notes.slice(before).map(x=>x.frequency);assert.equal(A.length,B.length);assert(A.some((n,i)=>n!==B[i]),'identical audio arrays');assert.deepEqual(A.slice(0,3+8-level),B.slice(0,3+8-level))}});
}
console.log(`${passed} passed; ${failed} failed. Delegated-click mocks only; no browser or device verification.`);if(failed)process.exitCode=1;
})();
