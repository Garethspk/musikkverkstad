/* Weekly theme: no external services; separate, validated local-only storage. */
const thWords = {
 welcome:['Klar for ei lita lytteutfordring?','Klar for en liten lytteutfordring?','Ready for a quick listening challenge?'],
 welcomeHelp:['Høyr ein melodi, og finn den som er lik. Du kan prøve så mange gonger du vil.','Hør en melodi, og finn den som er lik. Du kan prøve så mange ganger du vil.','Hear a melody and find its match. Take as many tries as you like.'],
 quick:['Prøv ei kort utfordring','Prøv en kort utfordring','Try a quick challenge'], explore:['Vel aktivitet og nivå','Velg aktivitet og nivå','Choose activity and level'],
 step1:['1 · Høyr melodien','1 · Hør melodien','1 · Hear the melody'], step2:['2 · Finn den som er lik','2 · Finn den som er lik','2 · Find the matching melody'],
 another:['Prøv ein til','Prøv en til','Try another'], harder:['Gjer det vanskelegare','Gjør det vanskeligere','Make it harder'], own:['Lag din eigen slutt','Lag din egen slutt','Create your own ending'],
 forSlot:['Vel tone til plass','Velg tone til plass','Choose a note for slot'],
 rebuiltCount:['Slutten din med {n} tonar er lik førebiletet! Høyr førebiletet og din melodi ein gong til.','Slutten din med {n} toner er lik forbildet! Hør forbildet og din melodi en gang til.','Your {n}-note ending matches the reference! Replay the reference and your melody to compare.'],

 back:['Til framsida','Til forsiden','Back to home'], stop:['Stopp lyd','Stopp lyd','Stop sound'], demo:['Vis eit døme','Vis et eksempel','Show an example'],
 demoHelp:['Dette er eit eige døme, ikkje svaret på oppgåva. Først sluttar melodien på C4. I varianten er berre siste tone endra til A4. Høyr begge, og samanlikn. I byggjeoppgåva ville du valt C4 for å kopiere den første melodien. I skapande arbeid kan du velje den slutten du sjølv likar.','Dette er et eget eksempel, ikke svaret på oppgaven. Først slutter melodien på C4. I varianten er bare siste tone endret til A4. Hør begge, og sammenlign. I byggeoppgaven ville du valgt C4 for å kopiere den første melodien. I skapende arbeid kan du velge den slutten du selv liker.','This is a separate example, not the answer to your task. The first melody ends on C4. In the second, only the last note changes to A4. Listen to both and compare. To rebuild the first melody, you would choose C4. When creating, choose the ending you prefer.'],
 audioError:['Lyden kunne ikkje startast. Prøv Test lyd øvst på sida.','Lyden kunne ikke startes. Prøv Test lyd øverst på siden.','Sound could not start. Try Test sound at the top of the page.'],
 title:['Same start, ulik slutt','Samme start, ulik slutt','Same start, different ending'],
 intro:['Utforsk korleis nokre få tonar kan endre ein melodi. Vel ei oppgåve og eit nivå – du treng ikkje følgje ei fast rekkjefølgje.','Utforsk hvordan noen få toner kan endre en melodi. Velg en oppgave og et nivå – du trenger ikke følge en fast rekkefølge.','Explore how a few notes can change a melody. Choose any task and level; there is no required order.'],
 listen:['Lytt og samanlikn','Lytt og sammenlign','Listen and compare'], rebuild:['Bygg slutten','Bygg slutten','Rebuild the ending'], create:['Lag din variant','Lag din variant','Create your version'],
 level:['Nivå','Nivå','Level'], explored:['Utforska','Utforsket','Explored'], new:['Ny melodi','Ny melodi','New melody'],
 guide:['Alle melodiane har åtte firedelar i to 4/4-taktar. Første takt er alltid C–D–E–G. Me brukar tonane C, D, E, G og A i C-dur.','Alle melodiene har åtte firedeler i to 4/4-takter. Første takt er alltid C–D–E–G. Vi bruker tonene C, D, E, G og A i C-dur.','Each melody has eight quarter notes in two bars of 4/4. The first bar is always C–D–E–G. We use C, D, E, G and A in C major.'],
 range:['På dette nivået arbeider du med dei siste','På dette nivået arbeider du med de siste','At this level, work with the final'], notes:['tonane. Resten er fast.','tonene. Resten er fast.','notes. The rest stays fixed.'],
 context:['Høyr C-dur','Hør C-dur','Hear C major'], contextHelp:['Denne C-durakkorden gir deg ein toneart å lytte ut frå.','Denne C-durakkorden gir deg en toneart å lytte ut fra.','This C major chord gives you a tonal reference before you listen.'],
 listenHelp:['Høyr førebiletet, så A og B. Kva for ein er heilt lik førebiletet?','Hør forbildet, så A og B. Hvilken er helt lik forbildet?','Hear the reference, then A and B. Which one exactly matches the reference?'],
 reference:['Høyr førebiletet','Hør forbildet','Play reference'], play:['Høyr','Hør','Play'], choose:['Vel','Velg','Choose'], heard:['Høyrt','Hørt','Played'], needHear:['Høyr førebiletet og begge alternativa før du vel.','Hør forbildet og begge alternativene før du velger.','Play the reference and both options before choosing.'],
 right:['Ja! Du fann melodien som er lik førebiletet. Høyr gjerne ein gong til.','Ja! Du fant melodien som er lik forbildet. Hør gjerne en gang til.','Yes! You found the matching melody. Listen again to compare.'], wrong:["Denne slutten er ulik førebiletet. Høyr slutten igjen og samanlikn tone for tone.", "Denne slutten er ulik forbildet. Hør slutten igjen og sammenlign tone for tone.", "This ending differs from the reference. Replay the ending and compare one note at a time."],
 rebuildHelp:['Høyr melodien og fyll inn dei tomme plassane. Trykk på ein plass, så ein tone. Du høyrer tonen med ein gong.','Hør melodien og fyll inn de tomme plassene. Trykk på en plass, så en tone. Du hører tonen med en gang.','Listen and fill the empty slots. Select a slot, then a note. Each note sounds as you choose it.'],
 createHelp:['Behald starten og lag ein ny slutt. Prøv to ulike variantar og lytt til skilnaden. Her finst det ikkje éin rett slutt.','Behold starten og lag en ny slutt. Prøv to ulike varianter og lytt til forskjellen. Her finnes det ikke én riktig slutt.','Keep the opening and make a new ending. Try two versions and listen to the difference. There is no single correct ending.'],
 original:['Høyr utgangspunktet','Hør utgangspunktet','Play starting version'], mine:['Høyr din melodi','Hør din melodi','Play your melody'], check:['Sjekk svaret','Sjekk svaret','Check answer'], hint:['Få eit tips','Få et tips','Get a hint'],
 hintText:['Lytt berre til slutten. Går tonane opp, ned eller ligg dei på same tone? Bruk «Høyr berre slutten» og samanlikn.','Lytt bare til slutten. Går tonene opp, ned eller ligger de på samme tone? Bruk «Hør bare slutten» og sammenlign.','Listen to just the ending. Do the notes rise, fall or repeat? Use “Play just the ending” and compare.'], ending:['Høyr berre slutten','Hør bare slutten','Play just the ending'],
 incomplete:['Fyll inn alle plassane først.','Fyll inn alle plassene først.','Fill all the slots first.'], rebuilt:['Melodien stemmer! Du har bygd slutten du høyrde.','Melodien stemmer! Du har bygd slutten du hørte.','That matches! You rebuilt the ending you heard.'], retry:['Ikkje heilt enno. Høyr førebiletet og din melodi. Samanlikn éin tone om gongen.','Ikke helt ennå. Hør forbildet og din melodi. Sammenlign én tone om gangen.','Not quite yet. Play the reference and your melody. Compare one note at a time.'],
 fixed:['Fast tone','Fast tone','Fixed note'], slot:['Toneplass','Toneplass','Note slot'], empty:['Tom','Tom','Empty'], bar:['Takt','Takt','Bar'], save:['Lagre varianten','Lagre varianten','Save version'], saved:['Varianten er lagra på denne eininga.','Varianten er lagret på denne enheten.','Version saved on this device.'], changeFirst:['Endre minst éin av dei opne tonane for å lage din eigen variant.','Endre minst én av de åpne tonene for å lage din egen variant.','Change at least one editable note to make your own version.'], collection:['Dine variantar','Dine varianter','Your versions'], version:['Variant','Variant','Version'],
 reflection:['Kva endra seg då du endra slutten? Kva variant likar du best, og kvifor? Du kan tenkje over det utan å skrive noko.','Hva endret seg da du endret slutten? Hvilken variant liker du best, og hvorfor? Du kan tenke over det uten å skrive noe.','What changed when you changed the ending? Which version do you prefer, and why? Reflect without needing to write anything.'],
 support:['Tips brukt. «Utforska» betyr at du har gjennomført oppgåva, ikkje at du må kunne henne utan hjelp.','Tips brukt. «Utforsket» betyr at du har gjennomført oppgaven, ikke at du må kunne den uten hjelp.','Hint used. “Explored” means you completed the task, not that you must do it without support.'],
 storage:['Lagring er ikkje tilgjengeleg. Du kan øve, men nytt arbeid kan gå tapt når du lukkar sida.','Lagring er ikke tilgjengelig. Du kan øve, men nytt arbeid kan gå tapt når du lukker siden.','Saving is unavailable. You can practise, but new work may be lost when you close this page.'],
 corrupt:['Tidlegare temaarbeid kunne ikkje lesast. Det er ikkje overskrive. Du kan framleis øve.','Tidligere temaarbeid kunne ikke leses. Det er ikke overskrevet. Du kan fortsatt øve.','Previous theme work could not be read and has not been overwritten. You can still practise.'],
 local:['Framgang og opptil 20 variantar blir lagra i denne nettlesaren. Dei nyaste blir tekne vare på. Bruk Eksporter under Mi øving for å ta sikkerheitskopi.','Fremgang og opptil 20 varianter lagres i denne nettleseren. De nyeste beholdes. Bruk Eksporter under Min øving for å ta sikkerhetskopi.','Progress and up to 20 versions are saved in this browser. The newest are kept. Use Export under My practice to make a backup.'],
 next:['Vil du ha meir utfordring? Vel eit høgare nivå. Du kan alltid gå tilbake.','Vil du ha mer utfordring? Velg et høyere nivå. Du kan alltid gå tilbake.','Want more challenge? Choose a higher level. You can always move back.']
};
Object.assign(thWords,{
 ready:['Klar til å lytte','Klar til å lytte','Ready to listen'], source:['Lydkjelde','Lydkilde','Audio source'],
 pulse:['Toneplass i melodien','Toneplass i melodien','Note position in the melody'],
 tabListen:['Lytt','Lytt','Listen'], tabBuild:['Bygg','Bygg','Build'], tabCreate:['Skap','Skap','Create'],
 themeProgress:['Temaarbeidet ditt','Temaarbeidet ditt','Your theme progress'],
 completed:['aktivitetar utforska på tvers av nivå','aktiviteter utforsket på tvers av nivå','activities explored across levels'],
 progressNote:['Dette viser kva du har utforska, ikkje ein prøvekarakter.','Dette viser hva du har utforsket, ikke en prøvekarakter.','This shows what you have explored, not a test grade.'],
 noVersions:['Ingen temavariantar enno. Prøv å lage din eigen slutt.','Ingen temavarianter ennå. Prøv å lage din egen slutt.','No theme versions yet. Try creating your own ending.'],
 openVersion:['Opne','Åpne','Open'], alreadySaved:['Denne varianten er allereie lagra.','Denne varianten er allerede lagret.','This version is already saved.'],

 playing:['Spelar {name}. Vent til slutten. Bruk Stopp for å avbryte.','Spiller {name}. Vent til slutten. Bruk Stopp for å avbryte.','Playing {name}. Wait for the ending. Use Stop to cancel.'],
 finished:['Avspelinga er ferdig. No kan du samanlikne eller velje eit svar.','Avspillingen er ferdig. Nå kan du sammenligne eller velge et svar.','Playback finished. You can now compare or choose an answer.'],
 excerpt:['Høyr berre slutten','Hør bare slutten','Play ending only']
});
Object.assign(thWords,{"audioGuide": ["Heile melodiar: først ein C-durakkord, så ein kort pause og åtte meloditonar. Svar berre på melodien. «Berre slutten» hoppar over akkorden og pausen.", "Hele melodier: først en C-durakkord, så en kort pause og åtte meloditoner. Svar bare på melodien. «Bare slutten» hopper over akkorden og pausen.", "Full melodies: first a C major chord, then a short pause and eight melody notes. Answer only about the melody. “Ending only” skips the chord and pause."], "phaseIntro": ["Innleiing: C-durakkord. Melodien kjem etter pausen.", "Innledning: C-durakkord. Melodien kommer etter pausen.", "Introduction: C major chord. The melody follows the pause."], "phasePause": ["Kort pause — melodien kjem no.", "Kort pause — melodien kommer nå.", "Short pause — the melody is next."], "phaseMelody": ["No kjem melodien: {name}.", "Nå kommer melodien: {name}.", "Now playing the melody: {name}."], "phaseEnding": ["Spelar berre slutten: {name}.", "Spiller bare slutten: {name}.", "Playing only the ending: {name}."], "phaseContext": ["Spelar berre C-durakkorden, utan melodi.", "Spiller bare C-durakkorden, uten melodi.", "Playing only the C major chord, without a melody."], "listenLevel1": ["Finn den like melodien. Berre den siste tonen kan vere ulik.", "Finn den like melodien. Bare den siste tonen kan være ulik.", "Find the matching melody. Only the last note can differ."], "listenLevel2": ["Finn den like melodien. Éin av dei to siste tonane kan vere ulik.", "Finn den like melodien. Én av de to siste tonene kan være ulik.", "Find the matching melody. One of the last two notes can differ."], "listenLevel3": ["Finn den like melodien. Finn så plassen til den endra tonen i det andre alternativet.", "Finn den like melodien. Finn så plassen til den endrede tonen i det andre alternativet.", "Find the matching melody. Then locate the changed note in the other option."], "listenLevel4": ["Finn den like melodien, plassen til den endra tonen og om han er høgare eller lågare enn førebiletet.", "Finn den like melodien, plassen til den endrede tonen og om den er høyere eller lavere enn forbildet.", "Find the matching melody, locate the changed note, and say whether it is higher or lower than the reference."], "locate": ["I alternativ {name}: Kva toneplass er endra?", "I alternativ {name}: Hvilken toneplass er endret?", "In option {name}: which note position changed?"], "direction": ["Er den endra tonen høgare eller lågare enn same toneplass i førebiletet?", "Er den endrede tonen høyere eller lavere enn samme toneplass i forbildet?", "Is the changed note higher or lower than the note at the same position in the reference?"], "higher": ["Høgare", "Høyere", "Higher"], "lower": ["Lågare", "Lavere", "Lower"], "compareCue": ["Lytt til førebiletet og alternativet éin tone om gongen. Bruk tala 1–8 til å finne skilnaden.", "Lytt til forbildet og alternativet én tone om gangen. Bruk tallene 1–8 til å finne forskjellen.", "Compare the reference and option one note at a time. Use positions 1–8 to locate the difference."], "directionCue": ["Spel førebiletet og det endra alternativet igjen. Samanlikn tonehøgda på plassen du fann.", "Spill forbildet og det endrede alternativet igjen. Sammenlign tonehøyden på plassen du fant.", "Replay the reference and changed option. Compare the pitch at the position you found."], "finish": ["Ferdig for no", "Ferdig for nå", "Finish for now"], "savedFinish": ["Varianten er lagra. Du kan avslutte no eller halde fram med å utforske.", "Varianten er lagret. Du kan avslutte nå eller fortsette å utforske.", "Your version is saved. You can finish now or keep exploring."]});
Object.assign(thWords,{foundPosition:['Endra toneplass: {n}','Endret toneplass: {n}','Changed note position: {n}']});
function thText(key){const lang=document.documentElement.lang;return thWords[key][lang==='en'?2:lang==='nb'?1:0]}
const TH_KEY='musikkverkstad-theme-ending-v1', TH_POOL=[60,62,64,67,69], TH_BASE=[60,62,64,67,60,62,64,60];
function thValid(d){
 if(!d||d.version!==1||!d.done||typeof d.done!=='object'||Array.isArray(d.done)||!Array.isArray(d.creations)||d.creations.length>20)throw Error('Invalid theme data');
 for(const [k,v]of Object.entries(d.done))if(!/^(listen|rebuild|create)-[1-4]$/.test(k)||v!==true)throw Error('Invalid theme progress');
 for(const c of d.creations)if(!c||!Number.isInteger(c.level)||c.level<1||c.level>4||!Array.isArray(c.notes)||c.notes.length!==8||c.notes.some(n=>!TH_POOL.includes(n))||c.notes.slice(0,8-c.level).some((n,i)=>n!==TH_BASE[i]))throw Error('Invalid theme melody');
 return d;
}
let thStore={version:1,done:{},creations:[]},thSaveOK=true,thCorrupt=false;
try{const raw=localStorage.getItem(TH_KEY);if(raw)thStore=thValid(JSON.parse(raw))}catch(e){thSaveOK=false;thCorrupt=true}
let thState={screen:'welcome',playing:null,playMessage:'',playSlot:-1,playSource:'',success:false,level:1,section:'listen',question:null,guess:[],selected:7,feedback:'',hinted:false,heard:{}};
function thPersist(){if(thCorrupt)return false;try{localStorage.setItem(TH_KEY,JSON.stringify(thStore));thSaveOK=true;return true}catch(e){thSaveOK=false;return false}}
function thNew(){thState.level=scLevel('theme',thState.level);
 const start=8-thState.level, target=TH_BASE.slice();
 for(let i=start;i<8;i++)target[i]=TH_POOL[Math.floor(Math.random()*TH_POOL.length)];
 const changed=target.slice(),index=start+Math.floor(Math.random()*thState.level),choices=TH_POOL.filter(n=>n!==changed[index]);changed[index]=choices[Math.floor(Math.random()*choices.length)];
 const odd=Math.random()<.5?'A':'B';thState.question={target,odd,index,direction:changed[index]>target[index]?'higher':'lower',A:odd==='A'?changed:target.slice(),B:odd==='B'?changed:target.slice()};
 thState.matched=false;thState.located=false;thState.savedFinish=false;thState.success=false;thState.guess=thState.section==='create'?TH_BASE.slice():target.map((n,i)=>i<start?n:null);thState.selected=start;thState.feedback='';thState.hinted=false;thState.heard={};
}
function thDraw(){if(typeof nvRemember==='function'){nvRemember();nvUpdate()}
 const active=document.activeElement, app=$('app');
 const owned=!!active&&!!app.contains?.(active);
 const action=owned?active.dataset?.themeAction:null,value=owned?active.dataset?.themeValue:null;
 const stopped=owned&&active.hasAttribute?.('data-stop');
 if(route==='theme')app.innerHTML=themeView();else if(route==='progress')render();
 if(owned){
 const buttons=Array.from(app.querySelectorAll?.('button')||[]);
 const same=buttons.find(b=>!b.disabled&&((action&&b.dataset.themeAction===action&&b.dataset.themeValue===value)||(stopped&&b.hasAttribute('data-stop'))));
 const followup=action==='answer'?'location':action==='location'?'direction':null;
 const next=same||(followup&&buttons.find(b=>!b.disabled&&b.dataset.themeAction===followup))||buttons.find(b=>!b.disabled&&b.hasAttribute('data-stop'));
 next?.focus({preventScroll:true});
 }
}
function thStopPlayback(){
 const changed=thState.playing!==null||thState.playSlot!==-1;
 thState.playing=null;thState.playSlot=-1;thState.playMessage='';
 if(changed)thDraw();
}
function thPlaybackView(){
 const s=thState;
 return `<div class="th-playback" data-th-playback><div class="th-playback-head"><span>${thText('source')}: <strong>${esc(s.playSource||'—')}</strong></span><span class="th-small">4/4</span></div><div class="th-playhead" aria-label="${thText('pulse')}">${Array.from({length:8},(_,i)=>`<span data-th-beat="${i}" class="th-beat${s.playSlot===i?' is-current':''}" ${s.playSlot===i?'aria-current="true"':''}>${i+1}</span>`).join('')}</div><p class="th-small">${thText('audioGuide')}</p><p data-th-message role="status" aria-live="polite">${esc(s.playMessage||thText('ready'))}</p></div>`;
}
function thUpdateMessage(){document.querySelectorAll('[data-th-message]').forEach(el=>el.textContent=thState.playMessage)}
function thPaintPlayback(){
 document.querySelectorAll('[data-th-playback]').forEach(panel=>{
 panel.querySelectorAll('[data-th-beat]').forEach(cell=>{
 const active=Number(cell.dataset.thBeat)===thState.playSlot;
 cell.classList.toggle('is-current',active);
 if(active)cell.setAttribute('aria-current','true');else cell.removeAttribute('aria-current');
 });
 });
}
async function thPlay(notes,label='',excerpt=false,contextOnly=false){
 const events=contextOnly?[{notes:[48,52,55],dur:3}]:excerpt?notes.map(n=>({notes:n,dur:1})):[{notes:[48,52,55],dur:2},{notes:null,dur:1},...notes.map(n=>({notes:n,dur:1}))];
 const played=await sequence(events,96);
 if(!played)return false;
 const token=audioRun,question=thState.question;
 thState.playing=label||thText('mine');thState.playSource=thState.playing;thState.playSlot=-1;
 thState.playMessage=thText(contextOnly?'phaseContext':excerpt?'phaseEnding':'phaseIntro').replace('{name}',thState.playing);thDraw();
 if(!contextOnly&&!excerpt)timers.push(setTimeout(()=>{
 if(token!==audioRun||question!==thState.question)return;
 thState.playMessage=thText('phasePause');thUpdateMessage();
 },1350));
 if(!contextOnly)notes.forEach((note,i)=>timers.push(setTimeout(()=>{
 if(token!==audioRun||question!==thState.question)return;
 thState.playSlot=(excerpt?8-notes.length:0)+i;if(i===0){thState.playMessage=thText(excerpt?'phaseEnding':'phaseMelody').replace('{name}',thState.playing);thUpdateMessage()}thPaintPlayback();
 },100+((excerpt?0:3)+i)*625)));
 timers.push(setTimeout(()=>{if(token!==audioRun||question!==thState.question)return;thState.playing=null;thState.playSlot=-1;thState.playMessage=thText('finished');thDraw()},150+events.reduce((n,e)=>n+e.dur,0)*625));
 return true;
}
function thProgressView(){
 const count=Object.keys(thStore.done).length;
 return `<section class="th-theme th-progress"><p class="th-eyebrow">${thText('title')}</p><h3>${thText('themeProgress')}</h3><p><strong>${count} / 12</strong> ${thText('completed')}</p><p class="th-small">${thText('progressNote')}</p><div class="th-completions">${['listen','rebuild','create'].map(m=>`<div><strong>${thText(m)}</strong><span>${[1,2,3,4].map(l=>`<span class="th-chip ${thStore.done[m+'-'+l]?'is-done':''}" aria-label="${thText('level')} ${l}${thStore.done[m+'-'+l]?', '+thText('explored'):''}">${l}${thStore.done[m+'-'+l]?' ✓':''}</span>`).join('')}</span></div>`).join('')}</div>${thPlaybackView()}<button type="button" data-stop>■ ${thText('stop')}</button><h4>${thText('collection')}</h4>${thStore.creations.length?thStore.creations.map((c,i)=>`<div class="th-saved"><span>${thText('version')} ${i+1} · ${thText('level')} ${c.level}</span><div class="th-controls">${thButton('saved','▶ '+thText('play'),i)}${thButton('open-saved',thText('openVersion'),i)}</div></div>`).join(''):`<p>${thText('noVersions')}</p>`}</section>`;
}
function thDone(){thStore.done[thState.section+'-'+thState.level]=true;thPersist()}
function thButton(action,label,value='',extra=''){if(['saved','open-saved'].includes(action)&&(!scRouteAllowed('theme')||(action==='open-saved'&&!scLevels('theme').includes(thStore.creations[Number(value)]?.level))))extra+=' disabled';if((thState.playing!==null&&['play','excerpt','demo','context','saved','answer','location','direction'].includes(action))||((thState.success||thState.matched)&&action==='answer'))extra+=' disabled';return `<button type="button" data-theme-action="${action}" data-theme-value="${value}" ${extra}>${label}</button>`}
function themeView(){
 if(!thState.question)thNew();const s=thState,start=8-s.level,q=s.question;
 const style=`<style>.th-theme{max-width:950px;margin:auto}.th-theme button{min-height:48px;min-width:48px;touch-action:manipulation}.th-theme button[aria-pressed=true]{outline:3px solid #27765a;outline-offset:2px}.th-theme button:disabled{opacity:.7;cursor:default}.th-controls{display:flex;flex-wrap:wrap;gap:10px;margin:16px 0}.th-bars{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin:20px 0}.th-bar{padding:14px;border:2px solid #83988c;border-radius:14px;background:var(--panel);color:var(--text)}.th-slots{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin-top:12px}.th-slots button[aria-pressed=true]{background:#f2c663;color:#17232c;outline:3px solid #fff}.th-primary{background:#f2c663!important;color:#17232c!important;font-weight:800;font-size:1.1rem;padding:18px 24px!important}.th-pairs{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;margin:18px 0}.th-pair{border:2px solid #83988c;border-radius:16px;padding:16px;background:var(--panel)}.th-pair button{display:block;width:100%;margin:8px 0}.th-welcome{padding:30px 0}.th-slots button{padding:10px 2px}.th-feedback{padding:14px;background:var(--panel);color:var(--text);border-radius:12px;min-height:24px}.th-reflect{padding:16px;border-left:4px solid #b77a41}.th-small{font-size:.88rem}.th-warning{background:var(--panel);color:var(--text);padding:12px;border-radius:10px}@media(max-width:560px){.th-bars{grid-template-columns:1fr}.th-theme h1{font-size:1.8rem}}</style>`;
 const chrome=`<div class="th-controls"><button type="button" data-go="home">← ${thText('back')}</button><button type="button" data-stop>■ ${thText('stop')}</button></div>`;
 const modes=['listen','rebuild','create'];
 const choices=`<div class="th-controls">${scLevels('theme').map(l=>thButton('level',thText('level')+' '+l,l,`aria-pressed="${s.level===l}"`)).join('')}</div><p>${thText('range')} <strong>${s.level}</strong> ${thText('notes')}</p><div class="th-modecards">${modes.map(m=>thButton('section',`<span aria-hidden="true">${({listen:'◉',rebuild:'▦',create:'✦'})[m]}</span><strong>${thText(({listen:'tabListen',rebuild:'tabBuild',create:'tabCreate'})[m])}</strong>${thStore.done[m+'-'+s.level]?'<small>✓ '+thText('explored')+'</small>':''}`,m,`class="th-mode th-mode-${m}" aria-pressed="${s.section===m}"`)).join('')}</div>`;
 if(s.screen==='welcome')return `${style}<section class="th-theme">${chrome}${choices}${thPlaybackView()}<div class="th-welcome"><p>${thText('title')}</p><h1>${thText('welcome')}</h1><p>${thText('welcomeHelp')}</p><div class="th-controls">${thButton('quick',thText('quick'),'', 'class="th-primary"')}</div>${thButton('explore',thText('explore'))}</div></section>`;
 let body='';
 if(s.section==='listen'){
 body=`<p>${thText('listenHelp')}</p><p><strong>${thText('listenLevel'+s.level)}</strong></p><h3>${thText('step1')}</h3><div class="th-controls">${thButton('play','▶ '+thText('reference'),'reference','class="th-primary"')}${thButton('excerpt',thText('excerpt'),'reference')}</div>${s.screen!=='quick'||s.heard.reference?`<h3>${thText('step2')}</h3><div class="th-pairs">${['A','B'].map(k=>`<div class="th-pair"><strong>${k}</strong>${thButton('play','▶ '+thText('play')+' '+k,k)}${thButton('excerpt',thText('excerpt')+' '+k,k)}${thButton('answer',thText('choose')+' '+k,k)}</div>`).join('')}</div>`:''}`;
 if(s.matched&&!s.success){
 body+=`<p role="status">${thText('locate').replace('{name}',q.odd)}</p><div class="th-controls">${Array.from({length:s.level},(_,i)=>i+8-s.level).map(i=>thButton('location',String(i+1),i,s.located?'disabled':'')).join('')}</div>`;
 if(s.located&&s.level===4)body+=`<p><strong>${thText('foundPosition').replace('{n}',q.index+1)}</strong></p><p>${thText('direction')}</p><div class="th-controls">${['higher','lower'].map(d=>thButton('direction',thText(d),d)).join('')}</div>`;
 }
 }else{
 const notes=s.guess;body=`<p>${thText(s.section==='rebuild'?'rebuildHelp':'createHelp')}</p><div class="th-controls">${thButton('play','▶ '+thText(s.section==='create'?'original':'reference'),s.section==='create'?'original':'reference')}${thButton('play','▶ '+thText('mine'),'mine')}</div><div class="th-bars">${[0,1].map(bar=>`<div class="th-bar"><strong>${thText('bar')} ${bar+1} · 4/4</strong><div class="th-slots">${notes.slice(bar*4,bar*4+4).map((n,j)=>{const i=bar*4+j;return thButton('slot',n===null?'?':esc(noteName(n)),i,`${i<start?'disabled':''} aria-pressed="${s.selected===i}" aria-label="${thText('slot')} ${i+1}: ${n===null?thText('empty'):esc(noteName(n))}${i<start?', '+thText('fixed'):''}"`) }).join('')}</div></div>`).join('')}</div><p><strong>${thText('forSlot')} ${s.selected+1}</strong></p><div class="th-controls" aria-label="${thText('choose')}">${TH_POOL.map(n=>thButton('note',esc(noteName(n)),n)).join('')}</div><div class="th-controls">${s.section==='rebuild'?thButton('check',thText('check')):thButton('save',thText('save'))}</div>`;
 }
 const finish=s.savedFinish&&thSaveOK?`<p role="status">${thText('savedFinish')}</p><button data-go="home">${thText('finish')}</button>`:'';
 const success=s.success?`<div class="th-controls">${thButton('another',thText('another'))}${scNextLevel('theme',s.level)!==null?thButton('harder',thText('harder')):''}${thButton('own',thText('own'))}${thButton('explore',thText('explore'))}</div>`:'';
 if(s.screen==='quick')return `${style}<section class="th-theme">${chrome}${choices}${thPlaybackView()}<p>${thText('title')} · ${thText('level')} ${s.level}</p><h1>${thText('listen')}</h1>${body}<p class="th-feedback" role="status" aria-live="polite">${s.feedback||' '}</p>${success}${finish}${!thSaveOK?`<p class="th-warning">${thText(thCorrupt?'corrupt':'storage')}</p>`:''}<div class="th-controls">${thButton('hint',thText('hint'))}${s.hinted?thButton('play','▶ '+thText('ending'),'ending'):''}</div>${s.hinted?`<p>${thText('hintText')}</p>`:''}<div class="th-controls">${thButton('explore',thText('explore'))}</div></section>`;
 const help=s.section==='create'?`<p class="th-reflect">${thText('reflection')}</p>`:`<div class="th-controls">${thButton('hint',thText('hint'))}${s.hinted?thButton('play','▶ '+thText('ending'),'ending'):''}</div>${s.hinted?`<p>${thText('hintText')}</p><small>${thText('support')}</small>`:''}`;
 return `${style}<section class="th-theme"><div class="th-controls"><button type="button" data-go="home">← ${thText('back')}</button><button type="button" data-stop>■ ${thText('stop')}</button></div>${thPlaybackView()}<h1>${thText('title')}</h1><p>${thText('intro')}</p><p>${thText('guide')}</p>${choices}<div class="th-controls">${thButton('context','♫ '+thText('context'))}</div><small>${thText('contextHelp')}</small><h2>${thText(s.section)}</h2><details><summary>${thText('demo')}</summary><p>${thText('demoHelp')}</p><div class="th-controls">${thButton('demo','▶ '+thText('play')+' A','original')}${thButton('demo','▶ '+thText('play')+' B','changed')}</div></details>${body}${help}<p class="th-feedback" role="status" aria-live="polite">${s.feedback||' '}</p>${success}${finish}${!thSaveOK?`<p class="th-warning" role="alert">${thText(thCorrupt?'corrupt':'storage')}</p>`:''}<div class="th-controls">${s.section!=='create'?thButton('new',thText('new')):''}</div><p class="th-small">${thText('next')}</p>${s.section==='create'&&thStore.creations.length?`<h3>${thText('collection')}</h3><div class="th-controls">${thStore.creations.map((c,i)=>thButton('saved','▶ '+thText('version')+' '+(i+1)+' · '+thText('level')+' '+c.level,i)).join('')}</div>`:''}<p class="th-small">${thText('local')}</p></section>`;
}
async function thAction(action,value){
 if(!scRouteAllowed('theme'))return;
 const s=thState,q=s.question,start=8-s.level;
 if(s.playing!==null&&['play','excerpt','demo','context','saved','answer','location','direction'].includes(action))return;
 if(action==='excerpt'){const notes=value==='reference'?q.target:q[value];if(Array.isArray(notes)){const played=await thPlay(notes.slice(8-s.level),value==='reference'?thText('reference'):value,true);if(played){s.heard[value]=true;thDraw()}}return}
 if(['quick','explore','own','harder','another'].includes(action)){
 stopAudio();
 if(action==='quick'){s.screen='quick';s.section='listen';thNew()}
 if(action==='explore')s.screen='explore';
 if(action==='own'){s.screen='explore';s.section='create';thNew()}
 if(action==='harder'){s.level=scNextLevel('theme',s.level)??s.level;thNew()}
 if(action==='another')thNew();
 thDraw();return;
 }
 if(action==='level'||action==='section'||action==='new'){stopAudio();if(action==='level'){const n=Number(value);if(!scLevels('theme').includes(n))return;s.level=n}if(action==='section'){if(!['listen','rebuild','create'].includes(value))return;s.screen='explore';s.section=value}thNew();thDraw();return}
 if(action==='demo'){const notes=TH_BASE.slice();if(value==='changed')notes[7]=69;await thPlay(notes,thText('demo')+' '+(value==='changed'?'B':'A'));return}
 if(action==='context'){await thPlay([],thText('context'),false,true);return}
 if(action==='saved'){const c=thStore.creations[Number(value)];if(c)await thPlay(c.notes,thText('version')+' '+(Number(value)+1));return}
 if(action==='open-saved'){
 const c=thStore.creations[Number(value)];if(!c||!scLevels('theme').includes(c.level))return;
 stopAudio();s.screen='explore';s.section='create';s.level=c.level;thNew();s.guess=c.notes.slice();go('theme');return;
 }
 if(action==='play'){
 const notes=value==='reference'?q.target:value==='original'?TH_BASE:value==='mine'?s.guess:value==='ending'?q.target.slice(start):q[value];if(!Array.isArray(notes))return;
 if(notes.includes(null)){s.feedback=thText('incomplete');thDraw();return}
 const played=await thPlay(notes,({reference:thText('reference'),original:thText('original'),mine:thText('mine'),ending:thText('ending')})[value]||value,value==='ending');if(played&&thState===s&&s.question===q){s.heard[value]=true;thDraw()}return;
 }
 if(action==='slot'){const i=Number(value);if(Number.isInteger(i)&&i>=start&&i<8)s.selected=i}
 if(action==='note'){const n=Number(value);if(s.section==='listen'||!TH_POOL.includes(n))return;s.guess[s.selected]=n;s.feedback='';s.success=false;s.savedFinish=false;if(s.section==='rebuild'){const next=s.guess.findIndex((v,i)=>i>s.selected&&v===null);const first=s.guess.findIndex((v,i)=>i>=start&&v===null);if(next>=0)s.selected=next;else if(first>=0)s.selected=first}sequence([{notes:n,dur:1}],96)}
 if(action==='hint'){s.hinted=true;s.feedback=thText('hintText')}
 if(action==='answer'&&s.section==='listen'){
 if(s.success||s.matched||!['A','B'].includes(value))return;
 if(value!==q.odd){s.matched=true;if(s.level<3){s.success=true;s.feedback=value+' — '+thText('right');thDone()}else s.feedback=thText('locate').replace('{name}',q.odd)}else s.feedback=thText('wrong');
 }
 if(action==='location'&&s.section==='listen'&&s.matched&&!s.success&&!s.located){
 if(Number(value)===q.index){s.located=true;if(s.level===3){s.success=true;s.feedback=thText('right');thDone()}else s.feedback=thText('direction')}else s.feedback=thText('compareCue');
 }
 if(action==='direction'&&s.section==='listen'&&s.matched&&s.located&&!s.success&&s.level===4){
 if(value===q.direction){s.success=true;s.feedback=thText('right');thDone()}else s.feedback=thText('directionCue');
 }
 if(action==='check'&&s.section==='rebuild'){
 if(s.guess.includes(null))s.feedback=thText('incomplete');else if(s.guess.every((n,i)=>n===q.target[i])){s.success=true;s.feedback=thText('rebuiltCount').replace('{n}',s.level);thDone()}else s.feedback=thText('retry');
 }
 if(action==='save'&&s.section==='create'){
 s.savedFinish=false;
 if(s.guess.every((n,i)=>n===TH_BASE[i]))s.feedback=thText('changeFirst');else if(thStore.creations.some(c=>c.level===s.level&&c.notes.every((n,i)=>n===s.guess[i]))){if(!thSaveOK)thPersist();s.feedback=thSaveOK?thText('alreadySaved'):thText('storage')}else{thStore.creations.push({level:s.level,notes:s.guess.slice()});thStore.creations=thStore.creations.slice(-20);thDone();s.feedback=thSaveOK?thText('saved'):thText('storage')}
 if(thSaveOK&&thStore.creations.some(c=>c.level===s.level&&c.notes.every((n,i)=>n===s.guess[i])))s.savedFinish=true;
 }
 thDraw();
}
document.addEventListener('click',event=>{const button=event.target.closest('[data-theme-action]');if(!button||button.disabled)return;thAction(button.dataset.themeAction,button.dataset.themeValue).catch(()=>{thState.feedback=thText('audioError');thDraw()})});
