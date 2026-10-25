/* Built-in Week4 musical data; no network, audio or pupil identifiers. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.W4Core=api;})(typeof globalThis==='object'?globalThis:this,function(){
 'use strict';
 const clone=v=>JSON.parse(JSON.stringify(v));
 const freeze=v=>{if(v&&typeof v==='object'){Object.values(v).forEach(freeze);Object.freeze(v)}return v};
 const exact=(v,keys)=>!!v&&typeof v==='object'&&!Array.isArray(v)&&Object.keys(v).length===keys.length&&keys.every(k=>Object.hasOwn(v,k));
 const material=freeze({A:[60,62,64,67],Av:[60,62,64,69],B:[67,64,62,60],Bv:[67,64,62,62],X:[62,64,67,69],Y:[69,67,64,62]});
 const slots=freeze([{id:'w4-paths',type:'return-investigation',mechanic:'return-trace'},{id:'w4-story',type:'dynamics-storyboard',mechanic:'expression-revision'},{id:'w4-tiles',type:'rhythm-tiles',mechanic:'duration-construction'}].map(v=>({...v,revision:1,state:'implemented-prototype',humanValidation:'PENDING',pupilRelease:'BLOCKED'})));
 const paths=freeze([
  [['A','B','A'],['A','B','B','A']], [['B','A','B'],['B','A','A','B']],
  [['A','B','A'],['A','B','A','B']], [['A','B','B','A'],['A','A','B','A']],
  [['A','B','A','B'],['A','B','B','A','B']], [['A','Av','A'],['A','B','Av','A']],
  [['B','Bv','B'],['B','A','Bv','B']], [['A','B','A'],['A','B','A','Av','B','A']]
 ].map(([before,map],i)=>({id:'path-'+(i+1),revision:1,before,map})));
 const same=(a,b)=>Object.hasOwn(material,a)&&Object.hasOwn(material,b)&&JSON.stringify(material[a])===JSON.stringify(material[b]);
 function pathPairs(map){if(!Array.isArray(map)||map.some(id=>!Object.hasOwn(material,id)))return [];const pairs=[];for(let i=0;i<map.length;i++)for(let j=i+2;j<map.length;j++)if(same(map[i],map[j])&&map.slice(i+1,j).some(id=>!same(map[i],id)))pairs.push([i,j]);return pairs}
 function pairValid(pair){return Array.isArray(pair)&&pair.length===2&&pair.every(Number.isInteger)}
 function pathFits(item,pair){return !!item&&pairValid(pair)&&pathPairs(item.map).some(p=>p[0]===pair[0]&&p[1]===pair[1])}
 function beforePairs(item,pair){return pathFits(item,pair)?pathPairs(item.before).filter(p=>same(item.before[p[0]],item.map[pair[0]])):[]}
 const t=(nn,nb,en)=>[nn,nb,en];
 const segment=(start,end,accent=false)=>({start,end,accent});
 const plans=rows=>rows.map(row=>row.map(x=>segment(...x)));
 const stories=freeze([
  {sections:['A','B','A'],brief:t('Lat tilbakekomsten stikke seg ut, eller la han gli inn.','La tilbakekomsten skille seg ut, eller la den gli inn.','Make the return stand out, or let it blend in.'),models:plans([[['p','mf'],['mf','mf'],['f','f']],[['mf','mf'],['mf','mf'],['mf','mf',true]]])},
  {sections:['X','X'],brief:t('Same tonar, ulik plass i framgrunnen. Prøv to retningar.','Samme toner, ulik plass i forgrunnen. Prøv to retninger.','Same pitches, different prominence. Try two directions.'),models:plans([[['p','p'],['mf','mf']],[['f','f'],['p','p']]])},
  {sections:['A','B'],brief:t('Samanlikn ei gradvis oppbygging med ei brå ny styrke.','Sammenlign en gradvis oppbygging med en brå ny styrke.','Compare a gradual build with a sudden new loudness.'),models:plans([[['p','mf'],['f','f']],[['p','p'],['mf','f']]])},
  {sections:['B','A'],brief:t('Gje plass etter ei tydeleg opning. Kvar vil du sleppe taket?','Gi plass etter en tydelig åpning. Hvor vil du slippe taket?','Leave space after a prominent opening. Where will you ease back?'),models:plans([[['f','mf'],['p','p']],[['mf','mf'],['mf','p']]])},
  {sections:['Av','A'],brief:t('To nærskylde sluttar. Marker innkomsten til ein del, eller vel noko anna.','To beslektede avslutninger. Marker inngangen til en del, eller velg noe annet.','Two related endings. Mark a section entrance, or choose otherwise.'),models:plans([[['mf','mf'],['p','p',true]],[['p','mf'],['mf','f']]])},
  {sections:['X','Y','X'],brief:t('Skal midten eller dei ytre delane vere mest framme?','Skal midten eller de ytre delene være mest fremme?','Should the middle or outer sections be more prominent?'),models:plans([[['mf','mf'],['p','p'],['mf','mf']],[['p','p'],['f','f'],['p','p']]])},
  {sections:['A','Bv'],brief:t('Samanlikn ein lokal aksent med ei heil del som er sterk.','Sammenlign en lokal aksent med en hel del som er sterk.','Compare a local accent with an entire loud section.'),models:plans([[['p','p',true],['mf','mf']],[['f','f'],['p','p']]])},
  {sections:['B','B','A'],brief:t('Hald pulsen i tankane medan du reviderer ei styrkeretning.','Behold pulsen i tankene mens du reviderer en styrkeretning.','Keep the pulse in mind while revising a dynamic direction.'),models:plans([[['p','mf'],['mf','f'],['mf','mf']],[['f','mf'],['mf','p'],['p','p']]])}
 ].map((v,i)=>({...v,id:'story-'+(i+1),revision:1})));
 const dynamics=freeze(['p','mf','f']);
 function storyValid(item,plan){return !!item&&Array.isArray(plan)&&plan.length===item.sections.length&&Array.from(plan).every(s=>exact(s,['start','end','accent'])&&dynamics.includes(s.start)&&dynamics.includes(s.end)&&typeof s.accent==='boolean')}
 function direction(s){if(!s||!dynamics.includes(s.start)||!dynamics.includes(s.end))throw Error('Invalid dynamics');const a=dynamics.indexOf(s.start),b=dynamics.indexOf(s.end);return a===b?'constant':a<b?'crescendo':'decrescendo'}
 const tiles=freeze([{id:'q',kind:'note',ticks:2},{id:'r',kind:'rest',ticks:2},{id:'e',kind:'note',ticks:1},{id:'er',kind:'rest',ticks:1},{id:'h',kind:'note',ticks:4},{id:'hr',kind:'rest',ticks:4}]);
 const tile=id=>tiles.find(t=>t.id===id);
 const briefs=freeze([['q','r'],['h','hr'],['e','er'],['q','r','h'],['q','e','r'],['q','e','hr'],['q','e','h','er'],['q','r','e','er']].map((palette,i)=>({id:'tiles-'+(i+1),revision:1,palette})));
 function ticks(pattern){return Array.isArray(pattern)&&Array.from(pattern).every(id=>!!tile(id))?pattern.reduce((n,id)=>n+tile(id).ticks,0):NaN}
 function draft(pattern){return Array.isArray(pattern)&&pattern.length<=8&&Number.isFinite(ticks(pattern))&&ticks(pattern)<=8}
 function free(pattern){return draft(pattern)&&ticks(pattern)===8}
 function fitsTiles(brief,pattern){const b=typeof brief==='string'?briefs.find(x=>x.id===brief):brief;if(!b||!free(pattern)||!pattern.every(id=>b.palette.includes(id)))return false;const count=id=>pattern.filter(x=>x===id).length;
  switch(b.id){case 'tiles-1':return pattern.length===4&&count('r')===1;case 'tiles-2':return count('h')===1&&count('hr')===1;case 'tiles-3':return pattern.length===8&&count('er')===2&&pattern.every((id,i)=>id!=='er'||pattern[i+1]!=='er');case 'tiles-4':return pattern.length===3&&['q','r','h'].every(id=>count(id)===1);case 'tiles-5':return count('r')===1&&pattern.filter(id=>tile(id).kind==='note').length===4;case 'tiles-6':return pattern.at(-1)==='hr'&&pattern.slice(0,-1).every(id=>['q','e'].includes(id));case 'tiles-7':return pattern[0]==='er'&&pattern[1]==='e'&&pattern.at(-1)==='q'&&pattern.slice(2,-1).every(id=>['q','e','h'].includes(id));case 'tiles-8':{let n=0,split=-1;for(let i=0;i<pattern.length;i++){n+=tile(pattern[i]).ticks;if(n===4){split=i+1;break}if(n>4)return false}if(split<0)return false;const half=pattern.slice(0,split);return JSON.stringify(half)===JSON.stringify(pattern.slice(split))&&half.some(id=>tile(id).kind==='note')&&half.some(id=>tile(id).kind==='rest')};default:return false}
 }
 function empty(){return {version:1,level:1,done:{},creations:[]}}
 const level=v=>Number.isInteger(v)&&v>=1&&v<=4;
 function valueValid(c,previous=false){if(c.slot==='w4-paths'){const p=paths.find(x=>x.id===c.challenge);return c.type==='return-investigation'&&!!p&&pathFits(p,previous?c.previous:c.value)}if(c.slot==='w4-story'){const s=stories.find(x=>x.id===c.challenge);return c.type==='dynamics-storyboard'&&!!s&&storyValid(s,previous?c.previous:c.value)}if(c.slot==='w4-tiles'){const v=previous?c.previous:c.value;return c.type==='rhythm-tiles'&&(c.challenge==='free'||briefs.some(b=>b.id===c.challenge))&&(previous?draft(v):c.challenge==='free'?free(v):fitsTiles(c.challenge,v))}return false}
 function valid(v){if(v===undefined)return empty();if(!exact(v,['version','level','done','creations'])||v.version!==1||!level(v.level)||!v.done||typeof v.done!=='object'||Array.isArray(v.done)||!Array.isArray(v.creations)||v.creations.length>30)throw Error('Invalid Week4 archive');for(const [k,n]of Object.entries(v.done))if(!/^w4-(paths\/path|tiles\/tiles)-[1-8]\/r1\/l[1-4]$/.test(k)||!Number.isInteger(n)||n<1||n>1000000)throw Error('Invalid Week4 practice');const seen=new Set();for(const c of v.creations){if(!exact(c,['slot','type','challenge','revision','level','value','previous'])||c.revision!==1||!level(c.level)||!valueValid(c)||!(c.previous===null||valueValid(c,true)))throw Error('Invalid Week4 creation');const normalize=x=>c.slot==='w4-story'?x.map(s=>[s.start,s.end,s.accent]):x;const key=JSON.stringify([c.slot,c.challenge,c.level,normalize(c.value),c.previous===null?null:normalize(c.previous)]);if(seen.has(key))throw Error('Duplicate Week4 creation');seen.add(key)}return clone(v)}
 return freeze({week:'return-expression-space.v1',slots,material,paths,stories,dynamics,tiles,briefs,clone,pathPairs,pathFits,beforePairs,storyValid,direction,tile,ticks,draft,free,fitsTiles,empty,valid});
});
