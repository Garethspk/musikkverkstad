const assert=require('node:assert/strict');
const {setup}=require('./audio.cjs');
(async()=>{for(const lang of ['nn','nb','en']){
 const t=setup(lang),upload=async value=>t.listeners['importFile:change']({target:{files:[{size:100,text:async()=>JSON.stringify(value)}],value:'file'}});
 t.run("go('theme')");await t.run("thAction('level','4');thAction('quick')");assert.equal(t.run('thState.level'),4);
 t.run("data.stats.rhythm={done:9,correct:4};go('groove')");
 await t.run("grAction('mode','repair')");t.run('gr.answer=gr.target.slice()');await t.run("grAction('check');grAction('check')");
 assert.equal(t.run('data.groovePractice.done["repair-1"]'),1);
 t.run("go('home');go('groove')");await t.run("grAction('check')");assert.equal(t.run('data.groovePractice.done["repair-1"]'),1);
 await t.run("grAction('new')");t.run('gr.answer=gr.target.slice()');await t.run("grAction('check')");assert.equal(t.run('data.groovePractice.done["repair-1"]'),2);
 await t.run("grAction('mode','listen')");t.run('gr.heard={reference:true,option0:true,option1:true}');await t.run("grAction('choose',String(gr.options.findIndex(p=>p.every((x,i)=>x===gr.target[i]))))");assert.equal(t.run('data.groovePractice.done["listen-1"]'),1);
 await t.run("grAction('level','4');grAction('mode','create');grAction('save');grAction('save')");assert.equal(t.run('data.groovePractice.creations.length'),1);
 const reloaded=setup(lang,{stored:t.stored});assert.equal(reloaded.run('gr.level'),4);assert.equal(reloaded.run('data.stats.rhythm.done'),9);assert.equal(reloaded.run('data.groovePractice.done["repair-1"]'),2);assert.equal(reloaded.run('gr.recorded'),false);assert.equal(reloaded.run('gr.target.length'),0);
 t.run('exportData()');const backup=JSON.parse(await t.exported[0].text());assert.equal(backup.groovePractice.version,1);const before=t.run('JSON.stringify(data)'),theme=t.run('JSON.stringify(thStore)');
 for(const change of [v=>v.groovePractice=null,v=>v.groovePractice.version=2,v=>v.groovePractice.level=5,v=>v.groovePractice.done={'repair-1':-1},v=>v.groovePractice.done={'create-1':1},v=>v.groovePractice.done={'listen-1':1.5},v=>v.groovePractice.creations[0].pattern[0]=2,v=>v.groovePractice.creations[0].pattern=[],v=>v.groovePractice.creations[0].pattern.fill(0),v=>v.groovePractice.creations=Array(21).fill(v.groovePractice.creations[0]),v=>v.groovePractice.pupilName='No',v=>v.themeEnding={version:99}]){
  const bad=JSON.parse(JSON.stringify(backup));change(bad);await upload(bad);assert.equal(t.run('JSON.stringify(data)'),before);assert.equal(t.run('JSON.stringify(thStore)'),theme);
 }
 await upload(backup);assert.equal(t.run('JSON.stringify(data)'),before);
 const legacy=JSON.parse(JSON.stringify(backup));delete legacy.groovePractice;await upload(legacy);assert.deepEqual(JSON.parse(t.run('JSON.stringify(data)')),JSON.parse(before),'legacy backup must keep groove history');
 const oldStorage=JSON.parse(JSON.stringify(legacy));delete oldStorage.themeEnding;const migrated=setup(lang,{stored:{'musikkverkstad-v1':JSON.stringify(oldStorage)}});assert.equal(migrated.run('data.stats.rhythm.done'),9);assert.equal(migrated.run('data.groovePractice.version'),1);assert.equal(migrated.run('data.groovePractice.creations.length'),0);
 const corrupt='{broken';const damaged=setup(lang,{stored:{'musikkverkstad-v1':corrupt}});damaged.run("go('groove')");await damaged.run("grAction('mode','create');grAction('save')");assert.equal(damaged.stored['musikkverkstad-v1'],corrupt);assert(!damaged.run('storageOK'));assert.equal(damaged.run('data.groovePractice.creations.length'),1);
 const quota=setup(lang);quota.run("localStorage.setItem=()=>{throw Error('quota')};go('groove')");await quota.run("grAction('mode','create');grAction('save')");assert(!quota.run('storageOK'));assert.equal(quota.run('data.groovePractice.creations.length'),1);assert(quota.elements.app.innerHTML.includes(quota.run("grText('storage')")));quota.run('exportData()');assert.equal(JSON.parse(await quota.exported[0].text()).groovePractice.creations.length,1);
 console.log('PASS '+lang+': Theme 02 one-credit rounds, collections, migration, reload, atomic backups and protected corrupt/quota storage');
}})().catch(e=>{console.error(e);process.exitCode=1});
