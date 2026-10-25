/* Week 5 built-in visual models. Integer ticks are half a quarter-note beat. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.W5Core=api;})(typeof globalThis==='object'?globalThis:this,function(){
 'use strict';
 const clone=v=>JSON.parse(JSON.stringify(v));
 const freeze=v=>{if(v&&typeof v==='object'){Object.values(v).forEach(freeze);Object.freeze(v)}return v};
 const exact=(v,keys)=>!!v&&typeof v==='object'&&!Array.isArray(v)&&Object.keys(v).length===keys.length&&keys.every(k=>Object.hasOwn(v,k));
 const dense=(v,n)=>Array.isArray(v)&&(n===undefined||v.length===n)&&Object.keys(v).length===v.length&&Array.from(v).every((_,i)=>Object.hasOwn(v,i));
 const pitches=freeze([60,62,64,65,67,69]),durations=freeze([1,2,3,4]);
 const roles=freeze(['melody','answer','pulse','space']);
 const slots=freeze([
  {id:'w5-motif',type:'motif-transformation',mechanic:'component-transformation'},
  {id:'w5-staff',type:'staff-landmark',mechanic:'staff-placement'},
  {id:'w5-roles',type:'ensemble-roles',mechanic:'part-allocation'}
 ].map(s=>({...s,revision:1,state:'implemented-prototype',humanValidation:'PENDING',pupilRelease:'BLOCKED'})));
 const notes=(ns,ds)=>ns.map((notes,i)=>({notes,ticks:ds[i]}));
 const motifs=freeze([
  ['pitch',[3],[60,62,64,67],[2,2,2,2]],
  ['pitch',[0],[67,64,62,60],[2,2,2,2]],
  ['pitch',[1],[60,64,62,67],[1,3,2,2]],
  ['pitch',[2,3],[62,64,67,69],[2,2,2,2]],
  ['rhythm',[0,1],[60,62,64,67],[2,2,2,2]],
  ['rhythm',[2,3],[67,65,64,62],[1,3,2,2]],
  ['rhythm',[1,2],[60,64,67,64],[2,1,3,2]],
  ['rhythm',[0,3],[62,65,69,67],[2,2,2,2]]
 ].map(([parameter,editable,ns,ds],i)=>({id:'motif-'+(i+1),revision:1,parameter,editable,original:notes(ns,ds)})));
 const positions=freeze([60,62,64,65,67,69,71,72,74,76,77,79,81]);
 const landmarks=freeze([[60,67],[64,71],[65,69],[74,77],[62,60],[69,72],[67,74],[76,81]].map((targets,i)=>({id:'landmark-'+(i+1),revision:1,targets})));
 const t=(nn,nb,en)=>[nn,nb,en];
 const ensembles=freeze([
  {melody:notes([60,62,64,67],[2,2,2,2]),answer:notes([67,64,62,60],[2,2,2,2]),pulse:[0,2,4,6,8,10,12,14],models:[['melody','answer','pulse','space'],['melody','answer','pulse','melody']],brief:t('Dobbel melodien, eller la éi stemme vente?','Doble melodien, eller la én stemme vente?','Double the melody, or let one part wait?')},
  {melody:notes([64,67],[4,4]),answer:notes([67,65,64,62],[2,2,2,2]),pulse:[0,4,8,12],models:[['melody','pulse','space','space'],['melody','pulse','answer','space']],brief:t('Legg til eit svar over ei romsleg pulsstemme?','Legge til et svar over en romslig pulsstemme?','Add an answer over a spacious pulse part?')},
  {melody:notes([60,64,67,64],[2,2,2,2]),answer:notes([62,65,69,65],[2,2,2,2]),pulse:[0,2,4,6,8,10,12,14],models:[['melody','melody','pulse','space'],['melody','answer','pulse','space']],brief:t('Frå same melodi saman til å overlate ordet?','Fra samme melodi sammen til å overlate ordet?','From unison melody to handing over?')},
  {melody:notes([67,64,62,60],[2,2,2,2]),answer:notes([60,62],[4,4]),pulse:[0,2,4,6],models:[['melody','answer','pulse','space'],['melody','space','pulse','space']],brief:t('Svar, eller ei tom andre takt når pulsstemma tek pause?','Svar, eller en tom andre takt når pulsstemmen tar pause?','An answer, or an empty second bar while the pulse part pauses?')},
  {melody:notes([62,64,65,69],[2,2,2,2]),answer:[{notes:null,ticks:4},...notes([69,67,65,64],[1,1,1,1])],pulse:[0,2,4,6,8,10,12,14],models:[['melody','answer','pulse','space'],['melody','answer','space','space']],brief:t('Skal pulsmarkeringar binde saman ei sein innkomst?','Skal pulsmarkeringer binde sammen en sen inngang?','Should pulse marks bridge a delayed entry?')},
  {melody:notes([60,64,60,64],[2,2,2,2]),answer:notes([67,64,67,64],[2,2,2,2]),pulse:[8,10,12,14],models:[['melody','answer','space','space'],['melody','answer','pulse','space']],brief:t('La pulsstemma kome inn med svaret?','La pulsstemmen komme inn med svaret?','Bring the pulse part in with the answer?')}
 ].map((v,i)=>({...v,id:'roles-'+(i+1),revision:1})));
 const resolve=(bank,item)=>bank.find(p=>p.id===(typeof item==='string'?item:item?.id));
 function ticks(value){return dense(value)&&Array.from(value).every(e=>exact(e,['notes','ticks'])&&(e.notes===null||pitches.includes(e.notes))&&durations.includes(e.ticks))?value.reduce((n,e)=>n+e.ticks,0):NaN}
 function motifShape(value){return dense(value,4)&&Number.isFinite(ticks(value))&&Array.from(value).every(e=>pitches.includes(e.notes))}
 function motifDraft(item,value,free=false){const p=resolve(motifs,item);if(!p||typeof free!=='boolean'||!motifShape(value))return false;if(free)return true;return Array.from(value).every((e,i)=>{const base=p.original[i],editable=p.editable.includes(i);return p.parameter==='pitch'?e.ticks===base.ticks&&(editable||e.notes===base.notes):e.notes===base.notes&&(editable||e.ticks===base.ticks)})}
 function motifFits(item,value){const p=resolve(motifs,item);return !!p&&motifDraft(p,value)&&ticks(value)===8&&p.editable.every(i=>p.parameter==='pitch'?value[i].notes!==p.original[i].notes:value[i].ticks!==p.original[i].ticks)}
 function freeMotif(value){return motifShape(value)&&ticks(value)===8}
 function motifDiff(item,value){const p=resolve(motifs,item);if(!p||!motifShape(value))throw Error('Invalid motif comparison');return {pitch:value.map((e,i)=>e.notes!==p.original[i].notes),rhythm:value.map((e,i)=>e.ticks!==p.original[i].ticks)}}
 function staffDraft(item,value){return !!resolve(landmarks,item)&&dense(value,2)&&Array.from(value).every(p=>p===null||Number.isInteger(p)&&p>=0&&p<positions.length)}
 function staffFits(item,value){const p=resolve(landmarks,item);return !!p&&staffDraft(p,value)&&value.every((v,i)=>v!==null&&positions[v]===p.targets[i])}
 function rolesFits(item,value){return !!resolve(ensembles,item)&&dense(value,4)&&Array.from(value).every(role=>roles.includes(role))}
 function timeline(item,role){const p=resolve(ensembles,item);if(!p||!roles.includes(role))throw Error('Invalid ensemble role');if(role==='space')return [{kind:'rest',notes:null,at:0,ticks:16}];if(role==='pulse')return p.pulse.map(at=>({kind:'pulse',notes:null,at,ticks:0}));let at=role==='answer'?8:0;const events=(role==='melody'?p.melody:p.answer).map(e=>{const v={kind:e.notes===null?'rest':'note',notes:e.notes,at,ticks:e.ticks};at+=e.ticks;return v});return role==='melody'?[...events,{kind:'rest',notes:null,at:8,ticks:8}]:[{kind:'rest',notes:null,at:0,ticks:8},...events]}
 function roleSummary(item,value){const p=resolve(ensembles,item);if(!p||!rolesFits(p,value))throw Error('Invalid ensemble plan');const counts=Object.fromEntries(roles.map(r=>[r,value.filter(v=>v===r).length]));const entries=Object.fromEntries(roles.map(r=>[r,counts[r]?timeline(p,r).find(e=>e.kind!=='rest')?.at??null:null]));const beats=new Set();for(const role of value)for(const e of timeline(p,role))if(e.kind!=='rest')beats.add(Math.floor(e.at/2)+1);const attackBeats=[...beats].sort((a,b)=>a-b);return {counts,entries,attackBeats,attackFreeBeats:Array.from({length:8},(_,i)=>i+1).filter(b=>!beats.has(b))}}
 function empty(){return {version:1,level:1,done:{},creations:[]}}
 const level=v=>Number.isInteger(v)&&v>=1&&v<=4;
 function recordValue(c,value,current){
  if(c.slot==='w5-motif'){if(!['brief','free'].includes(c.mode)||!motifDraft(c.challenge,value,c.mode==='free'))return false;return !current||(c.mode==='free'?freeMotif(value):motifFits(c.challenge,value))}
  if(c.slot==='w5-staff')return c.mode==='brief'&&(current?staffFits(c.challenge,value):staffDraft(c.challenge,value));
  return c.mode==='open'&&rolesFits(c.challenge,value);
 }
 function signature(c){const value=v=>v===null?null:c.slot==='w5-motif'?v.map(e=>[e.notes,e.ticks]):v;return JSON.stringify([c.slot,c.type,c.challenge,c.revision,c.level,c.mode,value(c.value),value(c.previous)])}
 function valid(v){
  if(v===undefined)return empty();
  if(!exact(v,['version','level','done','creations'])||v.version!==1||!level(v.level)||!v.done||typeof v.done!=='object'||Array.isArray(v.done)||!dense(v.creations)||v.creations.length>30)throw Error('Invalid Week5 archive');
  for(const [key,n]of Object.entries(v.done))if(!/^w5-(motif\/motif|staff\/landmark)-[1-8]\/r1\/l[1-4]$/.test(key)||!Number.isInteger(n)||n<1||n>1000000)throw Error('Invalid Week5 practice');
  const seen=new Set();for(const c of v.creations){const slot=slots.find(s=>s.id===c?.slot),bank=c?.slot==='w5-motif'?motifs:c?.slot==='w5-staff'?landmarks:ensembles;
   if(!exact(c,['slot','type','challenge','revision','level','mode','value','previous'])||!slot||c.type!==slot.type||typeof c.challenge!=='string'||!resolve(bank,c.challenge)||c.revision!==1||!level(c.level)||!recordValue(c,c.value,true)||!(c.previous===null||recordValue(c,c.previous,false)))throw Error('Invalid Week5 creation');
   const key=signature(c);if(seen.has(key))throw Error('Duplicate Week5 creation');seen.add(key);
  }
  return clone(v);
 }
 return freeze({week:'one-change.v1',slots,pitches,durations,motifs,positions,landmarks,roles,ensembles,clone,ticks,motifDraft,motifFits,freeMotif,motifDiff,staffDraft,staffFits,rolesFits,timeline,roleSummary,empty,valid});
});
