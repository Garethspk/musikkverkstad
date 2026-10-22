/* Shared school settings contract. No pupil data, network calls or storage. */
(function(root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.SchoolConfig = api;
})(typeof globalThis === 'object' ? globalThis : this, function() {
  'use strict';
  const registry = Object.freeze([
    {id:'theme', name:'Tema 01 · Same start, ulik slutt', theme:true, implemented:true, prototypeEligible:true, pupilRelease:'BLOCKED', levels:[1,2,3,4]},
    {id:'groove', name:'Tema 02 · Finn grooven', theme:true, implemented:true, prototypeEligible:true, pupilRelease:'BLOCKED', levels:[1,2,3,4]},
    {id:'conversation', name:'Tema 03 · Hald på og endre', theme:true, implemented:true, prototypeEligible:true, pupilRelease:'BLOCKED', levels:[1,2,3,4]},
    {id:'rhythm', implemented:true, prototypeEligible:true, pupilRelease:'BLOCKED', name:'Rytmereparatøren', levels:[1,2,3,4]},
    {id:'melody', implemented:true, prototypeEligible:true, pupilRelease:'BLOCKED', name:'Melodidetektiven', levels:[1,2,3,4]},
    {id:'harmony', implemented:true, prototypeEligible:true, pupilRelease:'BLOCKED', name:'Finn heim', levels:[1,2,3,4]},
    {id:'puzzle', implemented:true, prototypeEligible:true, pupilRelease:'BLOCKED', name:'Melodipuslespel', levels:[1,2,3,4]},
    {id:'notation', implemented:true, prototypeEligible:true, pupilRelease:'BLOCKED', name:'Lyd og notar', levels:[1,2,3,4]},
    {id:'create', implemented:true, prototypeEligible:true, pupilRelease:'BLOCKED', name:'Fri melodiverkstad', levels:[1]},
  ].map(item => Object.freeze({...item, levels:Object.freeze(item.levels)})));
  function prototypeAvailable(item){return item.implemented===true && item.prototypeEligible===true && ['BLOCKED','PASS'].includes(item.pupilRelease)}
  const availableRegistry=Object.freeze(registry.filter(prototypeAvailable));
  // Accent/on-accent combinations exceed WCAG AA; backgrounds/text stay unchanged.
  const presets = Object.freeze({
    original:{name:'Original grøn', accent:'#c6f184', ink:'#18241b'},
    blue:{name:'Blå', accent:'#b8ddff', ink:'#18241b'},
    gold:{name:'Gylden', accent:'#ffe099', ink:'#18241b'},
  });
  const ageGroups=Object.freeze(['11-13']);
  const MAX_FILE = 512 * 1024, MAX_LOGO = 300 * 1024, MAX_JSON = 450 * 1024;
  function fail(message) { throw new Error(message); }
  function object(value, keys, label) {
    if (!value || typeof value !== 'object' || Array.isArray(value) ||
      Object.keys(value).some(k => !keys.includes(k)) || keys.some(k => !Object.hasOwn(value,k))) fail('Ugyldig '+label+'.');
  }
  function list(value, allowed, label) {
    if (!Array.isArray(value) || !value.length || value.some(v => !allowed.includes(v)) || new Set(value).size !== value.length) fail('Ugyldig '+label+'.');
    return allowed.filter(v => value.includes(v));
  }
  function dimensions(bytes, mime) {
    const b = bytes, text = (a,n) => String.fromCharCode(...b.slice(a,a+n));
    const view = new DataView(b.buffer,b.byteOffset,b.byteLength);
    if (mime === 'image/png' && b.length >= 45 && [137,80,78,71,13,10,26,10].every((v,i)=>b[i]===v) && view.getUint32(8)===13 && text(12,4)==='IHDR') {
      return [view.getUint32(16),view.getUint32(20)];
    }
    if (mime === 'image/jpeg' && b[0]===255 && b[1]===216) {
      let i=2;
      while(i+4<b.length) {
        if(b[i++]!==255) break;
        while(b[i]===255)i++;
        const marker=b[i++];
        if(marker===218 || marker===217)break;
        const size=(b[i]<<8)|b[i+1];
        if(size<2 || i+size>b.length)break;
        if([192,193,194].includes(marker) && size>=8)return [(b[i+5]<<8)|b[i+6],(b[i+3]<<8)|b[i+4]];
        i+=size;
      }
    }
    if(mime==='image/webp' && b.length>=30 && text(0,4)==='RIFF' && text(8,4)==='WEBP' && view.getUint32(4,true)+8===b.length) {
      const type=text(12,4);
      if(type==='VP8X' && !(b[20]&2)) return [1+b[24]+(b[25]<<8)+(b[26]<<16),1+b[27]+(b[28]<<8)+(b[29]<<16)];
      if(type==='VP8 ' && b[23]===157 && b[24]===1 && b[25]===42)return [view.getUint16(26,true)&16383,view.getUint16(28,true)&16383];
      if(type==='VP8L' && b[20]===47)return [1+b[21]+((b[22]&63)<<8),1+(b[22]>>6)+(b[23]<<2)+((b[24]&15)<<10)];
    }
    fail('Logoen må vere ei gyldig PNG-, JPEG- eller WebP-fil. SVG er ikkje tillate.');
  }
  function checkImage(bytes,mime,max=2048) {
    if(bytes.length>MAX_FILE)fail('Logoen er for stor (maks 512 KiB).');
    const [width,height]=dimensions(bytes,mime);
    if(!width||!height||width>max||height>max||width*height>4000000)fail('Logoen har for store eller ugyldige biletdimensjonar.');
    return {width,height};
  }
  function canonicalPNG(b) {
    // Exported settings contain only a bounded, noninterlaced canvas PNG.
    const view=new DataView(b.buffer,b.byteOffset,b.byteLength);
    let offset=8,seenData=false,ended=false;
    while(offset+12<=b.length){
      const size=view.getUint32(offset),end=offset+12+size;
      if(end>b.length)fail('Ugyldig lagra logo.');
      const type=String.fromCharCode(...b.slice(offset+4,offset+8));
      if(!['IHDR','IDAT','IEND'].includes(type)||(offset===8?type!=='IHDR':type==='IHDR'))fail('Ugyldig lagra logo.');
      let crc=0xffffffff;
      for(let i=offset+4;i<offset+8+size;i++){crc^=b[i];for(let bit=0;bit<8;bit++)crc=(crc>>>1)^((crc&1)?0xedb88320:0);}
      if(((crc^0xffffffff)>>>0)!==view.getUint32(offset+8+size))fail('Logoen er skadd.');
      if(type==='IHDR'&&(size!==13||b[24]!==8||![2,6].includes(b[25])||b[26]||b[27]||b[28]))fail('Ugyldig lagra logo.');
      if(type==='IDAT'){if(!size)fail('Ugyldig lagra logo.');seenData=true;}
      if(type==='IEND'){if(size||!seenData||end!==b.length)fail('Ugyldig lagra logo.');ended=true;}
      offset=end;
    }
    if(!ended||offset!==b.length)fail('Ugyldig lagra logo.');
  }
  function logoValue(value) {
    if(value===null)return null;
    if(typeof value!=='string'||!/^data:image\/png;base64,[A-Za-z0-9+/]+={0,2}$/.test(value)||value.length>MAX_LOGO*1.4)fail('Ugyldig lagra logo.');
    const raw=value.slice(22);
    if(raw.length%4)fail('Ugyldig lagra logo.');
    const binary=typeof atob==='function'?atob(raw):Buffer.from(raw,'base64').toString('binary');
    const b=Uint8Array.from(binary,c=>c.charCodeAt(0));
    checkImage(b,'image/png',256);
    if(b.length>MAX_LOGO)fail('Ugyldig lagra logo.');
    canonicalPNG(b);
    return value;
  }
  function defaults() { return {schemaVersion:2,schoolName:'',logo:null,defaultLanguage:'nn',colourPreset:'original',ageGroups:['11-13'],themes:availableRegistry.filter(r=>r.theme).map(r=>r.id),levels:Object.fromEntries(availableRegistry.map(r=>[r.id,[...r.levels]]))}; }
  function validate(value) {
    object(value,['schemaVersion','schoolName','logo','defaultLanguage','colourPreset','ageGroups','themes','levels'],'skuleinnstillingar');
    if(value.schemaVersion===1){
      // Earlier school packages had only Themes 01/02. Never enable newly added content.
      if(!Array.isArray(value.themes)||value.themes.some(id=>!['theme','groove'].includes(id)))fail('Ugyldig eldre temaval.');
      object(value.levels,availableRegistry.filter(r=>r.id!=='conversation').map(r=>r.id),'eldre nivåval');
      value={...value,schemaVersion:2,levels:{...value.levels,conversation:[1,2,3,4]}};
    }
    if(value.schemaVersion!==2)fail('Denne versjonen av skuleinnstillingane er ikkje støtta.');
    if(typeof value.schoolName!=='string'||value.schoolName.length>100||/[\u0000-\u001f\u007f]/.test(value.schoolName))fail('Skulenamnet må vere tekst på høgst 100 teikn.');
    if(!['nn','nb','en'].includes(value.defaultLanguage))fail('Ugyldig språk.');
    if(!Object.hasOwn(presets,value.colourPreset))fail('Ugyldig fargeval.');
    object(value.levels,availableRegistry.map(r=>r.id),'nivåval');
    return {schemaVersion:2,schoolName:value.schoolName.trim(),logo:logoValue(value.logo),defaultLanguage:value.defaultLanguage,colourPreset:value.colourPreset,
      ageGroups:list(value.ageGroups,ageGroups,'aldersgruppe'), themes:list(value.themes,availableRegistry.filter(r=>r.theme).map(r=>r.id),'temaval'),
      levels:Object.fromEntries(availableRegistry.map(r=>[r.id,list(value.levels[r.id],r.levels,'nivå for '+r.name)]))};
  }
  function hasRestrictions(value){
    const settings=validate(value);
    return availableRegistry.some(item => (item.theme&&!settings.themes.includes(item.id)) ||
      item.levels.some(level=>!settings.levels[item.id].includes(level)));
  }
  function parse(text) {
    if(typeof text!=='string'||text.length>MAX_JSON)fail('Innstillingsfila er for stor.');
    let value;try {value=JSON.parse(text);} catch {fail('Fila inneheld ikkje gyldig JSON.');}
    return validate(value);
  }
  return Object.freeze({registry,availableRegistry,prototypeAvailable,hasRestrictions,ageGroups,presets,defaults,validate,parse,checkImage,MAX_FILE,MAX_JSON});
});
