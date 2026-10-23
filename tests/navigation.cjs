// Independent navigation/state checks; no rendered browser or real-device claim.
const {setup,flush}=require('./audio.cjs');
const assert=require('node:assert/strict');
const KEY='musikkverkstad-location-v1';
const plain=x=>JSON.parse(JSON.stringify(x));
(async()=>{
for(const lang of ['nn','nb','en']){
 const t=setup(lang);
 // An unrelated activity redraw must not replace the native theme selector:
 // doing so closes its open picker and drops keyboard focus in a real DOM.
 const host=t.elements.themeNavigation;let html=host.innerHTML,writes=0;
 Object.defineProperty(host,'innerHTML',{get:()=>html,set:v=>{writes++;html=v},configurable:true});
 t.run('nvUpdate();nvUpdate()');assert.equal(writes,0);
 // On a real theme change, a now-disabled arrow transfers focus to the picker.
 const select=t.run("$('themeSelect')");let focused=0;select.focus=()=>focused++;
 host.contains=()=>true;host.querySelector=()=>({disabled:true});
 t.run("document.activeElement={dataset:{nv:'next'}};nvSelected=2;nvUpdate()");assert.equal(focused,1);
 t.run('document.activeElement=undefined');host.contains=()=>false;


 assert.equal(t.run('nvLast'),null);
 t.run('nvStart()');
 assert.equal(t.run('route'),'theme');assert.equal(t.run('thState.level'),1);assert.equal(t.run('thState.section'),'listen');
 assert.deepEqual(JSON.parse(t.stored[KEY]),{route:'theme',level:1,mode:'listen'});
 t.run('nvOpenTheme(1)');assert.equal(t.run('route'),'groove');
 t.run('nvTheme(1)');assert.equal(t.run('route'),'conversation');t.run('nvTheme(1)');assert.equal(t.run('route'),'conversation');t.run('nvTheme(-1)');assert.equal(t.run('route'),'groove');
 t.run('nvTheme(-1)');assert.equal(t.run('route'),'theme');
 t.run('nvTheme(-1)');assert.equal(t.run('route'),'theme');
 await t.run("thAction('level', '3');thAction('section','rebuild')");
 assert.deepEqual(JSON.parse(t.stored[KEY]),{route:'theme',level:3,mode:'rebuild'});
 const retained=t.stored[KEY];t.run("go('home');go('progress');go('about')");assert.equal(t.stored[KEY],retained);
 let reload=setup(lang,{stored:t.stored});reload.run('nvContinue()');
 assert.equal(reload.run('route'),'theme');assert.equal(reload.run('thState.level'),3);assert.equal(reload.run('thState.section'),'rebuild');
 assert.equal(reload.run('thState.success'),false);
 const cases=[['conversation',4,'create'],['conversation',2,'build'],['form',4,'create'],['form',2,'puzzle'],['form',3,'build'],['groove',4,'create'],['rhythm',2],['melody',3],['harmony',4],['puzzle',2],['notation',3],['create',1]];
 for(const [route,level,mode]of cases){
  const location={route,level,...(mode?{mode}:{})};const r=setup(lang,{stored:{[KEY]:JSON.stringify(location)}});
  r.run('nvContinue()');assert.equal(r.run('route'),route);
  const actual=r.run(route==='conversation'?'cv.level':route==='form'?'fo.level':route==='groove'?'gr.level':route==='puzzle'?'pp.level':route==='notation'?'nm.level':route==='create'?'1':`data.levels.${route}`);
  assert.equal(actual,level);assert.deepEqual(JSON.parse(r.stored[KEY]),location);
  if(mode)assert.equal(r.run(route==='conversation'?'cv.mode':route==='form'?'fo.mode':'gr.mode'),mode);
 }
 t.run("go('groove')");await t.run("grAction('level','4');grAction('mode','repair')");
 assert.deepEqual(JSON.parse(t.stored[KEY]),{route:'groove',level:4,mode:'repair'});
 t.run("go('puzzle')");await t.run("ppAction('level','3')");assert.equal(JSON.parse(t.stored[KEY]).level,3);
 t.run("go('notation')");await t.run("nmAction('level','4')");assert.equal(JSON.parse(t.stored[KEY]).level,4);
 const invalid=[null,[],{}, {route:'home',level:1},{route:'theme',level:0,mode:'listen'},{route:'theme',level:5,mode:'listen'},{route:'theme',level:'1',mode:'listen'}, {route:'theme',level:1,mode:'repair'},{route:'groove',level:2,mode:'rebuild'},{route:'rhythm',level:2,mode:'listen'}, {route:'create',level:3},{route:'notation',level:2,extra:true}];
 for(const value of invalid){const r=setup(lang,{stored:{[KEY]:JSON.stringify(value)}});assert.equal(r.run('nvLast'),null);r.run('nvContinue()');assert.equal(r.run('route'),'theme');}
 const corrupt=setup(lang,{stored:{[KEY]:'{bad json'}});assert.equal(corrupt.run('nvLast'),null);
 const fail=setup(lang);fail.run("localStorage.setItem=()=>{throw Error('denied')};nvStart();go('groove');nvRemember();go('home');nvContinue()");assert.equal(fail.run('route'),'groove');
 const play=setup(lang);play.run("go('groove')");await play.run("grAction('reference')");const stale=[...play.timers.values()].map(x=>x.fn);play.run('nvOpenTheme(0)');stale.forEach(f=>f());assert.equal(play.run('route'),'theme');assert(!play.run('gr.busy'));assert(play.notes.every(n=>n.node.stopped));
 let release;const gate=new Promise(r=>release=r);const slow=setup(lang,{fetch:async()=>{await gate;return {ok:true,arrayBuffer:async()=>({m:60})}}});slow.run("go('groove')");const pending=slow.run("grAction('reference')");await flush();slow.run('nvOpenTheme(0)');release();await pending;assert.equal(slow.notes.length,0);assert.equal(slow.run('route'),'theme');
 console.log('PASS '+lang+': Start/Continue, all routes, theme boundaries, level/mode persistence, strict invalid storage rejection, denied storage, interrupted audio');
}
})().catch(e=>{console.error(e);process.exitCode=1});
