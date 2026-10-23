const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),os=require('node:os');
const {spawnSync}=require('node:child_process');
const vm=require('node:vm');
const SC=require('../src/school/config.js');
const base=SC.defaults();
assert.deepEqual(SC.parse(JSON.stringify(base)),base);
assert.deepEqual(SC.registry.filter(r=>r.theme).map(r=>r.id),['theme','groove','conversation']);
const olderSettings=require('./fixtures/school-v1-restricted.json');
const migrated=SC.parse(JSON.stringify(olderSettings));assert.equal(migrated.schemaVersion,4);assert.equal(migrated.formEnabled,false);assert.deepEqual(migrated.themes,olderSettings.themes);for(const id of Object.keys(olderSettings.levels))assert.deepEqual(migrated.levels[id],olderSettings.levels[id]);assert.deepEqual(migrated.levels.form,[1,2,3,4]);assert.equal(base.formEnabled,true);assert.throws(()=>SC.validate({...olderSettings,formEnabled:true}),'Old input must not inject new fields');

// Independently specified historical registries; no migration infers opt-in.
const oldIDs=['theme','groove','rhythm','melody','harmony','puzzle','notation','create'];
const logo='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR4nGNQaPj/HwAFAgKfdqhGyQAAAABJRU5ErkJggg==';
for(const version of [1,2,3])for(const enabled of [false,true]){
 const ids=[...oldIDs,...(version===2?['conversation']:version===3?['form']:[])];
 const input={schemaVersion:version,schoolName:'Ås test',logo,defaultLanguage:'en',colourPreset:'gold',ageGroups:['11-13'],themes:version===2&&enabled?['groove','conversation']:['groove'],levels:Object.fromEntries(ids.map(id=>[id,id==='create'?[1]:[2,4]])),...(version===3?{formEnabled:enabled}:{})};
 const before=JSON.stringify(input),out=SC.validate(input);
 assert.equal(JSON.stringify(input),before,'Migration must never mutate old settings');assert.equal(out.schemaVersion,4);
 for(const key of ['schoolName','logo','defaultLanguage','colourPreset','ageGroups','themes'])assert.deepEqual(out[key],input[key]);
 for(const id of ids)assert.deepEqual(out.levels[id],input.levels[id]);
 assert.equal(out.formEnabled,version===3&&enabled);assert.equal(out.themes.includes('conversation'),version===2&&enabled);
 if(version!==2)assert.deepEqual(out.levels.conversation,[1,2,3,4]);if(version!==3)assert.deepEqual(out.levels.form,[1,2,3,4]);
 for(const mutate of [v=>v.levels[ids[0]]=[],v=>v.levels.unknown=[1],v=>v.themes=['unavailable'],v=>v.logo='https://example.invalid/logo.png',v=>v.schemaVersion=99,v=>v.unrecognised=true]){const bad=structuredClone(input);mutate(bad);const raw=JSON.stringify(bad);assert.throws(()=>SC.validate(bad));assert.equal(JSON.stringify(bad),raw);}
 if(version!==2){const bad=structuredClone(input);bad.themes=['conversation'];assert.throws(()=>SC.validate(bad));}
 if(version!==3)assert.throws(()=>SC.validate({...input,formEnabled:true}));
 const missing=structuredClone(input);delete missing.levels[ids.at(-1)];assert.throws(()=>SC.validate(missing));
}
assert.throws(()=>SC.validate({...olderSettings,schemaVersion:2}),'v1 shape must not masquerade as v2');
assert.throws(()=>SC.validate({...olderSettings,schemaVersion:3,formEnabled:true}),'v1 shape must not masquerade as v3');

assert.equal(SC.hasRestrictions(olderSettings),true);
assert.equal(SC.hasRestrictions(base),false);
assert.deepEqual(base.themes,SC.availableRegistry.filter(r=>r.theme).map(r=>r.id));
for(const item of SC.availableRegistry){assert.deepEqual(base.levels[item.id],item.levels);assert.equal(item.pupilRelease,'BLOCKED');}
for(const item of [{implemented:false,prototypeEligible:true},{implemented:true,prototypeEligible:false},{implemented:true},{implemented:true,prototypeEligible:true,pupilRelease:'FAIL'},{implemented:true,prototypeEligible:true},{}])assert.equal(SC.prototypeAvailable(item),false,'Future/ineligible entries fail closed');
assert.ok(SC.availableRegistry.every(SC.prototypeAvailable));
const edited=SC.parse(JSON.stringify({...olderSettings,schoolName:'Ny profil'}));
assert.deepEqual(edited.themes,olderSettings.themes);assert.deepEqual(edited.levels,migrated.levels);
const revokedSource=fs.readFileSync('src/school/config.js','utf8').replace("id:'rhythm', implemented:true, prototypeEligible:true", "id:'rhythm', implemented:true, prototypeEligible:false");
const sandbox={};vm.createContext(sandbox);vm.runInContext(revokedSource,sandbox);
vm.runInContext('const schoolSettings=SchoolConfig.defaults();'+fs.readFileSync('src/school/pupil.js','utf8'),sandbox);
assert.equal(vm.runInContext("scRouteAllowed('rhythm')",sandbox),false,'Revoked auxiliary routes must be blocked');
assert.equal(vm.runInContext("scLevels('rhythm').length",sandbox),0,'Revoked activities must not regain fallback level 1');
assert.equal(vm.runInContext("scRouteAllowed('puzzle')",sandbox),true);
const clone=()=>structuredClone(base);
const invalid=[s=>s.schemaVersion=2,s=>s.schemaVersion=0,s=>s.formEnabled=1,s=>s.formEnabled=undefined,s=>s.levels.form=[],s=>s.schoolName='<x>\u0000',s=>s.schoolName='x'.repeat(101),
 s=>s.ageGroups=[],s=>s.ageGroups=['6-10'],s=>s.themes=[],s=>s.themes=['unavailable'],s=>s.themes=['theme','theme'],
 s=>s.levels.theme=[],s=>s.levels.groove=[5],s=>s.levels.create=[2],s=>s.levels.puzzle=[true],
 s=>s.defaultLanguage='de',s=>s.colourPreset='custom-css',s=>s.logo='https://example.test/logo.png',
 s=>s.logo='data:image/svg+xml;base64,PHN2Zy8+',s=>s.logo='data:image/png;base64,YmFk',
 s=>s.pupilData={},s=>s.levels.conversation=[5]];
for(const change of invalid){const value=clone();change(value);assert.throws(()=>SC.validate(value));}
assert.throws(()=>SC.parse('{'));
assert.throws(()=>SC.parse(' '.repeat(SC.MAX_JSON+1)));
const original=clone();const result=SC.validate({...original,schoolName:'  Ås skule  '});result.levels.theme.pop();
assert.equal(original.levels.theme.length,4,'Validator must not mutate input or retain array aliases');
assert.equal(result.schoolName,'Ås skule');
for(const mime of ['image/png','image/jpeg','image/webp','image/svg+xml'])assert.throws(()=>SC.checkImage(new Uint8Array(50),mime));
assert.throws(()=>SC.checkImage(new Uint8Array(SC.MAX_FILE+1),'image/png'));
const forged=new Uint8Array(45);forged.set([137,80,78,71,13,10,26,10]);const view=new DataView(forged.buffer);view.setUint32(8,13);forged.set([73,72,68,82],12);view.setUint32(16,999999);view.setUint32(20,10);
assert.throws(()=>SC.checkImage(forged,'image/png'),/biletdimensjonar/);
const validLogo='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR4nGNQaPj/HwAFAgKfdqhGyQAAAABJRU5ErkJggg==';
assert.equal(SC.validate({...clone(),logo:validLogo}).logo,validLogo);
view.setUint32(16,1);view.setUint32(20,1);forged.set([73,69,78,68],37);
const invalidLogo='data:image/png;base64,'+Buffer.from(forged).toString('base64');
assert.throws(()=>SC.validate({...clone(),logo:invalidLogo}),'Forged PNG header must not pass structural validation');
function luminance(hex){return hex.slice(1).match(/../g).map(n=>parseInt(n,16)/255).map(n=>n<=.04045?n/12.92:((n+.055)/1.055)**2.4).reduce((s,n,i)=>s+n*[.2126,.7152,.0722][i],0);}
for(const preset of Object.values(SC.presets)){
 const accent=luminance(preset.accent), ink=luminance(preset.ink);
 assert.ok((accent+.05)/(ink+.05)>=4.5,'Preset button contrast');
 for(const bg of ['#101820','#1a2631','#243440'])assert.ok((accent+.05)/(luminance(bg)+.05)>=4.5,'Preset accent on dark background');
}
const temp=fs.mkdtempSync(path.join(os.tmpdir(),'school-invalid-'));
try{
 const file=path.join(temp,'bad.json'),output=path.join(temp,'pupil');fs.writeFileSync(file,JSON.stringify({...clone(),themes:['unavailable']}));
 const run=spawnSync(process.env.PYTHON||'python3',['translate.py','--school-settings',file,'--output',output,'--no-admin'],{encoding:'utf8'});
 assert.notEqual(run.status,0);assert.match(run.stderr,/temaval/);assert.equal(fs.existsSync(output),false,'Invalid config must not create a pupil output');
 const broken=Buffer.from(validLogo.slice(22),'base64');broken[broken.length-1]^=1;
 fs.writeFileSync(file,JSON.stringify({...clone(),logo:'data:image/png;base64,'+broken.toString('base64')}));
 const badLogo=spawnSync(process.env.PYTHON||'python3',['translate.py','--school-settings',file,'--output',output,'--no-admin'],{encoding:'utf8'});
 assert.notEqual(badLogo.status,0);assert.equal(fs.existsSync(output),false);
}finally{fs.rmSync(temp,{recursive:true,force:true});}
assert.equal(fs.existsSync('dist/admin.html'),false);
assert.equal(fs.existsSync('dist/setup'),false);
for(const locale of ['nn','nb','en'])assert.ok(!fs.readFileSync(`dist/${locale}.html`,'utf8').includes('settingsForm'),'Pupil pages must not embed administrator UI');
console.log('PASS: school schema, unavailable content, logo bounds, preset contrast, atomic build rejection and editor separation (Node, no browser claim)');
