const {test,expect}=require('@playwright/test');
const faults=new WeakMap();
test.beforeEach(async({page})=>{
  const errors=[];faults.set(page,errors);page.on('pageerror',e=>errors.push(e.message));
  await page.goto('/musikkverkstad.html');
  await expect(page.locator('iframe[data-week="1"][data-ready="true"]')).toBeVisible();
});
test.afterEach(async({page})=>expect(faults.get(page)).toEqual([]));
const run=(f,fn,arg)=>f.locator('body').evaluate(fn,arg);
const regular=Array.from({length:8},(_,i)=>2200+i*550);
const irregular=[2250,2410,3150,3290,4300,4480,5550,5750];
async function attempt(page,times,{pointer=false}={}){
  const f=page.frameLocator('iframe');await f.locator('#startpulse').click();
  await expect(f.locator('#tap')).toBeEnabled();await f.locator('#tap').focus();
  for(const time of times){
    const delay=await run(f,(_,time)=>time-pulseElapsed(performance.now()),time);
    if(delay>0)await page.waitForTimeout(delay);
    if(pointer){
      if(test.info().project.use.hasTouch)await f.locator('#tap').tap();else await f.locator('#tap').click();
    }else await page.keyboard.press('Space');
  }
  await expect.poll(()=>run(f,()=>pulseAssessment),{timeout:5000}).not.toBeNull();
  return f;
}
for(const [name,times,pointer] of [
  ['steady',regular,false],
  ['220ms delayed steady',regular.map(t=>t+220),true],
  ['delayed with ordinary variation',regular.map((t,i)=>t+180+[-40,35,-25,40,-45,30,-10,20][i]),false],
])test(`pulse ${name}: native input, complete three repetitions, visible Next unlock`,async({page})=>{
  const f=await attempt(page,times,{pointer});
  expect(await run(f,()=>pulseTimes.length)).toBe(8);
  expect(await run(f,()=>pulseAssessment.ok)).toBe(true);
  await expect(f.locator('#progress')).toHaveText('✓');
  await expect(f.locator('#status')).toContainText('Neste oppgåve er no open');
  await expect(f.locator('#next')).toBeEnabled();
  await expect(f.locator('#steps button').nth(1)).toBeEnabled();
  await f.locator('#next').click();await expect(f.locator('#taskTitle')).toHaveText('Finn noteverdien');
});
for(const [locale,feedback] of [['nn','varierte'],['nb','varierte'],['en','varied']]){
  test(`pulse eight irregular taps ${locale}: actionable feedback, no counting-only completion`,async({page})=>{
    await page.selectOption('#language',locale);
    await expect(page.frameLocator('iframe').locator('html')).toHaveAttribute('lang',locale);
    const f=await attempt(page,irregular);
    expect(await run(f,()=>pulseTimes.length)).toBe(8);
    expect(await run(f,()=>pulseAssessment.ok)).toBe(false);
    await expect(f.locator('#status')).toContainText(feedback);
    await expect(f.locator('#next')).toBeDisabled();
    await expect(f.locator('#steps button').nth(1)).toBeDisabled();
  });
}
test('pulse failed then successful attempt resets taps/feedback and unlocks once',async({page})=>{
  const f=await attempt(page,irregular);await expect(f.locator('#next')).toBeDisabled();
  await attempt(page,regular.map(t=>t+220));
  expect(await run(f,()=>pulseTimes.length)).toBe(8);
  expect(await run(f,()=>pulseAssessment.ok)).toBe(true);
  await expect(f.locator('#next')).toBeEnabled();
  expect(await run(f,()=>completed)).toEqual([true,false,false]);
});
test('pulse practice after success preserves earned unlock on an uneven attempt',async({page})=>{
  const f=await attempt(page,regular.map(t=>t+220));await expect(f.locator('#next')).toBeEnabled();
  await attempt(page,irregular);expect(await run(f,()=>pulseAssessment.ok)).toBe(false);
  await expect(f.locator('#next')).toBeEnabled();
  expect(await run(f,()=>completed)).toEqual([true,false,false]);
});
test('pulse native schedule/output clock align; suspension cancels without grading',async({page})=>{
  const f=page.frameLocator('iframe');
  await run(f,()=>{window.pulseStarts=[];const start=OscillatorNode.prototype.start;
    OscillatorNode.prototype.start=function(at,...args){pulseStarts.push(at);return start.call(this,at,...args)}});
  await f.locator('#startpulse').click();await expect(f.locator('#tap')).toBeEnabled();
  const actual=await run(f,()=>{
    const now=performance.now(),t=audio.getOutputTimestamp();
    return {start:pulseAudioStart,starts:pulseStarts.slice(),clock:pulseClockSource,
      mappingError:pulseElapsed(now)-(t.contextTime+(now-t.performanceTime)/1000-pulseAudioStart)*1000};
  });
  expect(actual.starts).toHaveLength(18);
  expect(actual.starts[0]).toBe(actual.start);
  for(let beat=0;beat<12;beat++)expect(actual.starts.some(t=>Math.abs(t-actual.start-beat*.55)<1e-8)).toBe(true);
  expect(actual.clock).toBe('output-timestamp');expect(Math.abs(actual.mappingError)).toBeLessThan(20);
  await run(f,()=>audio.suspend());await expect(f.locator('#startpulse')).toBeEnabled();
  expect(await run(f,()=>pulseAssessment)).toBeNull();expect(await run(f,()=>completed[0])).toBe(false);
  await expect(f.locator('#status')).toContainText('avbroten');
});
test('pulse actual playback with missing output-timestamp API uses latency fallback',async({page})=>{
  const f=page.frameLocator('iframe');await run(f,()=>{AudioContext.prototype.getOutputTimestamp=undefined});
  await attempt(page,regular.map(t=>t+220));
  expect(await run(f,()=>pulseClockSource)).toBe('latency-estimate');
  expect(await run(f,()=>pulseAssessment.ok)).toBe(true);await expect(f.locator('#next')).toBeEnabled();
});
test('pulse held Space cannot generate a pulse; changing week cancels the attempt',async({page})=>{
  const f=page.frameLocator('iframe');await f.locator('#startpulse').click();
  await expect(f.locator('#tap')).toBeEnabled();await f.locator('#tap').focus();
  await page.keyboard.down('Space');for(let i=0;i<8;i++)await page.keyboard.down('Space');await page.keyboard.up('Space');
  expect(await run(f,()=>pulseTimes.length)).toBe(1);
  await page.selectOption('#week','2');await expect(page.locator('iframe[data-week="2"][data-ready="true"]')).toBeVisible();
  await page.selectOption('#week','1');await expect(page.locator('iframe[data-week="1"][data-ready="true"]')).toBeVisible();
  expect(await run(page.frameLocator('iframe'),()=>completed[0])).toBe(false);
  await expect(page.frameLocator('iframe').locator('#next')).toBeDisabled();
});
