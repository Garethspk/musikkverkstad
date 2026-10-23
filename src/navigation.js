/* Remember navigation only: never infer ability or retain unfinished answers. */
const NV_KEY='musikkverkstad-location-v1';
const nvWords={
 theme:['Tema','Tema','Theme'],previous:['Førre tema','Forrige tema','Previous theme'],next:['Neste tema','Neste tema','Next theme'],choose:['Vel tema','Velg tema','Choose theme'],
 start:['Start her','Start her','Start here'],resume:['Hald fram','Fortsett','Continue'],explore:['Utforsk temaa','Utforsk temaene','Explore themes'],
 fresh:['Hald fram opnar same aktivitet og nivå på nytt. Du kan alltid velje eit anna tema eller nivå.','Fortsett åpner samme aktivitet og nivå på nytt. Du kan alltid velge et annet tema eller nivå.','Continue opens the same activity and level again. You can always choose another theme or level.'],
 first:['Start med ei kort lytteoppgåve på nivå 1, eller vel eit tema sjølv.','Start med en kort lytteoppgave på nivå 1, eller velg et tema selv.','Start with a short level 1 listening task, or choose a theme yourself.'],
 storage:['Siste aktivitet kan ikkje lagrast her. Hald fram verkar berre i denne økta.','Siste aktivitet kan ikke lagres her. Fortsett virker bare i denne økten.','Your last activity cannot be saved here. Continue works only in this session.'],
 level:['nivå','nivå','level'],tools:['Verktøy og hjelp','Verktøy og hjelp','Tools and help']};
function nvText(k){return nvWords[k][document.documentElement.lang==='en'?2:document.documentElement.lang==='nb'?1:0]}
function nvValid(v){
 if(!v||typeof v!=='object'||Array.isArray(v)||Object.keys(v).some(k=>!['route','level','mode'].includes(k)))return null;
 if(!['theme','groove','conversation','form','rhythm','melody','harmony','puzzle','notation','create'].includes(v.route)||!Number.isInteger(v.level)||v.level<1||v.level>4)return null;
 const modes=v.route==='theme'?['listen','rebuild','create']:v.route==='groove'?['listen','repair','create']:v.route==='form'?['puzzle','build','create']:v.route==='conversation'?['listen','build','create']:null;
 if(modes?!modes.includes(v.mode):v.mode!==undefined)return null;
 if(v.route==='create'&&v.level!==1)return null;
 if(!scRouteAllowed(v.route))return null;
 return {route:v.route,level:scLevel(v.route,v.level),...(modes?{mode:v.mode}:{})};
}
let nvLast=null,nvSaveOK=true,nvSelected=0;
try{const raw=localStorage.getItem(NV_KEY);if(raw)nvLast=nvValid(JSON.parse(raw))}catch(e){nvSaveOK=false}
if(nvLast?.route==='groove')nvSelected=1;
if(nvLast?.route==='conversation')nvSelected=2;
function nvRemember(){let value;
 if(route==='theme')value={route,level:thState.level,mode:thState.section};
 else if(route==='groove')value={route,level:gr.level,mode:gr.mode};
 else if(route==='conversation')value={route,level:cv.level,mode:cv.mode};
 else if(route==='form')value={route,level:fo.level,mode:fo.mode};
 else if(['rhythm','melody','harmony'].includes(route))value={route,level:data.levels[route]};
 else if(route==='puzzle')value={route,level:pp.level};
 else if(route==='notation')value={route,level:nm.level};
 else if(route==='create')value={route,level:1};
 if(!value)return;
 const valid=nvValid(value);if(!valid)return;
 const changed=JSON.stringify(nvLast)!==JSON.stringify(valid);nvLast=valid;
 if(['theme','groove','conversation'].includes(route))nvSelected=['theme','groove','conversation'].indexOf(route);
 if(changed)try{localStorage.setItem(NV_KEY,JSON.stringify(nvLast));nvSaveOK=true}catch(e){nvSaveOK=false}
}
function nvTitle(i){return i===0?thText('title'):i===1?grText('title'):cvText('title')}
let nvMarkup=null;
function nvUpdate(){if(!scThemeIndices().includes(nvSelected))nvSelected=scThemeIndices()[0];const host=$('themeNavigation');if(!host)return;const active=document.activeElement,focused=host.contains?.(active)?(active.id==='themeSelect'?'select':active.dataset?.nv):null;const markup=`<button data-nv="previous" aria-label="${nvText('previous')}" title="${nvText('previous')}" ${nvSelected===scThemeIndices()[0]?'disabled':''}>‹</button><label class="nv-select"><span aria-hidden="true">${nvText('theme')} 0${nvSelected+1} ▾</span><select id="themeSelect" aria-label="${nvText('choose')}">${scThemeIndices().map(i=>`<option value="${i}" ${i===nvSelected?'selected':''}>${nvText('theme')} 0${i+1} · ${nvTitle(i)}</option>`).join('')}</select></label><button data-nv="next" aria-label="${nvText('next')}" title="${nvText('next')}" ${nvSelected===scThemeIndices().at(-1)?'disabled':''}>›</button>`;if(nvMarkup===markup)return;host.innerHTML=markup;nvMarkup=markup;if(focused){const target=focused==='select'?$('themeSelect'):host.querySelector?.('[data-nv="'+focused+'"]');(target&&!target.disabled?target:$('themeSelect'))?.focus({preventScroll:true})}}
function nvHome(){return `<section class="nv-welcome"><div class="row"><button class="primary" data-nv="${nvLast?'continue':'start'}">${nvText(nvLast?'resume':'start')} →</button>${nvLast?`<button data-nv="start">${nvText('start')}</button>`:''}</div><p class="note">${nvText(nvLast?'fresh':'first').replace(/(nivå|level) 1/,'$1 '+scLevels(schoolSettings.themes[0])[0])}</p>${!nvSaveOK?`<p class="note" role="status">${nvText('storage')}</p>`:''}<details><summary>${nvText('explore')}</summary><div class="nv-theme-list">${scThemeIndices().map(i=>`<button data-nv="theme" data-nv-index="${i}">${nvText('theme')} 0${i+1} · ${nvTitle(i)}</button>`).join('')}</div></details></section>`}
function nvStart(){stopAudio();if(schoolSettings.themes[0]==='conversation'){cv.level=scLevels('conversation')[0];cv.mode='listen';cvNew();go('conversation');return}if(schoolSettings.themes[0]==='groove'){gr.level=scLevels('groove')[0];gr.mode='listen';grNew();go('groove');return}thState.screen='quick';thState.level=scLevels('theme')[0];thState.section='listen';thNew();go('theme')}
function nvContinue(){const v=nvValid(nvLast);if(!v){nvStart();return}stopAudio();
 if(v.route==='theme'){thState.screen='explore';thState.level=v.level;thState.section=v.mode;thNew()}
 else if(v.route==='groove'){gr.level=v.level;gr.mode=v.mode;grNew()}
 else if(v.route==='conversation'){cv.level=v.level;cv.mode=v.mode;cvNew()}
 else if(v.route==='form'){fo.level=v.level;fo.mode=v.mode;foNew()}
 else if(v.route==='puzzle'){pp.level=v.level;ppNew()}
 else if(v.route==='notation'){nm.level=v.level;nmNew()}
 else if(['rhythm','melody','harmony'].includes(v.route))data.levels[v.route]=v.level;
 go(v.route);
}
function nvOpenTheme(i){if(!scThemeIndices().includes(i))return;nvSelected=i;go(['theme','groove','conversation'][i])}
function nvTheme(delta){const indices=scThemeIndices(),next=indices[indices.indexOf(nvSelected)+delta];if(next!==undefined)nvOpenTheme(next)}
document.addEventListener('click',e=>{const b=e.target.closest('[data-nv]');if(!b||b.disabled)return;const a=b.dataset.nv;if(a==='start')nvStart();if(a==='continue')nvContinue();if(a==='previous')nvTheme(-1);if(a==='next')nvTheme(1);if(a==='theme')nvOpenTheme(Number(b.dataset.nvIndex))});
document.addEventListener('change',e=>{if(e.target.id==='themeSelect')nvOpenTheme(Number(e.target.value))});
nvUpdate();
