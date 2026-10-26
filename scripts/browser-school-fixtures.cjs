// Build real configured pupil pages once for both viewport projects.
const fs=require('node:fs'),path=require('node:path');
const {execFileSync}=require('node:child_process');
const SC=require('../src/school/config.js');
module.exports=async function(){
 const root=path.resolve(__dirname,'..');
 const staff=require('./build-staff-review.cjs');
 await staff.build(path.join(root,'.quality/staff-review/full'));
 const restricted=SC.defaults();restricted.themes=['groove'];restricted.formEnabled=false;restricted.programmeEnabled=false;restricted.levels.groove=[2];
 await staff.build(path.join(root,'.quality/staff-review/restricted'),restricted);
 for(const theme of ['theme','groove','conversation','form','form-level3','programme','programme-disabled','combined','combined-none','combined-no-conversation','combined-no-form','combined-no-programme','updated']){
  const settings=SC.defaults();settings.schoolName='Ås skule <img src=x onerror=alert(1)>';settings.logo='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR4nGNQaPj/HwAFAgKfdqhGyQAAAABJRU5ErkJggg==';settings.defaultLanguage='nb';settings.colourPreset='blue';settings.themes=['combined','combined-no-form','combined-no-programme'].includes(theme)?['theme','groove','conversation']:['theme','groove','conversation'].includes(theme)?[theme]:['groove'];settings.formEnabled=theme.startsWith('form')||['combined','combined-no-conversation','combined-no-programme'].includes(theme);settings.programmeEnabled=theme==='programme'||['combined','combined-no-conversation','combined-no-form'].includes(theme);
  if(theme==='updated'){settings.schoolName='Oppdatert skule';settings.defaultLanguage='nn';settings.colourPreset='gold';}
  for(const item of SC.registry)if(item.id!=='create')settings.levels[item.id]=[2,4];
  if(theme==='updated')settings.levels.groove=[2];
  if(theme==='form-level3')settings.levels.form=[3];
  const input=path.join(root,'.quality',theme+'-settings.json');fs.mkdirSync(path.dirname(input),{recursive:true});fs.writeFileSync(input,JSON.stringify(settings));
  execFileSync(process.env.PYTHON||'python3',['translate.py','--school-settings',input,'--output',path.join('.quality','school-sites',theme),'--no-admin'],{cwd:root});
 }
 // Isolated revocation fixture: actual compiled pupil files, never mutate source.
 const isolated=path.join(root,'.quality','revoked-source');
 fs.rmSync(isolated,{recursive:true,force:true});fs.mkdirSync(isolated,{recursive:true});
 for(const file of ['translate.py','translations-extra.txt'])fs.copyFileSync(path.join(root,file),path.join(isolated,file));
 fs.mkdirSync(path.join(isolated,'scripts'),{recursive:true});
 fs.copyFileSync(path.join(root,'scripts/validate-school.cjs'),path.join(isolated,'scripts/validate-school.cjs'));
 fs.cpSync(path.join(root,'src'),path.join(isolated,'src'),{recursive:true});
 const contract=path.join(isolated,'src/school/config.js');
 fs.writeFileSync(contract,fs.readFileSync(contract,'utf8').replace("id:'rhythm', implemented:true, prototypeEligible:true", "id:'rhythm', implemented:true, prototypeEligible:false"));
 execFileSync(process.env.PYTHON||'python3',['translate.py','--output',path.join(root,'.quality/school-sites/revoked'),'--no-admin'],{cwd:isolated});

};
