/* Backward-compatible progress extension; no pupil identifiers. */
function extraEmpty(){return {puzzle:{level:1,done:0,first:0,supported:0},notation:{level:1,done:0,first:0,supported:0}}}
function extraValid(v){
 if(v===undefined)return extraEmpty();
 if(!v||typeof v!=='object'||Array.isArray(v)||Object.keys(v).some(k=>!['puzzle','notation'].includes(k)))throw Error('Invalid activity progress');
 for(const k of ['puzzle','notation']){const s=v[k];if(!s||typeof s!=='object'||Array.isArray(s)||Object.keys(s).some(x=>!['level','done','first','supported'].includes(x))||!Number.isInteger(s.level)||s.level<1||s.level>4)throw Error('Invalid activity level');
 for(const n of ['done','first','supported'])if(!Number.isInteger(s[n])||s[n]<0||s[n]>1000000)throw Error('Invalid activity count');
 if(s.first+s.supported>s.done)throw Error('Invalid activity totals');
 }return v;
}
const extraWords={
 firstPuzzle:['rette på første sjekk','riktige på første sjekk','correct on first check'],
 title:['Fleire aktivitetar','Flere aktiviteter','More activities'],
 done:['fullførte rundar','fullførte runder','completed rounds'],
 first:['rette på første sjekk utan notenamn','riktige på første sjekk uten notenavn','correct on first check without note names'],
 supported:['fullførte med notenamn som støtte','fullførte med notenavn som støtte','completed with note-name support'],
 note:['Dette viser øving, ikkje meistring. Å høyre om att er lov. Uferdige rundar blir ikkje lagra.','Dette viser øving, ikke mestring. Du kan høre om igjen. Uferdige runder lagres ikke.','This records practice, not mastery. Replaying is allowed. Unfinished rounds are not saved.'],
 local:['Fullførte rundar og valt nivå blir lagra i denne nettlesaren og er med i Eksporter/Importer. Den uferdige runden blir ikkje lagra.','Fullførte runder og valgt nivå lagres i denne nettleseren og er med i Eksporter/Importer. Den uferdige runden lagres ikke.','Completed rounds and your level are saved in this browser and included in Export/Import. The unfinished round is not saved.'],
 error:['Framgangen kunne ikkje lagrast. Eksporter før du lukkar sida.','Fremgangen kunne ikke lagres. Eksporter før du lukker siden.','Progress could not be saved. Export before closing the page.'],
 legacy:['Denne eldre kopien har ikkje framgang for Melodipuslespel eller Lyd og notar. Import vil setje desse tala til null. Vil du halde fram?','Denne eldre kopien har ikke fremgang for Melodipuslespill eller Lyd og noter. Import vil sette disse tallene til null. Vil du fortsette?','This older backup has no Phrase Puzzle or Notation Match progress. Import will reset those counts to zero. Continue?']
};
function extraText(k){return extraWords[k][document.documentElement.lang==='en'?2:document.documentElement.lang==='nb'?1:0]}
function extraLevel(key,level){data.extraPractice[key].level=level;save()}
function extraComplete(key,state){
 if(state.recorded)return;
 const s=data.extraPractice[key];if(s.done>=1000000)return;
 state.recorded=true;s.done++;
 if(state.supportUsed)s.supported++;else if(state.checks===1)s.first++;
 save();
}
function extraView(){return `<section class="stage" style="margin-top:24px"><h3>${extraText('title')}</h3><p>${extraText('note')}</p><div class="cards">${['puzzle','notation'].map(k=>{const s=data.extraPractice[k],name=k==='puzzle'?ppText('title'):nmText('title');return `<article class="card"><h3>${name}</h3><p>${s.done} ${extraText('done')}</p><p>${s.first} ${extraText(k==='puzzle'?'firstPuzzle':'first')}</p>${k==='notation'?`<p>${s.supported} ${extraText('supported')}</p>`:''}<p>${nmText('level')} ${scLevel(k,s.level)}</p><button data-go="${k==='puzzle'?'puzzle':'notation'}">${name} →</button></article>`}).join('')}</div></section>`}
