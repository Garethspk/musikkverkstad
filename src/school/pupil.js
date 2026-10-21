/* Read-only pupil configuration: no editor, settings storage or pupil-data writes. */
function scLevels(id){return schoolSettings.levels[id] || []}
function scLevel(id,preferred){const enabled=scLevels(id);return enabled.includes(preferred)?preferred:enabled[0]}
function scNextLevel(id,current){return scLevels(id).find(level=>level>current) ?? null}
function scRouteAllowed(id){if(SchoolConfig.registry.some(item=>item.id===id)&&!SchoolConfig.availableRegistry.some(item=>item.id===id))return false;return !['theme','groove','conversation'].includes(id)||schoolSettings.themes.includes(id)}
function scThemeIndices(){return schoolSettings.themes.map(id=>['theme','groove','conversation'].indexOf(id))}
function scBrand(){
 if(schoolSettings.schoolName){const name=document.querySelector('.brand-name');name.textContent=schoolSettings.schoolName;name.parentElement.setAttribute('aria-label',schoolSettings.schoolName+' · Musikkverkstad');const identity=document.createElement('p');identity.id='schoolIdentity';identity.textContent=schoolSettings.schoolName;identity.style.cssText='max-width:1144px;margin:12px auto 0;padding:0 24px;overflow-wrap:anywhere;color:var(--muted);font-size:14px';document.querySelector('header').insertAdjacentElement('afterend',identity);}
 if(schoolSettings.logo){const logo=document.createElement('img');logo.src=schoolSettings.logo;logo.alt='';logo.width=38;logo.height=38;logo.style.objectFit='contain';logo.addEventListener('error',()=>{logo.remove();document.querySelector('.logo').hidden=false;},{once:true});document.querySelector('.brand').prepend(logo);document.querySelector('.logo').hidden=true;}
 if(schoolSettings.colourPreset!=='original')document.documentElement.style.setProperty('--green',SchoolConfig.presets[schoolSettings.colourPreset].accent);
}
if(schoolSettings.schoolName||schoolSettings.logo||schoolSettings.colourPreset!=='original')scBrand();
