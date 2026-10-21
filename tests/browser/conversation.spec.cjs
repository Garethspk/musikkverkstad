const fs=require('node:fs');
const {test,expect,observeAudio}=require('./fixtures.cjs');
const SC=require('../../src/school/config.js');
async function open(page,locale='en'){await page.goto('/'+locale+'.html');await page.selectOption('#themeSelect','2');await expect(page.locator('[data-cv-action="mode"]')).toHaveCount(3);}
async function play(page,action,value=''){
 await page.locator(`[data-cv-action="${action}"][data-cv-value="${value}"]`).click();await expect.poll(()=>page.evaluate(()=>cv.busy),{timeout:12000}).toBe(false);
}
for(const locale of ['nn','nb','en'])test(`Theme 03 ${locale}: listen, build, keyboard creation, real audio and saved backup`,async({page})=>{
 await observeAudio(page);await open(page,locale);for(const c of await page.locator('[data-cv-action="mode"]').all())await expect(c).toBeVisible();
 await page.locator('[data-cv-action="choose"]').first().click();expect(await page.evaluate(()=>cv.feedback)).toBe(await page.evaluate(()=>cvText('heard')));
 for(const [action,value]of [['call',''],['option','0'],['option','1']])await play(page,action,value);
 expect(await page.evaluate(()=>({state:ctx.state,samples:buffers.length,starts:__audioEvents.filter(e=>e.kind==='start'&&e.frames>1000).length}))).toMatchObject({state:'running',samples:5});
 const correct=await page.evaluate(()=>cv.item.options.findIndex(p=>cvSignature(p)===cvSignature(cv.item.target)));await page.locator(`[data-cv-action="choose"][data-cv-value="${1-correct}"]`).click();expect(await page.evaluate(()=>data.conversationPractice.done['listen-1']||0)).toBe(0);
 await page.locator(`[data-cv-action="choose"][data-cv-value="${correct}"]`).click();await page.locator(`[data-cv-action="choose"][data-cv-value="${correct}"]`).click();expect(await page.evaluate(()=>data.conversationPractice.done['listen-1'])).toBe(1);
 await page.locator('[data-cv-action="mode"][data-cv-value="build"]').click();await page.locator('[data-cv-action="check"]').click();
 const order=await page.evaluate(()=>cv.item.pieces.map((p,i)=>({i,start:cv.item.target.findIndex(e=>cvSignature([e])===cvSignature([p[0]]))})).sort((a,b)=>a.start-b.start).map(p=>p.i));
 // L1 has two distinct one-note fragments, with a unique accepted order.
 for(const i of order)await page.locator(`[data-cv-action="add"][data-cv-value="${i}"]`).click();await page.locator('[data-cv-action="check"]').click();expect(await page.evaluate(()=>data.conversationPractice.done['build-1'])).toBe(1);
 await page.locator('[data-cv-action="mode"][data-cv-value="create"]').focus();await page.keyboard.press('Enter');await page.locator('[data-cv-action="level"][data-cv-value="4"]').click();
 await page.locator('[data-cv-note="0"]').selectOption('69');await page.locator('[data-cv-note="3"]').selectOption('rest');await page.locator('[data-cv-action="pair"]').click();await expect.poll(()=>page.evaluate(()=>sources.length)).toBeGreaterThan(0);await page.locator('[data-cv-action="stop"]').click();await expect.poll(()=>page.evaluate(()=>sources.length)).toBe(0);
 const starts=await page.evaluate(()=>__audioEvents.filter(e=>e.kind==='start').length);await page.waitForTimeout(200);expect(await page.evaluate(()=>__audioEvents.filter(e=>e.kind==='start').length)).toBe(starts);
 await page.locator('[data-cv-action="save"]').click();const saved=await page.evaluate(()=>JSON.parse(JSON.stringify(data.conversationPractice)));expect(saved.creations).toHaveLength(1);await page.reload();expect(await page.evaluate(()=>data.conversationPractice)).toEqual(saved);
 await page.locator('.toolbar-menu summary').click();await page.locator('[data-go="progress"]').click();await page.locator('[data-cv-action="open"]').click();await page.locator('[data-cv-action="hint"]').click();expect(await page.evaluate(()=>cv.item.target)).toEqual(saved.creations[0].call.slice(-6));expect(await page.evaluate(()=>cv.response)).toEqual(saved.creations[0].response);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.locator('.toolbar-menu summary').click();await page.locator('[data-go="progress"]').click();const next=page.waitForEvent('download');await page.locator('[data-export]').click();const file=await next,backup=JSON.parse(fs.readFileSync(await file.path(),'utf8'));
 page.on('dialog',d=>d.accept());await page.locator('#importFile').setInputFiles({name:'backup.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(backup))});await expect(page.locator('#importFeedback')).toHaveClass('feedback good');expect(await page.evaluate(()=>data.conversationPractice)).toEqual(saved);
});

test('Theme 03 failed/delayed sample loading and navigation cancel without stale playback',async({page})=>{
 await observeAudio(page);await page.route('**/sounds/*.mp3',r=>r.fulfill({status:503,body:'Injected network failure'}));await open(page);await play(page,'call');expect(await page.evaluate(()=>cv.heard.call||false)).toBe(false);expect(await page.evaluate(()=>cv.status)).toBe(await page.evaluate(()=>cvText('error')));expect(await page.evaluate(()=>__audioEvents.length)).toBe(0);await page.unroute('**/sounds/*.mp3');
 let release;const barrier=new Promise(r=>release=r);let count=0;
 await page.route('**/sounds/*.mp3',async r=>{const response=await r.fetch();count++;await barrier;await r.fulfill({response});});
 try{await page.locator('[data-cv-action="call"]').click();await expect.poll(()=>count).toBe(5);await page.locator('.brand').click();release();await expect.poll(()=>page.evaluate(()=>buffers?.length)).toBe(5);await page.waitForTimeout(200);expect(await page.evaluate(()=>__audioEvents.length)).toBe(0);expect(await page.evaluate(()=>cv.busy)).toBe(false);}finally{release();}
});

test('Theme 03 legacy settings reject silent enablement; restrictions retain disabled history',async({page})=>{
 const old=require('../fixtures/school-v1-restricted.json');await page.goto('http://127.0.0.1:8766/');await expect(page.locator('#schoolName')).toBeEnabled();await page.locator('#settingsFile').setInputFiles({name:'old.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(old))});await expect(page.locator('#message')).toContainText('importerte');await expect(page.locator('#theme-conversation')).not.toBeChecked();await expect(page.locator('#theme-groove')).toBeChecked();
 await page.goto('http://127.0.0.1:8767/school-sites/conversation/en.html');await page.locator('[data-nv="start"]').click();await expect(page.locator('[data-cv-action="level"]')).toHaveCount(2);await page.locator('[data-cv-action="mode"][data-cv-value="create"]').click();await page.locator('[data-cv-action="save"]').click();const history=await page.evaluate(()=>JSON.parse(JSON.stringify(data.conversationPractice)));
 await page.goto('http://127.0.0.1:8767/school-sites/groove/en.html');expect(await page.evaluate(()=>data.conversationPractice)).toEqual(history);await page.evaluate(()=>go('progress'));await expect(page.locator('[data-cv-action="open"]')).toBeDisabled();await page.evaluate(()=>cvAction('open','0'));expect(await page.evaluate(()=>route)).toBe('progress');await page.evaluate(()=>go('conversation'));expect(await page.evaluate(()=>route)).toBe('groove');
});

for(const fault of ['corrupt','denied'])test(`Theme 03 ${fault} storage and invalid imports preserve history safely`,async({page})=>{
 await page.addInitScript(mode=>{if(mode==='corrupt')localStorage.setItem('musikkverkstad-v1','{broken');else Storage.prototype.setItem=function(){throw new DOMException('Injected quota','QuotaExceededError')};},fault);
 await open(page);await page.locator('[data-cv-action="mode"][data-cv-value="create"]').click();await page.locator('[data-cv-action="save"]').click();expect(await page.evaluate(()=>data.conversationPractice.creations.length)).toBe(1);expect(await page.evaluate(()=>storageOK)).toBe(false);if(fault==='corrupt')expect(await page.evaluate(()=>localStorage.getItem('musikkverkstad-v1'))).toBe('{broken');
 const before=await page.evaluate(()=>JSON.stringify(data));const bad=await page.evaluate(()=>({...data,conversationPractice:{version:99}}));await page.locator('.toolbar-menu summary').click();await page.locator('[data-go="progress"]').click();await page.locator('#importFile').setInputFiles({name:'bad.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(bad))});await expect(page.locator('#importFeedback')).toHaveClass('feedback warn');expect(await page.evaluate(()=>JSON.stringify(data))).toBe(before);
 const next=page.waitForEvent('download');await page.locator('[data-export]').click();const file=await next;expect(JSON.parse(fs.readFileSync(await file.path(),'utf8')).conversationPractice.creations).toHaveLength(1);
});
