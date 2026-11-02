// Actual built child scripts, original identities and musical data; Node checks are simulations.
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),crypto=require('node:crypto'),{execFileSync}=require('node:child_process');
execFileSync(process.env.PYTHON||'python3',['scripts/build-seven-weeks.py'],{env:{...process.env,LC_ALL:'C',PYTHONCOERCECLOCALE:'0',PYTHONUTF8:'0'}});
const html=fs.readFileSync('.quality/weeks-1-7/musikkverkstad.html','utf8'),manifest=JSON.parse(fs.readFileSync('.quality/weeks-1-7/source-manifest.json'));
assert.equal(crypto.createHash('sha256').update(html).digest('hex'),manifest.artifactSha256);assert.equal(manifest.sources.length,7);assert.equal(manifest.pupilRelease,'BLOCKED');
assert.equal(fs.readFileSync('staff-preview/musikkverkstad.html','utf8'),html,'Committed staff preview must match the tested standalone build');
const source=html.match(/<script>([^]*?)<\/script>/)[1];new vm.Script(source);const bank=JSON.parse(source.match(/const BANK=(\[[^;]+\]),titles=/)[1]);assert.equal(bank.length,7);
const scripts=bank.map((s,i)=>{const h=Buffer.from(s,'base64').toString();assert(h.includes('connect-src \'none\''));assert(!/https?:\/\//.test(h));const js=[...h.matchAll(/<script>([^]*?)<\/script>/g)].map(m=>m[1]).join('\n').replace('/* BOOT_CONFIG */','{}');new vm.Script(js,{filename:'week-'+(i+1)});return js});
for(const r of manifest.sources)assert.equal(crypto.createHash('sha256').update(fs.readFileSync(r.source)).digest('hex'),r.sha256);
assert(scripts[0].includes(fs.readFileSync('src/seven-week/pulse.js','utf8')),'The actual integrated Week1 must include the reviewed pulse scorer');
// Independent literal notation/audio expectations, not implementation predicates.
const w2=scripts[1].match(/function phraseStaff\(pitches\)\{([^]*?)\n\}/)[0];const st=vm.runInNewContext(w2+';phraseStaff([60,62,64])',{lang:'nn'});assert.deepEqual([...st.matchAll(/<ellipse[^>]+cy="(\d+)"/g)].map(m=>+m[1]),[70,65,60]);assert(st.includes('y1="70"'));
const diat=scripts[4].match(/const nextDiatonic=m=>\{[^\n]+/)[0];const events=scripts[4].match(/function w5events\(bars\)\{[^\n]+/)[0];const test=vm.runInNewContext(diat+'\n'+events+'\nJSON.stringify([64,71,79].map(p=>w5events([[{kind:"pair",pitch:p}]]).events.map(e=>e.midi)))');assert.deepEqual(JSON.parse(test),[[64,65],[71,72],[79,79]]);
const phrase=scripts[6].match(/phrase=\(meter,variant=0\)=>\{[^\n]+/)[0];for(let v=0;v<8;v++){const a=JSON.parse(vm.runInNewContext(phrase+`;JSON.stringify(phrase('6/8',${v}))`));assert.equal(a.length,24);for(let b=0;b<4;b++)assert.deepEqual(a.slice(b*6,b*6+6).flatMap((n,i)=>n===2?[i]:[]),[0,3])}
assert(scripts[4].includes('data-rhythm="${i}:${j}"'));assert(scripts[4].includes("const seq=['q','pair','rest']"));assert(scripts[6].includes("x%meter===0"));
console.log('PASS: UTF-8/LF build under ASCII locale,7 pinned originals,21-slot standalone build, all child JS syntax, corrected C/D staff and diatonic pairs, compound6/8 grouping, retained duration controls. Node simulations; human validation PENDING.');
