const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const {spawnSync}=require('node:child_process');
function assess(checks){
 const code=checks.length>0&&checks.every(c=>c.status==='PASS')?'PASS':'FAIL';
 return {codeChecks:code,pupilRelease:code==='FAIL'?'FAIL':'BLOCKED',
 requiredEvidence:{browser:'BLOCKED',renderedAudio:'BLOCKED',realDevices:'BLOCKED',independentReview:'BLOCKED'},
 reason:'No integrated evidence adapters for browser, rendered audio, real devices and version-specific independent review. Code checks alone cannot approve a pupil release.'};
}
module.exports={assess};
if(require.main===module){
 const root=path.resolve(__dirname,'..');process.chdir(root);
 const checks=[];
 const commands=[['build','python',['translate.py']],...['audio','piano','theme','full-audit','studio','puzzle','notation','practice','groove','navigation','quality-regressions','quality-gate'].map(n=>[n,'node',['tests/'+n+'.cjs']])];
 for(const [name,cmd,args]of commands){
 const result=spawnSync(cmd,args,{encoding:'utf8',timeout:60000});
 const status=result.status===0&&!result.error?'PASS':'FAIL';
 checks.push({name,status,exitCode:result.status,output:(result.stdout||'')+(result.stderr||''),error:result.error?.message||null});
 console.log(name+': '+status);
 if(status==='FAIL')break;
 }
 const hash=crypto.createHash('sha256');
 function scan(dir){for(const item of fs.readdirSync(dir,{withFileTypes:true}).sort((a,b)=>a.name.localeCompare(b.name))){const f=path.join(dir,item.name);if(item.isDirectory())scan(f);else {hash.update(f);hash.update(fs.readFileSync(f))}}}
 for(const dir of ['src','dist','tests','scripts'])scan(dir);
 for(const f of ['translate.py','translations-extra.txt','.openai/hosting.json','README.md','AGENTS.md']){hash.update(f);hash.update(fs.readFileSync(f))}
 const report={createdAt:new Date().toISOString(),baseCommit:spawnSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).stdout.trim(),contentHash:hash.digest('hex'),...assess(checks),checks};
 fs.mkdirSync('.quality',{recursive:true});fs.writeFileSync('.quality/latest.json',JSON.stringify(report,null,2)+'\n');
 console.log('Code checks: '+report.codeChecks+'; pupil release: '+report.pupilRelease);
 console.log('Report: .quality/latest.json');
 // --prototype permits a private prototype workflow, never changes pupilRelease.
 process.exitCode=report.codeChecks==='FAIL'?1:process.argv.includes('--prototype')?0:2;
}
