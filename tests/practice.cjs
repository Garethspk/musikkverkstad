const {setup}=require('./audio.cjs');const assert=require('node:assert/strict');
(async()=>{
for(const lang of ['nn','nb','en']){
 const t=setup(lang);t.run("go('puzzle')");
 await t.run("ppAction('check')");assert.equal(t.run('pp.checks'),0);
 t.run('pp.answer=pp.target.slice()');await t.run("ppAction('check');ppAction('check')");
 assert.equal(t.run('data.extraPractice.puzzle.done'),1);assert.equal(t.run('data.extraPractice.puzzle.first'),1);
 t.run("go('home');go('puzzle');pp.answer[0]=(pp.target[0]+1)%pp.pieces.length");await t.run("ppAction('check')");t.run('pp.answer=pp.target.slice()');await t.run("ppAction('check')");assert.equal(t.run('data.extraPractice.puzzle.done'),1);
 await t.run("ppAction('new')");t.run('pp.answer=pp.target.slice();pp.answer[0]=(pp.target[0]+1)%pp.pieces.length');await t.run("ppAction('check')");t.run('pp.answer=pp.target.slice()');await t.run("ppAction('check')");assert.equal(t.run('data.extraPractice.puzzle.done'),2);assert.equal(t.run('data.extraPractice.puzzle.first'),1);
 t.run("go('notation')");await t.run("nmAction('check')");assert.equal(t.run('nm.checks'),0);await t.run("nmAction('support');nmAction('support')");assert(!t.run('nm.support'));assert(t.run('nm.supportUsed'));
 await t.run("nmAction('answer',String(nm.correct));nmAction('check');nmAction('check')");
 assert.equal(t.run('data.extraPractice.notation.done'),1);assert.equal(t.run('data.extraPractice.notation.first'),0);assert.equal(t.run('data.extraPractice.notation.supported'),1);
 await t.run("nmAction('new');nmAction('answer',String(nm.correct));nmAction('check')");
 assert.equal(t.run('data.extraPractice.notation.first'),1);
 await t.run("nmAction('level','4');ppAction('level','3')");const reloaded=setup(lang,{stored:t.stored});
 assert.equal(reloaded.run('nm.level'),4);assert.equal(reloaded.run('pp.level'),3);assert.equal(reloaded.run('data.extraPractice.notation.done'),2);
 t.run('exportData()');const backup=JSON.parse(await t.exported[0].text());assert.equal(backup.extraPractice.puzzle.done,2);
 const upload=async d=>t.listeners['importFile:change']({target:{files:[{size:100,text:async()=>JSON.stringify(d)}],value:'file'}});
 await upload(backup);assert.equal(t.run('data.extraPractice.puzzle.done'),2);assert.equal(t.run('pp.recorded'),false);
 for(const change of [v=>v.extraPractice=null,v=>v.extraPractice.puzzle.done=-1,v=>v.extraPractice.notation.first=999,v=>v.extraPractice.puzzle.level=5,v=>v.extraPractice.notation.supported=1.5]){
 const bad=JSON.parse(JSON.stringify(backup));change(bad);const before=t.run('JSON.stringify(data)');await upload(bad);assert.equal(t.run('JSON.stringify(data)'),before);
 }
 const legacy=JSON.parse(JSON.stringify(backup));delete legacy.extraPractice;
 t.run("var prompts=[];confirm=message=>{prompts.push(message);return false}");await upload(legacy);assert(t.run('prompts[0]').includes(t.run("extraText('legacy')")));assert.equal(t.run('data.extraPractice.puzzle.done'),2);
 t.run("confirm=()=>true");await upload(legacy);assert.equal(t.run('data.extraPractice.puzzle.done'),0);
 t.run("go('puzzle');localStorage.setItem=()=>{throw Error('quota')};pp.answer=pp.target.slice()");await t.run("ppAction('check')");assert.equal(t.run('storageOK'),false);assert(t.run('ppView()').includes(t.run("extraText('error')")));assert.equal(t.run('data.extraPractice.puzzle.done'),1);
 await t.run("ppAction('check')");assert.equal(t.run('data.extraPractice.puzzle.done'),1);
 console.log('PASS '+lang+': one credit per round, sticky support, first checks, reload, export/import, malformed and legacy data, storage failure');
}
})().catch(e=>{console.error(e);process.exitCode=1});
