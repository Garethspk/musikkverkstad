// Independent finite music oracles and simulated DOM/audio/state regressions.
// This suite does not verify rendered UI, real decoding, audible speakers or pupils.
const assert = require('node:assert/strict');
const {setup, flush} = require('./audio.cjs');
const plain = value => JSON.parse(JSON.stringify(value));
const clone = plain;
const events = pitches => pitches.map(notes => ({notes, dur:1}));
const CALL = [60,62,64,67], POOL = [60,62,64,67,69];
const ORDERS = [[0,1],[0,2],[1,0],[1,2],[2,0],[2,1]];
const correctOptions = {ending:[1,2],home:[0,1],down:[0,1]};
const correctBuilds = {ending:[[0,1],[0,2]],home:[[0,1]],down:[[0,1],[2,1]]};
const descending = new Set([
  [69,67,64,62], [69,67,64,60], [69,67,62,60],
  [69,64,62,60], [67,64,62,60],
].map(JSON.stringify));
const finish = t => {
  const pending = [...t.timers.values()].sort((a,b) => a.ms-b.ms);
  t.timers.clear();
  for (const {fn} of pending) fn();
};
const upload = (t,value) => t.listeners['importFile:change']({target:{files:[{size:100,text:async()=>JSON.stringify(value)}],value:'file'}});
const get = (t,expression) => plain(t.run(expression));
const count = (t,key) => t.run(`data.conversationPractice.done[${JSON.stringify(key)}]||0`);
const legacy = () => ({version:1,level:1,done:{'listen-1':4,'build-1':2},creations:[{level:1,call:events([60,62,60,64]),response:events([60,64])}]});

(async () => {
for (const lang of ['nn','nb','en']) {
  const t = setup(lang); t.run("go('conversation')");
  assert.equal(t.run('cv.level'),1);
  // Compare against independently enumerated finite sets, not a second copy of cvFits.
  const all = [];
  for (const a of POOL) for (const b of POOL) for (const c of POOL) for (const d of POOL) all.push([a,b,c,d]);
  const expected = {
    ending:new Set(POOL.filter(n=>n!==67).map(n=>JSON.stringify([60,62,64,n]))),
    home:new Set(POOL.map(n=>JSON.stringify([60,62,n,60]))),
    down:descending,
    echo:new Set([JSON.stringify(CALL)]),
  };
  const result = get(t,`(${JSON.stringify(all)}).map(p=>['ending','home','down','echo'].map(b=>cvFits(cvEvents(${JSON.stringify(CALL)}),cvEvents(p),b)))`);
  for (let i=0;i<all.length;i++) ['ending','home','down','echo'].forEach((brief,j) => assert.equal(result[i][j],expected[brief].has(JSON.stringify(all[i])),`${lang}/${brief}/${all[i]}`));
  assert.deepEqual(Object.values(expected).map(s=>s.size),[4,5,5,1]);
  for (const bad of [events([60,62,64]),events([60,62,64,99]),events([60,62,64,null]),[{notes:60,dur:2},...events([62,64,60])],events([60,62,64,60]).map(e=>({...e,hidden:true}))]) {
    assert.equal(t.run(`cvFits(cvEvents(${JSON.stringify(CALL)}),${JSON.stringify(bad)},'ending')`),false);
    assert.equal(t.run(`cvFits(${JSON.stringify(bad)},cvEvents([60,62,64,60]),'home')`),false);
  }
  for (const level of [0,5,1.5,'1']) assert.throws(()=>t.run(`cvSpec(${JSON.stringify(level)})`));

  for (let level=1;level<=4;level++) {
    await t.run(`cvAction('level','${level}')`);
    const briefs = level===4 ? ['ending','home','down'] : [['ending','home','down'][level-1]];
    for (const brief of briefs) {
      if (level===4) await t.run(`cvAction('brief','${brief}')`);
      const q = get(t,'cv.item');
      assert.equal(q.brief,brief); assert.deepEqual(q.call,events(CALL));
      assert(q.options.every(p=>p.length===4&&p.every(e=>e.dur===1&&POOL.includes(e.notes))));
      assert.equal(new Set(q.options.map(JSON.stringify)).size,3,'No duplicate sounded choices');
      const valid = q.options.map((p,i)=>expected[brief].has(JSON.stringify(p.map(e=>e.notes)))?i:-1).filter(i=>i>=0);
      assert.deepEqual(valid,correctOptions[brief]);
      const validOrders = ORDERS.filter(order=>expected[brief].has(JSON.stringify(order.flatMap(i=>q.pieces[i].map(e=>e.notes)))));
      assert.deepEqual(validOrders,correctBuilds[brief]);
      assert.deepEqual(get(t,`(${JSON.stringify(ORDERS)}).filter(order=>cvFits(cv.item.call,order.flatMap(i=>cv.item.pieces[i]),cv.item.brief))`),validOrders);
      assert(t.elements.app.innerHTML.includes(t.run('cvRule()')),'Current musical brief visible before marking');
      // Every subset is checked independently, including missing a valid alternative.
      await t.run("cvAction('mode','listen')");
      assert(t.elements.app.innerHTML.includes(t.run("cvText('choose')")),'All-answer instruction visible');
      await t.run("cvAction('check')"); assert.equal(t.run('cv.feedback'),t.run("cvText('heard')"));
      for (let mask=0;mask<8;mask++) {
        const selected=[0,1,2].filter(i=>mask&(1<<i));
        t.run(`cv.selected=${JSON.stringify(selected)};cv.heard={call:true,option0:true,option1:true,option2:true}`);
        const before=count(t,`listen-${level}`);
        await t.run("cvAction('check')");
        const fits=JSON.stringify(selected)===JSON.stringify(correctOptions[brief]);
        assert.equal(t.run('cv.feedback'),t.run(`cvText('${fits?'right':'wrong'}')`));
        assert(count(t,`listen-${level}`)<=before+1);
      }
      const once=count(t,`listen-${level}`);
      t.run(`cv.selected=${JSON.stringify(correctOptions[brief])}`);
      await t.run("cvAction('check');cvAction('check')"); assert.equal(count(t,`listen-${level}`),once,'One credit per round');
      await t.run("cvAction('mode','build')");
      await t.run("cvAction('check')"); assert.equal(t.run('cv.feedback'),t.run("cvText('incomplete')"));
      for (const order of ORDERS) {
        t.run(`cv.order=${JSON.stringify(order)}`); await t.run("cvAction('check')");
        assert.equal(t.run('cv.feedback')===t.run("cvText('right')"),validOrders.some(x=>JSON.stringify(x)===JSON.stringify(order)));
      }
      // A repeated pitch is not strict descent; anchor and ending feedback remain distinct.
      if (brief==='down') assert.equal(t.run('cvMismatch(cvEvents([69,67,67,64]))'),t.run("cvText('contour')"));
      if (brief==='ending') {
        assert.equal(t.run('cvMismatch(cvEvents([60,64,62,69]))'),t.run("cvText('anchor')"));
        assert.equal(t.run('cvMismatch(cv.item.call)'),t.run("cvText('ending')"));
      }
    }
  }
  // The three languages must preserve these concrete semantic boundaries.
  const words=get(t,'cvWords');
  for (const key of ['rules','guide','choose','createHelp','echoHelp','contour','local']) assert(words[key].flat().every(s=>typeof s==='string'&&s.length>15));
  assert.match(words.rules[0][2],/first three pitches.*last pitch/);
  assert.match(words.rules[1][2],/first two pitches.*C4/);
  assert.match(words.rules[2][2],/every successive pitch lower/);
  assert.match(words.choose[0],/alle svar/); assert.match(words.choose[1],/alle svar/); assert.match(words.choose[2],/all replies/);
  assert.match(words.contour[2],/repeated pitch/);
  assert.match(words.guide[2],/90 beats per minute.*No count-in.*one silent beat/);
  assert.match(words.createHelp[2],/not marked or ranked/);
  assert.match(words.echoHelp[2],/exactly the same four pitches/);

  // Echo is whole-call exact copying, and its counts stay out of broad conversation.
  await t.run("cvAction('level','1');cvAction('mode','listen');cvAction('echo')");
  assert.equal(t.run('cv.echo'),true);
  t.run('cv.heard={call:true,option0:true,option1:true,option2:true};cv.selected=[1]');
  await t.run("cvAction('check')"); assert.equal(t.run('cv.feedback'),t.run("cvText('echoWrong')"));
  const beforeEcho=count(t,'echo-1');
  t.run('cv.selected=[0]'); await t.run("cvAction('check');cvAction('check')"); assert.equal(count(t,'echo-1'),beforeEcho+1);
  // Creation keeps an actual independent before-version, is ungraded, and saves out-of-brief work.
  await t.run("cvAction('mode','create');cvAction('snapshot')");
  const previous=get(t,'cv.previous');t.run('cv.response[0].notes=69');
  assert.deepEqual(get(t,'cv.previous'),previous);
  assert.equal(t.run('cvFits(cv.item.call,cv.response,cv.item.brief)'),false);
  const doneBefore=get(t,'data.conversationPractice.done');
  await t.run("cvAction('save');cvAction('save')");
  assert.equal(t.run('data.conversationPractice.creations.length'),1);
  assert.equal(t.run('cv.feedback'),t.run("cvText('duplicate')"));
  assert.deepEqual(get(t,'data.conversationPractice.done'),doneBefore);
  const saved=get(t,'data.conversationPractice.creations[0]'); assert.deepEqual(saved.previous,previous); assert.equal(saved.response[0].notes,69);
  t.run('cv.response[0].notes=60'); await t.run("cvAction('open','0')");
  assert.deepEqual(get(t,'cv.response'),saved.response); assert.deepEqual(get(t,'cv.previous'),saved.previous);
  await t.run("cvAction('level','4');cvAction('brief','down');cvAction('mode','create')");
  t.run('cv.response[0].notes=69'); await t.run("cvAction('snapshot')"); const draft=get(t,'cv.response');
  await t.run("cvAction('brief','home');cvAction('brief','down')"); assert.deepEqual(get(t,'cv.response'),draft);
  const reload=setup(lang,{stored:t.stored}); assert.equal(reload.run('data.conversationPractice.version'),2); assert.deepEqual(get(reload,'data.conversationPractice.creations[0]'),saved);
  assert.equal(reload.run('cv.item'),null,'Unfinished questions are not resumed');
  assert.deepEqual(get(reload,'cv.order'),[]); assert.deepEqual(get(reload,'cv.selected'),[]);

  t.run('exportData()'); const backup=JSON.parse(await t.exported[0].text());
  const stable=t.run('JSON.stringify(data)'), theme=t.run('JSON.stringify(thStore)');
  const mutate=[v=>v.conversationPractice=null,v=>v.conversationPractice.version=3,v=>v.conversationPractice.level=5,v=>v.conversationPractice.done={'listen-1':-1},v=>v.conversationPractice.done={'create-1':1},v=>v.conversationPractice.done={'listen-1':1.5},v=>v.conversationPractice.creations[0].brief='aesthetic',v=>v.conversationPractice.creations[0].brief='home',v=>v.conversationPractice.creations[0].response[0].notes=null,v=>v.conversationPractice.creations[0].response[0].dur=.5,v=>v.conversationPractice.creations[0].previous=[],v=>v.conversationPractice.creations=Array(21).fill(v.conversationPractice.creations[0]),v=>v.conversationPractice.legacyEcho={version:1},v=>v.conversationPractice.pupilName='no',v=>v.themeEnding={version:99}];
  for (const change of mutate) {const bad=clone(backup);change(bad);await upload(t,bad);assert.equal(t.run('JSON.stringify(data)'),stable,'Invalid backup must not partially replace current work');assert.equal(t.run('JSON.stringify(thStore)'),theme);}
  await upload(t,backup); assert.equal(t.run('JSON.stringify(data)'),stable);
  // Equivalent imported objects with different property order must not create duplicates.
  const reordered=clone(backup);reordered.conversationPractice.creations=reordered.conversationPractice.creations.map(c=>({...c,call:c.call.map(e=>({dur:e.dur,notes:e.notes})),response:c.response.map(e=>({dur:e.dur,notes:e.notes})),previous:c.previous?.map(e=>({dur:e.dur,notes:e.notes}))||null}));
  await upload(t,reordered);await t.run("cvAction('open','0');cvAction('save')");assert.equal(t.run('data.conversationPractice.creations.length'),1,'Property order is not a new musical work');
  // A saved non-default call survives editing and switching configurations/modes.
  const custom=clone(backup);custom.conversationPractice.creations[0].call=events([62,64,67,69]);
  await upload(t,custom);await t.run("cvAction('open','0');cvAction('mode','listen');cvAction('mode','create')");assert.deepEqual(get(t,'cv.item.call'),events([62,64,67,69]));
  await t.run("cvAction('level','2');cvAction('level','1')");assert.deepEqual(get(t,'cv.item.call'),events([62,64,67,69]));
  await upload(t,backup);
  const older=clone(backup);delete older.conversationPractice;
  await upload(t,older);assert.equal(t.run('JSON.stringify(data.conversationPractice)'),JSON.stringify(backup.conversationPractice),'Missing older-backup field must preserve current newer Theme 03 work');
  const moved=t.run(`cvValid(${JSON.stringify(legacy())})`);assert.equal(moved.version,2);assert.deepEqual(plain(moved.done),{});assert.deepEqual(plain(moved.creations),[]);assert.deepEqual(plain(moved.legacyEcho),legacy());
  const incoming=clone(backup);incoming.conversationPractice=legacy();await upload(t,incoming);
  assert.deepEqual(get(t,'data.conversationPractice.legacyEcho'),legacy());assert.deepEqual(get(t,'data.conversationPractice.done'),{});
  const legacyReload=setup(lang,{stored:t.stored});assert.deepEqual(get(legacyReload,'data.conversationPractice.legacyEcho'),legacy());
  legacyReload.run("go('conversation')");await legacyReload.run("cvAction('legacy','0')");
  assert(Math.abs(legacyReload.notes[1].time-legacyReload.notes[0].time-60/108)<1e-8,'Legacy archive keeps 108 BPM');
  legacyReload.run('stopAudio()');
  for (const bad of [null,[],{}, {...legacy(),done:{'echo-1':1}}, {...legacy(),creations:[{...legacy().creations[0],response:events([60,64,67])}]}]) assert.throws(()=>t.run(`cvLegacyValid(${JSON.stringify(bad)})`));
  const unreadable='{broken';const damaged=setup(lang,{stored:{'musikkverkstad-v1':unreadable}});damaged.run("go('conversation')");await damaged.run("cvAction('mode','create');cvAction('save')");assert.equal(damaged.stored['musikkverkstad-v1'],unreadable);assert.equal(damaged.run('storageOK'),false);assert.equal(damaged.run('data.conversationPractice.creations.length'),1);
  const quota=setup(lang);quota.run("localStorage.setItem=()=>{throw Error('quota')};go('conversation')");await quota.run("cvAction('mode','create');cvAction('save')");assert.equal(quota.run('storageOK'),false);assert.equal(quota.run('data.conversationPractice.creations.length'),1);assert(quota.elements.app.innerHTML.includes(quota.run("cvText('storage')")));
  // School restrictions preserve saved work and prevent reopening a disabled level/theme.
  const restricted=setup(lang,{stored:{'musikkverkstad-v1':JSON.stringify(backup)}});restricted.run("schoolSettings.levels.conversation=[2];go('conversation')");
  await restricted.run("cvAction('open','0')");assert.equal(restricted.run('cv.level'),2);assert.equal(restricted.run('data.conversationPractice.creations.length'),1);
  restricted.run("schoolSettings.themes=['groove'];go('home')");const hidden=restricted.run('JSON.stringify(data.conversationPractice)');await restricted.run("cvAction('open','0')");assert.equal(restricted.run('route'),'home');assert.equal(restricted.run('JSON.stringify(data.conversationPractice)'),hidden);

  // Observable sampled scheduling oracle: no musical intro; pair gap is one unassessed beat.
  const audio=setup(lang);audio.run("go('conversation')");
  await audio.run("cvAction('call')");
  assert.equal(audio.notes.length,4);audio.notes.forEach((n,i)=>{assert.equal(n.sampled,true);assert(Math.abs(n.frequency-440*2**((CALL[i]-69)/12))<1e-7);assert(Math.abs(n.time-(10.1+i*2/3))<1e-8);assert(Math.abs(n.node.stopCalls[0]-(n.time+2/3*.86+.04))<1e-8)});
  assert.equal(audio.run('cv.heard.call||false'),false);finish(audio);assert.equal(audio.run('cv.heard.call'),true);
  await audio.run("cvAction('mode','create');cvAction('pair')");
  const pair=audio.notes.slice(4);assert.equal(pair.length,8);assert(Math.abs(pair[4].time-pair[0].time-5*2/3)<1e-8);
  const stale=[...audio.timers.values()].map(x=>x.fn);audio.run("go('home')");stale.forEach(fn=>fn());assert.equal(audio.run('cv.busy'),false);assert.equal(audio.run('cv.status'),'');assert(audio.notes.every(n=>n.node.stopped));
  const stop=setup(lang);stop.run("go('conversation')");await stop.run("cvAction('call')");await stop.run("cvAction('stop')");assert.equal(stop.run('cv.busy'),false);assert(stop.notes.every(n=>n.node.stopped));assert.equal(stop.timers.size,0);
  let release;const gate=new Promise(resolve=>release=resolve);const slow=setup(lang,{fetch:async()=>{await gate;return {ok:true,arrayBuffer:async()=>({m:60})}}});slow.run("go('conversation')");const pending=slow.run("cvAction('call')");await flush();assert.equal(slow.run('cv.busy'),true);slow.run("go('home')");release();await pending;assert.equal(slow.notes.length,0);assert.equal(slow.run('cv.busy'),false);assert.equal(slow.run('cv.heard.call||false'),false);
  const failure=setup(lang,{fetch:async()=>({ok:false})});failure.run("go('conversation')");await failure.run("cvAction('call')");assert.equal(failure.notes.length,0);assert.equal(failure.run('cv.status'),failure.run("cvText('error')"));assert.equal(failure.run('cv.heard.call||false'),false);
  console.log(`PASS ${lang}: 625-string independent musical oracles, all subset/permutation answers, ungraded revision, migration/atomic backup/storage/school restrictions and simulated audio cancellation`);
}
console.log('Node simulation only: no real-browser, decoded-signal, speaker, teacher or pupil evidence.');
})().catch(error=>{console.error(error);process.exitCode=1});
