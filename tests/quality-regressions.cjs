const {setup}=require('./audio.cjs');
const assert=require('node:assert/strict');
(async()=>{
for(const lang of ['nn','nb','en']){
 const t=setup(lang);t.run("route='theme';thState.screen='quick';thNew()");
 assert(t.run('themeView()').includes(t.run("thText('audioGuide')")));
 await t.run("thAction('play','reference')");
 assert.equal(t.run('thState.playMessage'),t.run("thText('phaseIntro')"));
 const phase=[...t.timers.values()].find(x=>x.ms===1350);assert(phase);phase.fn();
 assert.equal(t.run('thState.playMessage'),t.run("thText('phasePause')"));
 [...t.timers.values()].find(x=>x.ms===1975).fn();
 assert(t.run('thState.playMessage').includes(t.run("thText('reference')")));
 assert.equal(t.run('thState.playSlot'),0);
 t.run('stopAudio()');phase.fn();assert.equal(t.run('thState.playMessage'),'');
 await t.run("thAction('excerpt','reference')");assert.equal(t.run('thState.playMessage'),t.run("thText('phaseEnding').replace('{name}',thText('reference'))"));t.run('stopAudio()');
 for(const level of [3,4]){
 t.run('thState.level='+level+';thNew()');
 // Independent known fixture: changed position 7 (zero-based 6), higher pitch.
 t.run("thState.question={target:[60,62,64,67,60,62,64,60],A:[60,62,64,67,60,62,64,60],B:[60,62,64,67,60,62,67,60],odd:'B',index:6,direction:'higher'}");
 await t.run("thAction('answer','B')");assert(!t.run('thState.success'));assert.equal(t.run('thState.feedback'),t.run("thText('wrong')"));
 await t.run("thAction('answer','A')");assert(t.run('thState.matched'));assert(!t.run('thState.success'));
 assert(t.run('themeView()').includes('data-theme-action="location"'));
 await t.run("thAction('location','7')");assert(!t.run('thState.located'));
 await t.run("thAction('location','6')");
 if(level===4){assert(!t.run('thState.success'));await t.run("thAction('direction','lower')");assert(!t.run('thState.success'));await t.run("thAction('direction','higher')")}
 assert(t.run('thState.success'));assert(t.run('thStore.done["listen-'+level+'"]'));
 }
 // Generator's metadata independently agrees with actual changed pitches.
 for(let i=0;i<100;i++){
 t.run('thNew()');const q=JSON.parse(t.run('JSON.stringify(thState.question)'));const diff=q.target.map((n,i)=>n!==q[q.odd][i]?i:-1).filter(i=>i>=0);
 assert.deepEqual(diff,[q.index]);assert.equal(q.direction,q[q.odd][q.index]>q.target[q.index]?'higher':'lower');
 }
 await t.run("thAction('section','create');thState.guess[7]=69;thAction('save')");assert(t.run('thState.savedFinish'));assert(t.run('themeView()').includes(t.run("thText('finish')")));
 await t.run("thAction('note','62')");assert(!t.run('thState.savedFinish'));
 // Focus identity restoration is unit tested; actual DOM/AT behavior remains blocked.
 t.run("var focused=false;var old={dataset:{themeAction:'hint',themeValue:''}};var replacement={disabled:false,dataset:{themeAction:'hint',themeValue:''},focus(){focused=true}};document.activeElement=old;document.getElementById('app').contains=()=>true;document.getElementById('app').querySelectorAll=()=>[replacement];thDraw()");
 assert(t.run('focused'));
 console.log('PASS '+lang+': intro phases, interruption, advanced listening, generated metadata, saved finish and focus identity');
}
})().catch(e=>{console.error(e);process.exitCode=1});
