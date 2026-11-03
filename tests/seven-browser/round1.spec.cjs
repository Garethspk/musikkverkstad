const {test,expect}=require('@playwright/test');
const faults=new WeakMap();
test.beforeEach(async({page},info)=>{
  if(info.project.use.hasTouch)await page.setViewportSize({width:390,height:844});
  const errors=[];faults.set(page,errors);page.on('pageerror',e=>errors.push(e.message));
  await page.goto('/musikkverkstad.html');await expect(page.locator('iframe[data-ready="true"]')).toBeVisible();
});
test.afterEach(async({page})=>expect(faults.get(page)).toEqual([]));
const run=(f,fn,arg)=>f.locator('body').evaluate(fn,arg);
async function open(page,week,task=0,locale='nn'){
  await page.selectOption('#week',String(week));await expect(page.locator(`iframe[data-week="${week}"][data-ready="true"]`)).toBeVisible();
  await page.selectOption('#language',locale);const f=page.frameLocator('iframe');await expect(f.locator('html')).toHaveAttribute('lang',locale);
  // Isolate a task's controls; prerequisite flags are fixture setup, not pupil evidence.
  if(task)await run(f,(_,t)=>{for(let i=0;i<t;i++)progressValues()[i]=true;task=t;refreshWeek()},task);
  return f;
}
async function play(f,selector){await f.locator(selector).click();await expect.poll(()=>run(f,()=>X.busy),{timeout:10000}).toBe(false)}
for(const locale of ['nn','nb','en']){
  test(`Round1 W3 matching ${locale}: complete/repeated playback in different orders and three correct answers`,async({page})=>{
    const f=await open(page,3,0,locale);
    for(let r=0;r<3;r++){
      const target=[64,67,69][r];await expect(f.locator('#activity .chip')).toContainText(`${r+1}/3`);
      await expect(f.locator('#progress')).toContainText(`${r}/3`);
      await f.locator(`[data-answer]:not([data-answer="${target}"])`).click();expect(await run(f,()=>rounds[0])).toBe(r);
      const a=f.locator('[data-sound]').nth(0),b=f.locator('[data-sound]').nth(1);
      for(const item of (r===0?['#target',a,b]:r===1?[b,'#target',a]:[a,b,'#target','#target'])){
        await (typeof item==='string'?f.locator(item):item).click();await expect.poll(()=>run(f,()=>X.busy)).toBe(false);
      }
      // Deliberately missing metadata must never reject a valid content answer.
      await run(f,()=>X.heard.clear());await f.locator(`[data-answer="${target}"]`).click();
      expect(await run(f,()=>rounds[0])).toBe(r+1);
    }
    await expect(f.locator('#next')).toBeEnabled();await expect(f.locator('[data-answer]:enabled')).toHaveCount(0);
    await run(f,()=>nextCorrect(3));expect(await run(f,()=>rounds[0])).toBe(3);
    await f.locator('#next').click();await expect(f.locator('#hearNote')).toBeVisible();
  });
  test(`Round1 W3 notation ${locale}: optional sound before answers, visible staff, five questions`,async({page})=>{
    const f=await open(page,3,1,locale);
    const notes=[67,60,72,64,69],names=['G','C','C','E','A'];
    for(let r=0;r<5;r++){
      expect(await run(f,()=>{
        const staff=document.querySelector('.noteQuestion'),sound=document.getElementById('hearNote'),answers=document.querySelector('.answers');
        return !!(staff.compareDocumentPosition(sound)&Node.DOCUMENT_POSITION_FOLLOWING)&&!!(sound.compareDocumentPosition(answers)&Node.DOCUMENT_POSITION_FOLLOWING);
      })).toBe(true);
      await play(f,'#hearNote');await expect(f.locator('.noteQuestion svg')).toBeVisible();
      expect(await run(f,()=>X.events[0].midi)).toBe(notes[r]);if(r===0)await play(f,'#hearNote');
      if(r===4){for(let i=0;i<2;i++)await f.locator(`[data-answer]:not([data-answer="${names[r]}"])`).first().click();await expect(f.locator('#retryRef')).toBeVisible()}
      await f.locator(`[data-answer="${names[r]}"]`).click();expect(await run(f,()=>rounds[1])).toBe(r+1);
    }
    await expect(f.locator('#progress')).toContainText('5/5');await expect(f.locator('#next')).toBeEnabled();
    await expect(f.locator('#hearNote')).toBeEnabled();await expect(f.locator('#retryRef')).toHaveCount(0);
    await play(f,'#hearNote');expect(await run(f,()=>X.events[0].midi)).toBe(69);
    await expect(f.locator('.noteQuestion ellipse')).toHaveAttribute('cy','75');
  });
  test(`Round1 W3 placement ${locale}: correct reference-key answers need no receipt, four rounds`,async({page})=>{
    const f=await open(page,3,2,locale);
    for(const [r,pitch]of [69,65,72,62].entries()){
      await play(f,`[data-ref="${pitch}"]`);await run(f,()=>X.heard.clear());
      const distance=await run(f,(_,p)=>P.indexOf(p)-P.indexOf(placement),pitch);
      for(let i=0;i<Math.abs(distance);i++)await f.locator(distance>0?'#pitchUp':'#pitchDown').click();
      await f.locator('#verify').click();expect(await run(f,()=>rounds[2])).toBe(r+1);
    }
    await expect(f.locator('#verify')).toBeDisabled();await expect(f.locator('#next')).toBeEnabled();
    await expect(f.locator('#next')).toHaveText(locale==='en'?'Go to next week →':locale==='nb'?'Gå til neste uke →':'Gå til neste veke →');
    await f.locator('#next').click();await expect(page.locator('iframe[data-week="4"][data-ready="true"]')).toBeVisible();
    await expect(page.frameLocator('iframe').locator('html')).toHaveAttribute('lang',locale);
    await expect(page.locator('#week option[value="3"]')).toContainText('✓');
  });
  test(`Round1 barlines ${locale}: direct boundaries, specific feedback, two stages and replay`,async({page},info)=>{
    const f=await open(page,7,1,locale),tap=async n=>{const b=f.locator(`[data-pos="${n}"]`);if(info.project.use.hasTouch)await b.tap();else await b.click()};
    await expect(f.locator('.meter-strip')).toBeVisible();
    expect(await run(f,()=>document.body.scrollWidth<=innerWidth+1)).toBe(true);await expect(f.locator('[data-pos]')).toHaveCount(11);
    await expect(f.locator('.beatgrid,.barlinegrid')).toHaveCount(0);
    await f.locator('#check').click();await expect(f.locator('#status')).toContainText('3, 6, 9');
    for(const n of [2,3,6,9])await tap(n);await f.locator('#check').click();
    await expect(f.locator('#status')).toContainText(locale==='en'?'too many':locale==='nb'?'for mange':'for mange');
    await tap(3);await f.locator('#check').click();await expect(f.locator('#status')).toContainText('2');await expect(f.locator('#status')).toContainText('3');
    await tap(2);await tap(3);await play(f,'#hear');
    expect(await run(f,()=>X.events.filter(e=>e.accent).map(e=>Math.round(e.at/.36)))).toEqual([0,3,6,9]);
    await f.locator('#check').click();await expect(f.locator('#nextMeter')).toBeVisible();await expect(f.locator('#progress')).toHaveText('1/2');
    await expect(f.locator('#hear')).toBeEnabled();await f.locator('#nextMeter').click();
    await expect(f.locator('#intro')).toContainText('4/4');for(const n of [4,8])await tap(n);
    await play(f,'#hear');expect(await run(f,()=>X.events.filter(e=>e.accent).map(e=>Math.round(e.at/.36)))).toEqual([0,4,8]);
    await f.locator('#check').click();await expect(f.locator('#progress')).toHaveText('2/2');
    await expect(f.locator('#next')).toBeEnabled();await expect(f.locator('#hear')).toBeEnabled();
  });
}
test('Round1 naturally ended target followed by another audition cannot block the correct answer',async({page})=>{
  const f=await open(page,3);await run(f,()=>{
    window.referenceEnded=false;const voice=X.voice;
    X.voice=function(...args){voice.apply(this,args);X.voice=voice;const node=[...X.nodes].at(-1);
      node.addEventListener('ended',()=>{referenceEnded=true;window.receiptAtEnd=X.heard.has('pitch-0-0');document.querySelector('[data-sound]').click()},{once:true})};
  });
  await f.locator('#target').click();await expect.poll(()=>run(f,()=>referenceEnded)).toBe(true);
  await expect.poll(()=>run(f,()=>X.busy)).toBe(false);
  await test.info().attach('native-ended-receipt',{body:JSON.stringify(await run(f,()=>({ended:referenceEnded,receiptAtEnd}))),contentType:'application/json'});
  await f.locator('[data-answer="64"]').click();expect(await run(f,()=>rounds[0])).toBe(1);
});
for(let week=1;week<=6;week++)test(`Round1 Week${week} completion navigation fixture: real sound cancellation and retained flags`,async({page})=>{
  const f=await open(page,week,2);await run(f,()=>{progressValues().fill(true);refreshWeek()});
  const messages=[];page.on('console',m=>{if(m.text()==='round1-stop:0')messages.push(m.text())});
  await run(f,()=>{const stop=X.stop;X.stop=function(){stop.call(this);console.log('round1-stop:'+this.nodes.size)};
    const b=document.createElement('button');b.id='testSound';b.textContent='Test audio';b.onclick=()=>X.play([{midi:60,at:0,dur:3}],3);document.body.append(b)});
  await f.locator('#testSound').click();await expect.poll(()=>run(f,()=>X.nodes.size)).toBeGreaterThan(0);
  await f.locator('#next').click();await expect(page.locator(`iframe[data-week="${week+1}"][data-ready="true"]`)).toBeVisible();
  expect(messages.length).toBeGreaterThan(0);await expect(page.locator(`#week option[value="${week}"]`)).toContainText('✓');
  await page.selectOption('#week',String(week));await expect(page.locator(`iframe[data-week="${week}"][data-ready="true"]`)).toBeVisible();
  expect(await run(page.frameLocator('iframe'),()=>progressValues())).toEqual([true,true,true]);
});
test('Round1 Week7 completion is truthful when earlier weeks are unfinished',async({page})=>{
  const f=await open(page,7,2);await run(f,()=>{progressValues().fill(true);refreshWeek()});
  await f.locator('#next').click();await expect(page.locator('#status')).toContainText('3/21');
  await expect(page.locator('#status')).not.toContainText('Programmet er fullført');await expect(page.locator('#week')).toHaveValue('7');
});
test('Round1 all21 completion fixture shows programme completion in all languages',async({page})=>{
  for(let week=1;week<=7;week++){const f=await open(page,week);await run(f,()=>{progressValues().fill(true);refreshWeek()});await expect(page.locator('#status')).toContainText(`${week*3}/21`)}
  for(const [locale,label]of [['nn','Programmet er fullført'],['nb','Programmet er fullført'],['en','Programme complete']]){
    await page.selectOption('#language',locale);await expect(page.locator('#status')).toContainText(label);
  }
});
test('Round1 actual Week2 memory third success advances to Week3',async({page})=>{
  const f=await open(page,2,2);
  for(let r=0;r<3;r++){
    await play(f,'#listen');const notes=await run(f,()=>expectedMelody());
    for(const n of notes)await f.locator(`[data-pitch="${n}"]`).click();
    await f.locator('#checkNotes').click();expect(await run(f,()=>streak)).toBe(r+1);
  }
  await expect(f.locator('[data-pitch]:enabled')).toHaveCount(0);await expect(f.locator('#checkNotes')).toBeDisabled();
  await expect(f.locator('#next')).toHaveText('Gå til neste veke →');await f.locator('#next').click();
  await expect(page.locator('iframe[data-week="3"][data-ready="true"]')).toBeVisible();
});
test('Round1 completed rhythm replays without advancing the final stage again',async({page})=>{
  const f=await open(page,1,2);await run(f,()=>{progressValues().fill(true);buildRound=3;bars=[[3],[3],[3],[3]];renderBuild()});
  await play(f,'#playbars');expect(await run(f,()=>X.events.length)).toBe(4);
  expect(await run(f,()=>buildRound)).toBe(3);await expect(f.locator('#next')).toBeEnabled();
});
test('Round1 completed return and reconstruction assessments cannot exceed three',async({page})=>{
  const f=await open(page,5);await run(f,()=>{complete[0]=true;round=3;draw1()});
  await expect(f.locator('[data-pick]:enabled')).toHaveCount(0);
  await run(f,()=>document.querySelector('[data-pick]').onclick());expect(await run(f,()=>round)).toBe(3);
  await run(f,()=>{task=1;complete[1]=true;reorderRound=3;render()});
  await expect(f.locator('#checkOrder')).toBeDisabled();
  await run(f,()=>document.getElementById('checkOrder').onclick());expect(await run(f,()=>reorderRound)).toBe(3);
  await expect(f.locator('#listenRef')).toBeEnabled();
});

test('Round1 completed Week2 assessments stay disabled on revisits and language changes',async({page})=>{
  const f=await open(page,2);await run(f,()=>{completed[0]=true;refresh()});
  await expect(f.locator('#answerA')).toBeDisabled();await expect(f.locator('#answerB')).toBeDisabled();
  await page.selectOption('#language','en');await expect(f.locator('#answerA')).toBeDisabled();
  await run(f,()=>{completed[1]=true;task=1;refresh()});await expect(f.locator('#checkOrder')).toBeDisabled();
  await page.selectOption('#language','nb');await expect(f.locator('#checkOrder')).toBeDisabled();
  await expect(f.locator('#original')).toBeEnabled();
});

test('Round1 successful barline stages keep their correct metre available for replay',async({page})=>{
  const f=await open(page,7,1);
  for(const n of [3,6,9])await f.locator(`[data-pos="${n}"]`).click();await f.locator('#check').click();
  await play(f,'#hear');expect(await run(f,()=>X.events.filter(e=>e.accent).map(e=>Math.round(e.at/.36)))).toEqual([0,3,6,9]);
  await f.locator('#nextMeter').click();for(const n of [4,8])await f.locator(`[data-pos="${n}"]`).click();await f.locator('#check').click();
  await play(f,'#hear');expect(await run(f,()=>X.events.filter(e=>e.accent).map(e=>Math.round(e.at/.36)))).toEqual([0,4,8]);
  await expect(f.locator('#next')).toBeEnabled();await expect(f.locator('#progress')).toHaveText('2/2');
});
for(const [week,task]of [[2,0],[2,2],[5,0],[6,1],[7,0]]){
  test(`Round1 optional listening metadata ${week}.${task+1}: original correct content still advances`,async({page})=>{
    const f=await open(page,week,task);
    // Fault injection only: do not fabricate a completed-listening receipt.
    await run(f,()=>{X.heard.clear();X.need=()=>{throw Error('Answer validation called the forbidden receipt gate')}});
    if(week===2&&task===0){
      const correct=await run(f,()=>compareData().matchA);await f.locator(correct?'#answerA':'#answerB').click();expect(await run(f,()=>compareRound)).toBe(1);
    }else if(week===2){
      for(const n of await run(f,()=>expectedMelody()))await f.locator(`[data-pitch="${n}"]`).click();
      await f.locator('#checkNotes').click();expect(await run(f,()=>streak)).toBe(1);
    }else if(week===5){
      const correct=await run(f,()=>formSong.findIndex((bar,i)=>i>0&&bar.join()===formSong[0].join()));
      await f.locator(`[data-pick="${correct}"]`).click();expect(await run(f,()=>round)).toBe(1);
    }else if(week===6){
      const correct=await run(f,()=>missingIndex);await f.locator(`[data-answer="${correct}"]`).click();expect(await run(f,()=>round)).toBe(1);
    }else{
      const correct=await run(f,()=>question.meter);await f.locator(`[data-meter="${correct}"]`).click();expect(await run(f,()=>count)).toBe(1);
    }
  });
}
test('Round1 direct barline handles support keyboard activation and preserve horizontal position',async({page},info)=>{
  const f=await open(page,7,1),third=f.locator('[data-pos="3"]');
  await third.focus();await page.keyboard.press('Space');await expect(third).toHaveAttribute('aria-pressed','true');
  await page.keyboard.press('Enter');await expect(third).toHaveAttribute('aria-pressed','false');
  const ninth=f.locator('[data-pos="9"]');await ninth.focus();
  if(info.project.use.hasTouch)await expect.poll(()=>f.locator('.meter-strip').evaluate(e=>e.scrollLeft)).toBeGreaterThan(0);
  const before=await f.locator('.meter-strip').evaluate(e=>e.scrollLeft);
  if(info.project.use.hasTouch)expect(before).toBeGreaterThan(0);
  await page.keyboard.press('Space');await expect(ninth).toHaveAttribute('aria-pressed','true');
  const after=await f.locator('.meter-strip').evaluate(e=>e.scrollLeft);expect(Math.abs(after-before)).toBeLessThanOrEqual(1);
  expect((await ninth.boundingBox()).width).toBeGreaterThanOrEqual(44);
});

test('Round1 completed metre answers stay disabled on language rerender while replay remains available',async({page})=>{
  const f=await open(page,7);await run(f,()=>{complete[0]=true;count=4;draw()});
  await expect(f.locator('[data-meter]:enabled')).toHaveCount(0);await expect(f.locator('#hear')).toBeEnabled();
  await page.selectOption('#language','en');await expect(f.locator('[data-meter]:enabled')).toHaveCount(0);
  await expect(f.locator('#hear')).toBeEnabled();
});
