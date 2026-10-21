/* Notation Match: pitch reading in treble clef, equal quarter-note durations. */
const nmWords={
 title:['Lyd og notar','Lyd og noter','Notation Match'],
 desc:['Høyr ein melodi og finn notebiletet som passar.','Hør en melodi og finn notebildet som passer.','Hear a melody and find the matching score.'],
 help:['Høyr melodien. Samanlikn notane i A, B og dei andre alternativa. Vel det som viser akkurat dei tonane du høyrde, og trykk «Sjekk svaret».','Hør melodien. Sammenlign notene i A, B og de andre alternativene. Velg det som viser akkurat de tonene du hørte, og trykk «Sjekk svaret».','Play the melody. Compare the notes in A, B and any other options. Select the score showing exactly the notes you heard, then press “Check answer”.'],
 context:['Alle melodiane byrjar på C4 (midt-C). Den første tonen er òg første note i svaret. Ingen innleiingsakkord. G-nøkkel, C-dur og like lange firedelar; desse korte øvingane har ikkje taktstrekar.','Alle melodiene begynner på C4 (midt-C). Den første tonen er også første note i svaret. Ingen innledningsakkord. G-nøkkel, C-dur og like lange firedeler; disse korte øvelsene har ikke taktstreker.','Every melody starts on C4 (middle C). That first sound is also the first note in the answer. No introductory chord. Treble clef, C major and equal quarter notes; these short exercises have no barlines.'],
 play:['Høyr melodien','Hør melodien','Play melody'],slow:['Høyr rolegare','Hør roligere','Play more slowly'],
 choose:['Vel','Velg','Choose'],stop:['Stopp','Stopp','Stop'],level:['Nivå','Nivå','Level'],
 level1:['3 tonar · C, D, E','3 toner · C, D, E','3 notes · C, D, E'],
 level2:['4 tonar · C, D, E, G, A','4 toner · C, D, E, G, A','4 notes · C, D, E, G, A'],
 level3:['5 tonar · C-durskalaen','5 toner · C-durskalaen','5 notes · C major scale'],
 level4:['6 tonar · fire alternativ','6 toner · fire alternativer','6 notes · four options'],
 names:['Vis notenamn som støtte','Vis notenavn som støtte','Show note names for support'],
 support:['Notenamn er viste som støtte. Dette er øving, ikkje ein prøve i notelesing.','Notenavn vises som støtte. Dette er øving, ikke en prøve i notelesing.','Note names are shown as support. This is practice, not a score-reading test.'],
 right:['Det stemmer! Notebiletet viser melodien du høyrde.','Det stemmer! Notebildet viser melodien du hørte.','That matches! The score shows the melody you heard.'],
 wrong:['Ikkje heilt enno. Start på C og følg kvar tone: går han opp, ned eller er han lik? Høyr melodien igjen og samanlikn.','Ikke helt ennå. Start på C og følg hver tone: går den opp, ned eller er den lik? Hør melodien igjen og sammenlign.','Not quite yet. Start on C and follow each note: does it rise, fall or repeat? Replay the melody and compare.'],
 new:['Ny melodi','Ny melodi','New melody'],finish:['Ferdig for no','Ferdig for nå','Finish for now'],back:['Alle aktivitetar','Alle aktiviteter','All activities'],
 loading:['Lastar lyd …','Laster lyd …','Loading sound …'],playing:['Spelar melodien. Vent til alle tonane er ferdige.','Spiller melodien. Vent til alle tonene er ferdige.','Playing the melody. Wait until all notes finish.'],
 done:['Ferdig. Samanlikn notebileta og vel eit svar.','Ferdig. Sammenlign notebildene og velg et svar.','Finished. Compare the scores and choose an answer.'],
 ready:['Klar til å lytte.','Klar til å lytte.','Ready to listen.'],error:['Lyden kunne ikkje spelast. Prøv Test lyd øvst.','Lyden kunne ikke spilles. Prøv Test lyd øverst.','Sound could not play. Try Test sound at the top.'],
 score:['Notebilete','Notebilde','Score'],clef:['G-nøkkel','G-nøkkel','Treble clef'],
 local:['Denne runden blir ikkje lagra når sida blir lasta på nytt, og tel ikkje i Mi øving enno.','Denne runden lagres ikke når siden lastes på nytt, og teller ikke i Min øving ennå.','This round is not saved when the page reloads and does not count in My practice yet.']
};
Object.assign(nmWords,{check:['Sjekk svaret','Sjekk svaret','Check answer'],selectFirst:['Vel eit notebilete først.','Velg et notebilde først.','Select a score first.'],compare:['Høyr det rette notebiletet','Hør det riktige notebildet','Play the matching score'],textHelp:['Bruk notenamn for eit tekstalternativ til notebileta.','Bruk notenavn for et tekstalternativ til notebildene.','Use note-name support for a text alternative to the scores.']});
function nmText(k){return nmWords[k][document.documentElement.lang==='en'?2:document.documentElement.lang==='nb'?1:0]}
const NM_SCALE=[60,62,64,65,67,69,71,72];
let nm={level:data.extraPractice.notation.level,target:[],options:[],correct:0,success:false,support:false,busy:false,message:'',feedback:''};
function nmNew(){nm.level=scLevel('notation',nm.level);
 nm.recorded=false;nm.checks=0;nm.supportUsed=false;
 const pool=nm.level===1?[60,62,64]:nm.level===2?[60,62,64,67,69]:NM_SCALE;
 nm.target=[60,...Array.from({length:nm.level+1},()=>pick(pool))];
 if(nm.target.every(n=>n===60))nm.target[nm.target.length-1]=62;
 const count=nm.level===1?2:nm.level===4?4:3;
 const variants=[];
 // Finite candidate set: every single noninitial pitch substitution.
 for(let i=1;i<nm.target.length;i++)for(const pitch of pool)if(pitch!==nm.target[i]){const candidate=nm.target.slice();candidate[i]=pitch;variants.push(candidate)}
 nm.options=shuffle([nm.target.slice(),...shuffle(variants).slice(0,count-1)]);
 nm.correct=nm.options.findIndex(notes=>notes.every((n,i)=>n===nm.target[i]));
 nm.choice=null;nm.success=false;nm.feedback='';nm.message='';nm.support=false;
}
function nmY(m){return 98-NM_SCALE.indexOf(m)*5}
function nmScore(notes,label){
 const width=notes.length*48+62;
 const body=notes.map((m,i)=>{const x=62+i*48,y=nmY(m),up=m<71;return `${m===60?`<line x1="${x-11}" x2="${x+11}" y1="98" y2="98" stroke="#142531"/>`:''}<ellipse cx="${x}" cy="${y}" rx="6" ry="4.5" transform="rotate(-20 ${x} ${y})" fill="#142531"/><line x1="${x+(up?5:-5)}" x2="${x+(up?5:-5)}" y1="${y}" y2="${y+(up?-30:30)}" stroke="#142531" stroke-width="1.5"/>`}).join('');
 return `<div class="staff"><svg viewBox="0 0 ${width} 130" role="img" aria-label="${nmText('score')} ${label}: ${nm.support?notes.map(noteName).join(', '):nmText('clef')}"><title>${nmText('score')} ${label} · ${nmText('clef')}</title><text x="7" y="83" font-size="51" font-family="serif">𝄞</text>${[48,58,68,78,88].map(y=>`<line x1="35" x2="${width-10}" y1="${y}" y2="${y}" stroke="#52616a"/>`).join('')}${body}</svg></div>`;
}
function nmCard(){return `<section class="strip"><div><div class="eyebrow">${nmText('level')} ${scLevels('notation').join(', ')}</div><h3>${nmText('title')}</h3><p>${nmText('desc')}</p></div><button class="primary" data-go="notation">${nmText('title')} →</button></section>`}
function nmButton(action,label,value='',extra=''){return `<button data-nm-action="${action}" data-nm-value="${value}" ${nm.busy&&action!=='stop'||nm.success&&['answer','check'].includes(action)?'disabled':''} ${extra}>${label}</button>`}
function nmView(){if(!nm.target.length)nmNew();return `<section class="stage" style="max-width:950px;margin:auto"><style>.nm-controls{display:flex;flex-wrap:wrap;gap:10px;margin:16px 0}.nm-controls button,.nm-option button{min-height:48px;min-width:48px}.nm-options{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}.nm-option{min-width:0;border:1px solid var(--edge);padding:14px;border-radius:12px}.nm-option .staff{margin:12px 0}.nm-option .staff svg{min-width:240px;height:auto}@media(max-width:650px){.nm-options{grid-template-columns:1fr}}</style><button data-go="home">← ${nmText('back')}</button><h1>${nmText('title')}</h1><p>${nmText('help')}</p><div class="nm-controls">${scLevels('notation').map(l=>nmButton('level',nmText('level')+' '+l,l,`aria-pressed="${nm.level===l}"`)).join('')}</div><p><strong>${nmText('level'+nm.level)}</strong></p><p>${nmText('context')}</p><div class="nm-controls">${nmButton('play','▶ '+nmText('play'),'','class="primary"')}${nmButton('slow','▷ '+nmText('slow'))}${nmButton('stop','■ '+nmText('stop'))}</div><p role="status" aria-live="polite">${esc(nm.message||nmText('ready'))}</p><div class="nm-options">${nm.options.map((notes,i)=>{const label=String.fromCharCode(65+i);return `<article class="nm-option" style="outline:${nm.choice===i?'3px solid var(--gold)':'none'}"><h2>${label}</h2>${nmScore(notes,label)}${nm.support?`<p>${notes.map(noteName).join(' – ')}</p>`:''}${nmButton('answer',nmText('choose')+' '+label,i,'aria-pressed="'+(nm.choice===i)+'"')}</article>`}).join('')}</div><div class="nm-controls">${nmButton('check',nmText('check'))}${nmButton('support',nmText('names'),' ',`aria-pressed="${nm.support}"`)}</div>${nm.support?`<p>${nmText('support')}</p>`:''}<p class="feedback ${nm.success?'good':''}" role="status">${esc(nm.feedback)}</p><div class="nm-controls">${nmButton('new',nmText('new'))}${nm.success?`${nmButton('compare','▶ '+nmText('compare'))}<button data-go="home">${nmText('finish')}</button>`:''}</div><p class="note">${nmText('textHelp')}</p><p class="note">${extraText('local')}${!storageOK?' '+extraText('error'):''}</p></section>`}
function nmDraw(){if(typeof nvRemember==='function'){nvRemember();nvUpdate()}if(route!=='notation')return;const app=$('app'),active=document.activeElement,action=app.contains?.(active)?active?.dataset?.nmAction:null,value=active?.dataset?.nmValue;app.innerHTML=nmView();if(action){const buttons=Array.from(app.querySelectorAll?.('[data-nm-action]')||[]);const next=buttons.find(b=>!b.disabled&&b.dataset.nmAction===action&&b.dataset.nmValue===value)||buttons.find(b=>!b.disabled&&b.dataset.nmAction===(nm.success?'new':'stop'));next?.focus({preventScroll:true})}}
function nmStop(){nm.busy=false;nm.message='';nmDraw()}
async function nmPlay(slow){const pending=sequence(nm.target.map(n=>({notes:n,dur:1})),slow?65:90);const token=audioRun;nm.busy=true;nm.message=nmText('loading');nmDraw();const played=await pending;if(token!==audioRun||route!=='notation')return;if(!played){nm.busy=false;nm.message=nmText('error');nmDraw();return}nm.message=nmText('playing');nmDraw();timers.push(setTimeout(()=>{if(token!==audioRun||route!=='notation')return;nm.busy=false;nm.message=nmText('done');nmDraw()},150+nm.target.length*60000/(slow?65:90)))}
async function nmAction(action,value){if(action==='stop'){stopAudio();return}if(nm.busy)return;
 if(action==='level'){const n=Number(value);if(!scLevels('notation').includes(n))return;stopAudio();nm.level=n;extraLevel('notation',n);nmNew()}
 if(action==='new'){stopAudio();nmNew()}
 if(action==='support'){nm.support=!nm.support;if(nm.support)nm.supportUsed=true}
 if(action==='play'||action==='slow'){await nmPlay(action==='slow');return}
 if(action==='answer'&&!nm.success){const i=Number(value);if(!Number.isInteger(i)||!nm.options[i])return;nm.choice=i;nm.feedback=''}
 if(action==='check'&&!nm.success){if(nm.choice===null)nm.feedback=nmText('selectFirst');else{nm.checks++;nm.success=nm.choice===nm.correct;if(nm.success)extraComplete('notation',nm);nm.feedback=nmText(nm.success?'right':'wrong')}}
 if(action==='compare'&&nm.success){await nmPlay(false);return}
 nmDraw();
}
document.addEventListener('click',event=>{const b=event.target.closest('[data-nm-action]');if(!b||b.disabled)return;nmAction(b.dataset.nmAction,b.dataset.nmValue).catch(()=>{nm.busy=false;nm.message=nmText('error');nmDraw()})});
