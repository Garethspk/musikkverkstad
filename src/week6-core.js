/* Week 6 source bridges and open interpretation plans. Half-beat ticks. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.W6Core=api;})(typeof globalThis==='object'?globalThis:this,function(){
 'use strict';
 const clone=v=>JSON.parse(JSON.stringify(v));
 const freeze=v=>{if(v&&typeof v==='object'){Object.values(v).forEach(freeze);Object.freeze(v)}return v};
 const exact=(v,keys)=>!!v&&typeof v==='object'&&!Array.isArray(v)&&Object.keys(v).length===keys.length&&keys.every(k=>Object.hasOwn(v,k));
 const dense=(v,n)=>Array.isArray(v)&&(n===undefined||v.length===n)&&Object.keys(v).length===v.length&&Array.from(v).every((_,i)=>Object.hasOwn(v,i));
 const slots=freeze([{id:'w6-groove',type:'groove-repair',mechanic:'source-repair'},{id:'w6-form',type:'form-arranger',mechanic:'source-construction'},{id:'w6-interpret',type:'interpretation-plan',mechanic:'articulation-comparison'}].map(s=>({...s,revision:1,state:'implemented-prototype',humanValidation:'PENDING',pupilRelease:'BLOCKED'})));
 const grooves=freeze([
 [1,[1,0,1,1],1],[1,[1,1,0,1],2],
 [2,[1,0,0,1,1,0,0,1],3],[2,[1,1,0,0,1,0,1,1],1],
 [3,[1,0,1,1,1,1,0,1],6],[3,[1,1,0,1,1,0,1,1],5],
 [4,[1,0,1,1,0,1,0,1,1,0,0,1,1,0,1,1],10],[4,[1,1,0,0,1,0,1,1,1,0,1,0,0,1,0,1],13]
 ].map(([level,target,changed],i)=>({id:'groove-'+(i+1),revision:1,level,target,changed})));
 const forms=freeze([{id:'arrange-variation',revision:1,brief:'variation',levels:[3,4],accepted:[['A','Av'],['B','Bv']]},{id:'arrange-return',revision:1,brief:'return',levels:[2,4],accepted:[['A','B','A'],['B','A','B']]}]);
 const material=freeze({A:[60,62,64,67],Av:[60,62,64,69],B:[67,64,62,60],Bv:[67,64,62,62]});
 const purposes=freeze(['gentle','decisive','open']),dynamics=freeze(['p','mf','f']);
 const plan=(purpose,dynamic,joins,accents)=>({purpose,dynamic,joins:[...joins].map(n=>n==='1'),accents:[...accents].map(n=>n==='1')});
 const interpretations=freeze([
 [[60,62,64,67],[2,2,2,2],plan('gentle','mf','111','0000'),plan('decisive','mf','000','1000'),['Inviter til ein innkomst, eller marker ein tydeleg start?','Inviter til en inngang, eller marker en tydelig start?','Invite an entry, or mark a clear start?']],
 [[67,64,62,60],[2,2,2,2],plan('gentle','p','111','0000'),plan('decisive','p','010','0001'),['La slutten falle til ro, eller hald han markert?','La slutten falle til ro, eller hold den markert?','Let the ending settle, or keep it marked?']],
 [[60,64,67,64],[2,2,2,2],plan('gentle','mf','101','0010'),plan('decisive','f','111','0000'),['Løft toppen fram, eller hald éin samanhengande boge?','Løft toppen frem, eller hold én sammenhengende bue?','Bring the peak forward, or keep one connected arc?']],
 [[64,64,62,60],[2,2,2,2],plan('gentle','mf','011','0000'),plan('decisive','p','111','1100'),['Bind saman eller skil gjentekne, nye anslag?','Bind sammen eller skill gjentatte, nye anslag?','Connect or separate repeated fresh attacks?']],
 [[60,62,65,64],[1,3,2,2],plan('gentle','mf','111','0000'),plan('decisive','mf','011','0100'),['Form ei kort–lang opning, eller hald artikulasjonen jamn?','Form en kort–lang åpning, eller hold artikulasjonen jevn?','Shape a short–long opening, or keep articulation even?']],
 [[62,65,69,67],[2,1,1,4],plan('gentle','p','111','0001'),plan('decisive','mf','101','1000'),['Framhev den lange slutten, eller lei fram mot han?','Fremhev den lange slutten, eller led frem mot den?','Emphasise the long ending, or lead towards it?']]
 ].map(([ns,ds,a,b,brief],i)=>({id:'interpret-'+(i+1),revision:1,events:ns.map((notes,j)=>({notes,ticks:ds[j]})),models:[a,b],brief})));
 const resolve=(bank,item)=>bank.find(p=>p.id===(typeof item==='string'?item:item?.id));
 function grooveDraft(item){const p=resolve(grooves,item);if(!p)throw Error('Invalid Groove case');return p.target.map((v,i)=>i===p.changed?1-v:v)}
 function groovePattern(item,value){const p=resolve(grooves,item);return !!p&&dense(value,p.target.length)&&value.every(v=>v===0||v===1)}
 function grooveFits(item,value){const p=resolve(grooves,item);return !!p&&groovePattern(p,value)&&value.every((v,i)=>v===p.target[i])}
 function grooveEvents(item,value){const p=resolve(grooves,item);if(!p||!groovePattern(p,value))throw Error('Invalid Groove pattern');return value.map(v=>({notes:v?60:null,dur:p.level%2===0?.5:1}))}
 function formDraft(item,value){const p=resolve(forms,item);return !!p&&dense(value,p.accepted[0].length)&&value.every(v=>v===null||typeof v==='string'&&Object.hasOwn(material,v))}
 function formFits(item,value){const p=resolve(forms,item);return !!p&&formDraft(p,value)&&p.accepted.some(a=>a.every((v,i)=>v===value[i]))}
 function planValid(v){return exact(v,['purpose','dynamic','joins','accents'])&&purposes.includes(v.purpose)&&dynamics.includes(v.dynamic)&&dense(v.joins,3)&&v.joins.every(b=>typeof b==='boolean')&&dense(v.accents,4)&&v.accents.every(b=>typeof b==='boolean')}
 function planDiff(before,current){if(!planValid(before)||!planValid(current))throw Error('Invalid interpretation comparison');return {purpose:before.purpose!==current.purpose,dynamic:before.dynamic!==current.dynamic,joins:current.joins.map((v,i)=>v!==before.joins[i]),accents:current.accents.map((v,i)=>v!==before.accents[i])}}
 const level=n=>Number.isInteger(n)&&n>=1&&n<=4;
 function empty(){return {version:1,level:1,plans:[]}}
 const ordered=p=>p===null?null:[p.purpose,p.dynamic,p.joins,p.accents];
 function valid(v){if(v===undefined)return empty();if(!exact(v,['version','level','plans'])||v.version!==1||!level(v.level)||!dense(v.plans)||v.plans.length>30)throw Error('Invalid Week6 archive');const seen=new Set();for(const c of v.plans){if(!exact(c,['slot','type','challenge','revision','level','plan','previous'])||c.slot!=='w6-interpret'||c.type!=='interpretation-plan'||typeof c.challenge!=='string'||!resolve(interpretations,c.challenge)||c.revision!==1||!level(c.level)||!planValid(c.plan)||!(c.previous===null||planValid(c.previous)))throw Error('Invalid Week6 plan');const key=JSON.stringify([c.challenge,c.level,ordered(c.plan),ordered(c.previous)]);if(seen.has(key))throw Error('Duplicate Week6 plan');seen.add(key)}return clone(v)}
 return freeze({week:'play-together.v1',slots,grooves,forms,interpretations,dynamics,purposes,material,clone,grooveDraft,groovePattern,grooveFits,grooveEvents,formDraft,formFits,planValid,planDiff,empty,valid});
});
