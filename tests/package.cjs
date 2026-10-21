const assert=require('node:assert/strict'),fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const {spawnSync}=require('node:child_process');
const SC=require('../src/school/config.js'),PK=require('../src/school/package.js');
(async()=>{
 const raw=fs.readFileSync('setup/template.json','utf8'),pin=fs.readFileSync('setup/index.html','utf8').match(/id="school-template"[^>]+data-sha256="([a-f0-9]+)"/)[1];
 const template=await PK.openTemplate(raw,pin);
 await assert.rejects(()=>PK.openTemplate(raw+' ',pin),/endra|skadd/);
 for(const change of [b=>b.files.pop(),b=>b.files.push(b.files[0]),b=>b.files[0].path='../admin.html',b=>b.files[0].path='/index.html',b=>b.files[0].path='setup/index.html',b=>b.files[0].size++,b=>b.pupilRelease='PASS',b=>b.settingsSchemaVersion=99]){
  const bad=JSON.parse(raw);change(bad);const text=JSON.stringify(bad),awaitedHash=await PK.hash(new TextEncoder().encode(text));await assert.rejects(()=>PK.openTemplate(text,awaitedHash));
 }
 for(const value of ['../x','/x','x\\y','https://x','x//y','x/./y','x/%2e%2e/y','x\0y'])assert.equal(PK.pathOK(value),false);
 const settings=structuredClone(require('./fixtures/school-v1-restricted.json'));
 settings.schoolName='Ås </script><script>alert(1)</script> skule';
 settings.logo='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR4nGNQaPj/HwAFAgKfdqhGyQAAAABJRU5ErkJggg==';
 const candidate=await PK.prepare(template,settings),manifest=await PK.verify(candidate);
 assert.equal(manifest.pupilRelease,'BLOCKED');assert.equal(manifest.purpose,'private-prototype-review');
 assert.deepEqual(Object.keys(candidate.files).sort(),[...PK.policy.templatePaths,...PK.policy.extraPaths].sort());
 assert.equal(new TextDecoder().decode(candidate.files['nn.html']).includes('Ås </script>'),false);
 const archive=await PK.zip(candidate);assert.deepEqual(archive,await PK.zip(await PK.prepare(template,settings)),'ZIP must be reproducible');
 const temp=fs.mkdtempSync(path.join(os.tmpdir(),'school-package-'));
 try{
  const zipPath=path.join(temp,'school.zip'),output=path.join(temp,'extracted'),configPath=path.join(temp,'school.json'),cli=path.join(temp,'cli');
  fs.writeFileSync(zipPath,archive);fs.writeFileSync(configPath,JSON.stringify(settings));
  const extracted=spawnSync(process.env.PYTHON||'python3',['-c',`import zipfile,sys,pathlib\nz=zipfile.ZipFile(sys.argv[1]);assert z.testzip() is None\nassert all(not n.startswith('/') and '..' not in pathlib.PurePosixPath(n).parts for n in z.namelist())\nz.extractall(sys.argv[2])`,zipPath,output],{encoding:'utf8'});
  assert.equal(extracted.status,0,extracted.stderr);
  for(const [name,bytes] of Object.entries(candidate.files))assert.deepEqual(fs.readFileSync(path.join(output,name)),Buffer.from(bytes));
  const built=spawnSync(process.env.PYTHON||'python3',['translate.py','--school-settings',configPath,'--output',cli,'--no-admin'],{encoding:'utf8'});assert.equal(built.status,0,built.stderr);
  for(const locale of ['index','nn','nb','en'])assert.deepEqual(fs.readFileSync(path.join(cli,locale+'.html')),Buffer.from(candidate.files[locale+'.html']),'Browser and maintenance builder must emit identical pupil pages');
 }finally{fs.rmSync(temp,{recursive:true,force:true});}
 const changed=await PK.prepare(template,SC.defaults());changed.files['nn.html'][10]^=1;await assert.rejects(()=>PK.zip(changed),/endra/);
 const added=await PK.prepare(template,SC.defaults());added.files['admin.html']=new Uint8Array([1]);await assert.rejects(()=>PK.zip(added),/filer/);
 template.files['nn.html'][0]^=1;await assert.rejects(()=>PK.prepare(template,SC.defaults()),/endra/);
 console.log('PASS: pinned template, allowlist, identities, deterministic ZIP/CRC extraction, unsafe settings and identical CLI/browser pupil files');
})().catch(error=>{console.error(error);process.exitCode=1;});
