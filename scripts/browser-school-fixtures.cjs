// Build real configured pupil pages once for both viewport projects.
const fs=require('node:fs'),path=require('node:path');
const {execFileSync}=require('node:child_process');
const SC=require('../src/school/config.js');
module.exports=async function(){
 const root=path.resolve(__dirname,'..');
 for(const theme of ['theme','groove']){
  const settings=SC.defaults();settings.schoolName='Ås skule <img src=x onerror=alert(1)>';settings.logo='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR4nGNQaPj/HwAFAgKfdqhGyQAAAABJRU5ErkJggg==';settings.defaultLanguage='nb';settings.colourPreset='blue';settings.themes=[theme];
  for(const item of SC.registry)if(item.id!=='create')settings.levels[item.id]=[2,4];
  const input=path.join(root,'.quality',theme+'-settings.json');fs.mkdirSync(path.dirname(input),{recursive:true});fs.writeFileSync(input,JSON.stringify(settings));
  execFileSync(process.env.PYTHON||'python3',['translate.py','--school-settings',input,'--output',path.join('.quality','school-sites',theme),'--no-admin'],{cwd:root});
 }
};
