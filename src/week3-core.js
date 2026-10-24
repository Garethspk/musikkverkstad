/* Built-in Week3 rhythm models. Integer ticks: one tick is half a quarter-note beat. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.W3Core=api;})(typeof globalThis==='object'?globalThis:this,function(){
 'use strict';
 const clone=v=>JSON.parse(JSON.stringify(v));
 const freeze=v=>{if(v&&typeof v==='object'){Object.values(v).forEach(freeze);Object.freeze(v)}return v};
 const slots=freeze([
  {id:'w3-response',type:'melodic-response',mechanic:'scoped-conversation',revision:1,state:'implemented-prototype',humanValidation:'PENDING',pupilRelease:'BLOCKED'},
  {id:'w3-debug',type:'notation-repair',mechanic:'event-repair',revision:1,state:'implemented-prototype',humanValidation:'PENDING',pupilRelease:'BLOCKED'},
  {id:'w3-form',type:'form-construction',mechanic:'scoped-form-build',revision:1,state:'implemented-prototype',humanValidation:'PENDING',pupilRelease:'BLOCKED'}
 ]);
 const defs=[
  ['duration',[['note',2],['note',4],['note',4]],[0,1,2],[1,2,4]],
  ['duration',[['note',2],['note',2],['note',2]],[0,1,2],[1,2,4]],
  ['duration',[['rest',4],['note',4],['note',2]],[1],[1,2,4]],
  ['duration',[['note',3],['note',1],['rest',2],['note',1]],[2,3],[1,2,3,4]],
  ['duration',[['note',2],['rest',1],['note',2],['note',2],['note',2]],[0,2,3,4],[1,2,4]],
  ['duration',[['rest',4],['note',1],['note',1],['rest',1]],[1,2,3],[1,2,4]],
  ['role',[['note',2],['note',2],['note',2],['note',2]],[0,1,2,3],[2]],
  ['duration',[['note',6],['rest',2],['note',2]],[0],[1,2,3,4,6,8]]
 ];
 const problems=freeze(defs.map(([fault,events,editable,palette],i)=>({id:'debug-'+(i+1),revision:1,fault,original:events.map(([kind,ticks])=>({kind,ticks})),editable,palette})));
 const exact=(v,keys)=>!!v&&typeof v==='object'&&!Array.isArray(v)&&Object.keys(v).length===keys.length&&keys.every(k=>Object.hasOwn(v,k));
 const level=v=>Number.isInteger(v)&&v>=1&&v<=4;
 function original(problem){return clone(problem.original)}
 function ticks(events){return events.reduce((sum,e)=>sum+e.ticks,0)}
 function eventsValid(problem,events){
  if(!problem||!Array.isArray(events)||events.length!==problem.original.length)return false;
  return events.every((e,i)=>{const base=problem.original[i];if(!exact(e,['kind','ticks'])||!['note','rest'].includes(e.kind)||!Number.isInteger(e.ticks)||e.ticks<1||e.ticks>8)return false;
   if(!problem.editable.includes(i))return e.kind===base.kind&&e.ticks===base.ticks;
   return problem.fault==='role'?e.ticks===base.ticks:e.kind===base.kind&&problem.palette.includes(e.ticks);
  });
 }
 function accepts(problem,events){return eventsValid(problem,events)&&ticks(events)===8&&events.filter((e,i)=>e.kind!==problem.original[i].kind||e.ticks!==problem.original[i].ticks).length===1}
 function empty(){return {version:1,level:1,done:{},repairs:[]}}
 function valid(v){
  if(v===undefined)return empty();
  if(!exact(v,['version','level','done','repairs'])||v.version!==1||!level(v.level)||!v.done||typeof v.done!=='object'||Array.isArray(v.done)||!Array.isArray(v.repairs)||v.repairs.length>20)throw Error('Invalid Week3 archive');
  for(const [key,n]of Object.entries(v.done))if(!/^w3-debug\/debug-[1-8]\/r1\/l[1-4]$/.test(key)||!Number.isInteger(n)||n<1||n>1000000)throw Error('Invalid Week3 practice');
  const seen=new Set();for(const c of v.repairs){const p=problems.find(x=>x.id===c?.challenge);
   if(!exact(c,['slot','type','challenge','revision','level','events','previous'])||c.slot!=='w3-debug'||c.type!=='notation-repair'||!p||c.revision!==1||!level(c.level)||!accepts(p,c.events)||!(c.previous===null||eventsValid(p,c.previous)))throw Error('Invalid notation repair');
   const signature=JSON.stringify([c.challenge,c.level,c.events.map(e=>[e.kind,e.ticks]),c.previous&&c.previous.map(e=>[e.kind,e.ticks])]);if(seen.has(signature))throw Error('Duplicate notation repair');seen.add(signature);
  }
  return clone(v);
 }
 return freeze({week:'response-repair-return.v1',slots,problems,clone,original,ticks,eventsValid,accepts,empty,valid});
});
