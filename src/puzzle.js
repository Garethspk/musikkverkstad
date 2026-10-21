/* Phrase Puzzle: self-contained rounds; shared piano playback. */
const ppWords={
 title:['Melodipuslespel','Melodipuslespill','Phrase Puzzle'],
 desc:['Høyr melodien og set bitane i rett rekkjefølgje.','Hør melodien og sett bitene i riktig rekkefølge.','Listen to the melody and put its fragments in order.'],
 steps:['1. Høyr heile melodien. 2. Høyr bitane. 3. Vel ein plass, så «Set inn» ved ein bit. Sjekk når alle plassane er fylte.','1. Hør hele melodien. 2. Hør bitene. 3. Velg en plass, så «Sett inn» ved en bit. Sjekk når alle plassene er fylt.','1. Play the whole melody. 2. Listen to the fragments. 3. Select a slot, then “Place” beside a fragment. Check when every slot is filled.'],
 audio:['Ingen innleiingsakkord: du høyrer berre melodien. Kvar bit har to like lange tonar.','Ingen innledningsakkord: du hører bare melodien. Hver bit har to like lange toner.','No introductory chord: you hear only the melody. Each fragment has two notes of equal length.'],
 normal:['Bruk kvar bit éin gong.','Bruk hver bit én gang.','Use each fragment once.'],
 repeat:['Fire plassar, tre bitar: éin bit skal brukast to gonger.','Fire plasser, tre biter: én bit skal brukes to ganger.','Four slots, three fragments: one fragment is used twice.'],
 whole:['Høyr heile melodien','Hør hele melodien','Play whole melody'],
 fragment:['Bit','Bit','Fragment'],place:['Set inn','Sett inn','Place'],slot:['Plass','Plass','Slot'],
 selected:['Du fyller plass {n}. Vel «Set inn» ved ein bit.','Du fyller plass {n}. Velg «Sett inn» ved en bit.','You are filling slot {n}. Choose “Place” beside a fragment.'],
 listen:['Høyr','Hør','Listen'],mine:['Høyr rekkjefølgja mi','Hør rekkefølgen min','Play my order'],
 clear:['Tøm vald plass','Tøm valgt plass','Clear selected slot'],check:['Sjekk rekkjefølgja','Sjekk rekkefølgen','Check order'],
 incomplete:['Fyll alle plassane først.','Fyll alle plassene først.','Fill every slot first.'],
 wrong:['Ikkje heilt enno. Samanlikn heile melodien med di rekkjefølgje, to tonar om gongen. Du kan byte bit i alle plassane.','Ikke helt ennå. Sammenlign hele melodien med din rekkefølge, to toner om gangen. Du kan bytte bit i alle plassene.','Not quite yet. Compare the whole melody with your order, two notes at a time. You can replace any slot.'],
 right:['Det stemmer! Bitane gir den same melodien. Du kan avslutte eller prøve ein ny.','Det stemmer! Bitene gir den samme melodien. Du kan avslutte eller prøve en ny.','That matches! Your fragments make the same melody. You can finish or try a new one.'],
 new:['Nytt puslespel','Nytt puslespill','New puzzle'],finish:['Ferdig for no','Ferdig for nå','Finish for now'],
 local:['Denne runden blir ikkje lagra når du lastar sida på nytt. Han tel ikkje i Mi øving enno.','Denne runden lagres ikke når du laster siden på nytt. Den teller ikke i Min øving ennå.','This round is not saved when you reload the page. It does not count in My practice yet.'],
 playing:['Spelar: {name}.','Spiller: {name}.','Playing: {name}.'],ready:['Klar til å lytte.','Klar til å lytte.','Ready to listen.'],
 loading:['Lastar lyd …','Laster lyd …','Loading sound …'],done:['Avspelinga er ferdig.','Avspillingen er ferdig.','Playback finished.'],
 error:['Lyden kunne ikkje spelast. Prøv Test lyd øvst.','Lyden kunne ikke spilles. Prøv Test lyd øverst.','Sound could not play. Try Test sound at the top.'],stop:['Stopp','Stopp','Stop'],level:['Nivå','Nivå','Level'],back:['Alle aktivitetar','Alle aktiviteter','All activities']
};
Object.assign(ppWords,{level1:['To bitar','To biter','Two fragments'],level2:['Tre bitar','Tre biter','Three fragments'],level3:['Fire bitar','Fire biter','Four fragments'],level4:['Med ein gjenteken bit','Med en gjentatt bit','With a repeated piece']});
function ppText(k){return ppWords[k][document.documentElement.lang==='en'?2:document.documentElement.lang==='nb'?1:0]}
let pp={level:data.extraPractice.puzzle.level,pieces:[],target:[],answer:[],selected:0,feedback:'',success:false,busy:false,message:'',playSlot:-1};
function ppNew(){pp.level=scLevel('puzzle',pp.level);
 pp.recorded=false;pp.checks=0;pp.supportUsed=false;
 const bank=[[60,62],[64,60],[67,64],[62,69],[69,67],[64,62],[60,67],[67,69]];
 const count=pp.level===4?3:pp.level+1;
 pp.pieces=shuffle(bank.map(n=>n.slice())).slice(0,count);
 let ids=Array.from({length:count},(_,i)=>i);if(pp.level===4)ids.push(rand(count));
 pp.target=shuffle(ids);pp.answer=Array(ids.length).fill(null);pp.selected=0;pp.feedback='';pp.success=false;pp.message='';pp.playSlot=-1;
}
function ppCard(){if(!scRouteAllowed('puzzle'))return '';return `<section class="strip"><div><div class="eyebrow">${ppText('level')} ${scLevels('puzzle').join(', ')}</div><h3>${ppText('title')}</h3><p>${ppText('desc')}</p></div><button class="primary" data-go="puzzle">${ppText('title')} →</button></section>`}
function ppDraw(){if(typeof nvRemember==='function'){nvRemember();nvUpdate()}if(route!=='puzzle')return;const app=$('app'),active=document.activeElement,action=app.contains?.(active)?active?.dataset?.ppAction:null,value=active?.dataset?.ppValue;app.innerHTML=ppView();if(action){const buttons=Array.from(app.querySelectorAll?.('[data-pp-action]')||[]);const next=buttons.find(b=>!b.disabled&&b.dataset.ppAction===action&&b.dataset.ppValue===value)||buttons.find(b=>!b.disabled&&b.dataset.ppAction==='stop');next?.focus({preventScroll:true})}}
function ppStop(){pp.busy=false;pp.playSlot=-1;pp.message='';ppDraw()}
function ppButton(action,label,value='',extra=''){const disabled=pp.busy&&action!=='stop';return `<button data-pp-action="${action}" data-pp-value="${value}" ${disabled?'disabled':''} ${extra}>${label}</button>`}
function ppView(){
 if(!pp.pieces.length)ppNew();
 return `<section class="stage" style="max-width:950px;margin:auto"><style>.pp-grid{display:flex;flex-wrap:wrap;gap:12px;margin:18px 0}.pp-piece{padding:14px;border:1px solid var(--edge);border-radius:12px}.pp-grid button{min-width:48px;min-height:48px}.pp-picked{outline:3px solid var(--gold)}.pp-live{background:var(--green)!important;color:#101820!important}</style><button data-go="home">← ${ppText('back')}</button><h1>${ppText('title')}</h1><p>${ppText('desc')}</p><div class="pp-grid">${scLevels('puzzle').map(l=>ppButton('level',ppText('level')+' '+l+' · '+ppText('level'+l),l,`aria-pressed="${pp.level===l}"`)).join('')}</div><p>${ppText('steps')}</p><p class="note">${ppText('audio')}</p><p><strong>${ppText(pp.level===4?'repeat':'normal')}</strong></p><div class="pp-grid">${ppButton('whole','▶ '+ppText('whole'),'','class="primary"')}${ppButton('stop','■ '+ppText('stop'))}</div><p role="status" aria-live="polite" data-pp-status>${esc(pp.message||ppText('ready'))}</p><h2>${ppText('fragment')}</h2><div class="pp-grid">${pp.pieces.map((piece,i)=>`<div class="pp-piece"><strong>${String.fromCharCode(65+i)}</strong><div class="pp-grid">${ppButton('preview','▶ '+ppText('listen')+' '+String.fromCharCode(65+i),i)}${ppButton('place',ppText('place')+' '+String.fromCharCode(65+i),i)}</div></div>`).join('')}</div><p><strong>${ppText('selected').replace('{n}',pp.selected+1)}</strong></p><div class="pp-grid">${pp.answer.map((v,i)=>ppButton('slot',`${i+1}: ${v===null?'?':String.fromCharCode(65+v)}`,i,`class="${pp.selected===i?'pp-picked':''} ${pp.playSlot===i?'pp-live':''}" data-pp-slot="${i}" aria-pressed="${pp.selected===i}" aria-label="${ppText('slot')} ${i+1}: ${v===null?'?':String.fromCharCode(65+v)}"`)).join('')}</div><div class="pp-grid">${ppButton('clear',ppText('clear'))}${ppButton('mine','▶ '+ppText('mine'))}${ppButton('check',ppText('check'))}</div><p class="feedback ${pp.success?'good':''}" role="status">${esc(pp.feedback)}</p><div class="pp-grid">${ppButton('new',ppText('new'))}${pp.success?`<button data-go="home">${ppText('finish')}</button>`:''}</div><p class="note">${extraText('local')}${!storageOK?' '+extraText('error'):''}</p></section>`;
}
async function ppPlay(ids,label,mark=false){
 if(ids.includes(null)){pp.feedback=ppText('incomplete');ppDraw();return}
 // sequence stops previous playback synchronously; then mark loading as busy.
 const pending=sequence(ids.flatMap(id=>pp.pieces[id].map(n=>({notes:n,dur:1}))),90);
 const token=audioRun;pp.busy=true;pp.message=ppText('loading');ppDraw();
 const played=await pending;if(token!==audioRun||route!=='puzzle')return;
 if(!played){pp.busy=false;pp.message=ppText('error');ppDraw();return}
 pp.message=ppText('playing').replace('{name}',label);ppDraw();
 if(mark)ids.forEach((id,i)=>timers.push(setTimeout(()=>{if(token!==audioRun||route!=='puzzle')return;pp.playSlot=i;document.querySelectorAll('[data-pp-slot]').forEach(el=>el.classList.toggle('pp-live',Number(el.dataset.ppSlot)===i))},100+i*2*60000/90)));
 timers.push(setTimeout(()=>{if(token!==audioRun||route!=='puzzle')return;pp.busy=false;pp.playSlot=-1;pp.message=ppText('done');ppDraw()},150+ids.length*2*60000/90));
}
async function ppAction(action,value){
 if(action==='stop'){stopAudio();return}if(pp.busy)return;
 if(action==='level'){const n=Number(value);if(!scLevels('puzzle').includes(n))return;stopAudio();pp.level=n;extraLevel('puzzle',n);ppNew()}
 if(action==='new'){stopAudio();ppNew()}
 if(action==='whole'){await ppPlay(pp.target,ppText('whole'),true);return}
 if(action==='preview'){const i=Number(value);if(Number.isInteger(i)&&pp.pieces[i])await ppPlay([i],ppText('fragment')+' '+String.fromCharCode(65+i));return}
 if(action==='mine'){await ppPlay(pp.answer,ppText('mine'),true);return}
 if(action==='slot'){const i=Number(value);if(Number.isInteger(i)&&i>=0&&i<pp.answer.length)pp.selected=i}
 if(action==='place'){const i=Number(value);if(!Number.isInteger(i)||!pp.pieces[i])return;pp.answer[pp.selected]=i;const next=pp.answer.findIndex((v,j)=>j>pp.selected&&v===null);if(next>=0)pp.selected=next;pp.feedback='';pp.success=false}
 if(action==='clear'){pp.answer[pp.selected]=null;pp.success=false;pp.feedback=''}
 if(action==='check'){if(pp.answer.includes(null))pp.feedback=ppText('incomplete');else{pp.checks++;const heard=pp.target.flatMap(i=>pp.pieces[i]),made=pp.answer.flatMap(i=>pp.pieces[i]);pp.success=heard.every((n,i)=>n===made[i]);if(pp.success)extraComplete('puzzle',pp);pp.feedback=ppText(pp.success?'right':'wrong')}}
 ppDraw();
}
document.addEventListener('click',event=>{const b=event.target.closest('[data-pp-action]');if(!b||b.disabled)return;ppAction(b.dataset.ppAction,b.dataset.ppValue).catch(()=>{pp.busy=false;pp.message=ppText('error');ppDraw()})});
