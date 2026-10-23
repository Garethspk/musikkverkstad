/* Built-in inert musical content and strict optional progress contract. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.WGCore=api;})(typeof globalThis==='object'?globalThis:this,function(){
 'use strict';
 const slots=Object.freeze([
  {id:'w1-pulse',type:'pulse-grid',mechanic:'sequence',revision:1,state:'implemented-prototype',humanValidation:'PENDING',pupilRelease:'BLOCKED'},
  {id:'w1-symbol',type:'rest-symbol',mechanic:'single-choice',revision:1,state:'implemented-prototype',humanValidation:'PENDING',pupilRelease:'BLOCKED'},
  {id:'w1-create',type:'rhythm-create',mechanic:'grid-revision',revision:1,state:'implemented-prototype',humanValidation:'PENDING',pupilRelease:'BLOCKED'}
 ].map(Object.freeze));
 const event=(notes,dur)=>({notes,dur});
 const patterns=[[1,0,1,0],[1,1,0,1],[0,1,0,1],[1,0,0,1]];
 const sustain=[[[60,2],[null,1],[60,1]],[[null,1],[60,2],[60,1]],[[60,1],[60,1],[60,2]],[[60,2],[null,2]]];
 const subpatterns=[[1,0,1,0,0,0,1,0],[0,1,1,0,1,1,0,0],[1,1,0,1,0,0,1,0],[1,0,0,0,1,0,0,1]];
 const pulse=Object.freeze([...patterns.map((p,i)=>({id:'pulse-quarter-'+i,brief:1,division:1,events:p.map(x=>event(x?60:null,1))})),...sustain.map((p,i)=>({id:'pulse-held-'+i,brief:2,division:1,events:p.map(x=>event(...x))})),...subpatterns.map((p,i)=>({id:'pulse-half-'+i,brief:3,division:2,events:p.map(x=>event(x?60:null,.5))}))].map(x=>Object.freeze({...x,revision:1,events:Object.freeze(x.events.map(Object.freeze))})));
 const symbolDefs=Object.freeze([{id:'quarter-rest',dur:1,silent:true},{id:'half-rest',dur:2,silent:true},{id:'eighth-rest',dur:.5,silent:true},{id:'quarter-note',dur:1,silent:false}].map(Object.freeze));
 const symbol=Object.freeze([[1,[0,1,2,3]],[2,[0,2,0,2]],[.5,[0,.5,2,3.5]]].flatMap(([dur,starts],b)=>starts.map((start,i)=>({id:'symbol-'+b+'-'+i,brief:b+1,gap:dur,start,events:[...(start?(b===1&&i>=2?[event(60,1),event(60,1)]:[event(60,start)]):[]),event(null,dur),...(start+dur<4?(b===1&&i>=2?[event(60,1),event(60,1)]:[event(60,4-start-dur)]):[])]}))).map(x=>Object.freeze({...x,revision:1,events:Object.freeze(x.events.map(Object.freeze))})));
 function labels(item){return Array.from({length:4*item.division},(_,i)=>i%item.division===0?String(i/item.division+1):'&');}
 function grid(item){const out=[];for(const e of item.events)for(let n=0;n<e.dur*item.division;n++)out.push(e.notes===null?'rest':n?'held':'note');return out;}
 function fitsPulse(item,value){return Array.isArray(value)&&JSON.stringify(value)===JSON.stringify(labels(item));}
 function fitsSymbol(item,id){return symbolDefs.some(s=>s.id===id&&s.silent&&s.dur===item.gap);}
 function pattern(value,division){return [1,2].includes(division)&&Array.isArray(value)&&value.length===4*division&&value.every(x=>x===0||x===1);}
 function events(value,division){if(!pattern(value,division))throw Error('Invalid rhythm');return value.map(x=>event(x?60:null,1/division));}
 function empty(){return {version:1,level:1,done:{},creations:[]};}
 const exact=(v,keys)=>v&&typeof v==='object'&&!Array.isArray(v)&&Object.keys(v).length===keys.length&&keys.every(k=>Object.hasOwn(v,k));
 function valid(value){
  if(value===undefined)return empty();
  if(!exact(value,['version','level','done','creations'])||value.version!==1||!Number.isInteger(value.level)||value.level<1||value.level>4||!value.done||typeof value.done!=='object'||Array.isArray(value.done)||!Array.isArray(value.creations)||value.creations.length>20)throw Error('Invalid programme data');
  for(const [key,n]of Object.entries(value.done))if(!/^w1-(pulse|symbol)-[1-4]$/.test(key)||!Number.isInteger(n)||n<0||n>1000000)throw Error('Invalid programme practice');
  for(const c of value.creations){
   if(!exact(c,['slot','challenge','revision','level','brief','division','pattern','previous'])||c.slot!=='w1-create'||c.challenge!=='rhythm-free.v1'||c.revision!==1||!Number.isInteger(c.level)||c.level<1||c.level>4||!Number.isInteger(c.brief)||![1,2,3].includes(c.brief)||(c.level!==4&&c.brief!==c.level)||(c.brief===3?c.division!==2:c.division!==1)||!pattern(c.pattern,c.division)||(c.level===3?c.division!==2:c.level!==4&&c.division!==1)||!(c.previous===null||exact(c.previous,['division','pattern'])&&pattern(c.previous.pattern,c.previous.division)))throw Error('Invalid programme creation');
  }
  const keys=value.creations.map(c=>JSON.stringify([c.level,c.brief,c.division,c.pattern,c.previous&&[c.previous.division,c.previous.pattern]]));if(new Set(keys).size!==keys.length)throw Error('Duplicate programme creation');
  return JSON.parse(JSON.stringify(value));
 }
 return Object.freeze({week:'pulse-space.v1',slots,pulse,symbol,symbolDefs,labels,grid,fitsPulse,fitsSymbol,pattern,events,empty,valid});
});
