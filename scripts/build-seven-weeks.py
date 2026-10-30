"""Build one offline prototype-derived application; never deploy or enable pupil release."""
from pathlib import Path
import re,json,hashlib,base64
root=Path(__file__).resolve().parents[1]
versions=[3,3,2,5,5,6,1]
titles={'nn':['Puls og rytme','Melodi og gjentaking','Tonar og notar','Akkordar og harmoni','Form og variasjon','Klang og samspel','Taktartar'],'nb':['Puls og rytme','Melodi og gjentakelse','Toner og noter','Akkorder og harmoni','Form og variasjon','Klang og samspill','Taktarter'],'en':['Pulse and rhythm','Melody and repetition','Pitches and notation','Chords and harmony','Form and variation','Timbre and ensemble','Time signatures']}
expected=json.loads((root/'latest-week-prototypes/SHA256.json').read_text())
bank=[];manifest=[]
for week,version in enumerate(versions,1):
 p=root/'latest-week-prototypes'/f'musikkverkstad-veke{week}-v{version}.html';raw=p.read_bytes();html=raw.decode();assert hashlib.sha256(raw).hexdigest()==expected[p.name], 'Authoritative source checksum mismatch: '+p.name;manifest.append({'week':week,'source':str(p.relative_to(root)),'sha256':hashlib.sha256(raw).hexdigest()})
 if week==2:
  html=html.replace('60:80,62:70','60:70,62:65').replace('y>=80','y>=70').replace('y1="80"','y1="70"').replace('y2="80"','y2="70"')
  html=html.replace('Move phrase left',"${lang==='en'?'Move phrase left':lang==='nb'?'Flytt frase til venstre':'Flytt frase til venstre'}").replace('Move phrase right',"${lang==='en'?'Move phrase right':lang==='nb'?'Flytt frase til høyre':'Flytt frase til høgre'}")
 if week==3:html=html.replace('N[i]',"(lang==='en'&&N[i]==='H'?'B':N[i])").replace('options=[...new Set(options)]',"options=options.map(o=>lang==='en'&&o==='H'?'B':o);options=[...new Set(options)]")
 if week==4:
  html=html.replace("r.labels.join(' – ')","r.ns.map((m,i)=>(lang==='en'&&r.labels[i]==='H'?'B':r.labels[i])+ (Math.floor(m/12)-1)).join(' – ')")
  for s in ['if(phase===0)previewed=true;else editedPlayed=true','comparisonHeardOriginal=true','comparisonHeardEdited=true']:
   html=html.replace(s,'void 0')
  html=html.replace('heardChanges.add(transform);playChord','playChord')
 if week==5:
  html=html.replace("['C','D','E','F','G','A','H']","['C','D','E','F','G','A',lang==='en'?'B':'H']")
  html=html.replace('${y-7}','${95-diat.indexOf(nextDiatonic(e.pitch))*7}').replace('${y-35}','${95-diat.indexOf(nextDiatonic(e.pitch))*7-28}')
 if week==6:html=html.replace("lang==='en'?'bars':'taktar'","lang==='en'?'bars':lang==='nb'?'takter':'taktar'")
 if week==5:html=html.replace('aria-label="Musical staff"', 'aria-label="${lang===\'en\'?\'Musical staff\':lang===\'nb\'?\'Notelinjer\':\'Notelinjer\'}"')
 if week==7:html=html.replace("==='6/8'?.23:.35","==='6/8'?.175:.35")
 # Keep the supplied NN copy natural without silently changing musical data.
 html=re.sub(r'\bmedan\b','samtidig som',html)
 common=(root/'src/seven-week/bridge.js').read_text();patch=(root/f'src/seven-week/week-{week}.js').read_text();lifecycle=(root/'src/seven-week/lifecycle.js').read_text()
 # Hide repeated source headers; preserve cards, task navigation, help, controls and fonts.
 css='<style>button{min-height:48px}header.top,.topbar{display:none!important}.head{margin:8px 0}.bodygrid{gap:12px}.aside{font-size:14px}.donebox{background:transparent!important;border:0!important;padding:0!important}#status{scroll-margin-top:10px}</style>'
 csp="<meta http-equiv=\"Content-Security-Policy\" content=\"default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; img-src data:; connect-src 'none'; media-src 'none'; base-uri 'none'; form-action 'none'; object-src 'none'\">"
 html=html.replace('<script>', '<script>window.BOOT=/* BOOT_CONFIG */;\n'+common+'\n',1)
 html=html.replace('</body>','<script>'+patch+'\n'+lifecycle+'</script></body>')
 if patch not in html:raise RuntimeError('Missing body insertion '+str(week))
 html=html.replace('</head>',csp+css+'</head>')
 bank.append(base64.b64encode(html.encode()).decode())
shell=(root/'src/seven-week/shell.html').read_text().replace('/* SEVEN_SOURCES */',json.dumps(bank,separators=(',',':'))).replace('/* WEEK_TITLES */',json.dumps(titles,ensure_ascii=False))
out=root/'.quality/weeks-1-7';out.mkdir(parents=True,exist_ok=True);(out/'musikkverkstad.html').write_text(shell)
(out/'source-manifest.json').write_text(json.dumps({'formatVersion':1,'pupilRelease':'BLOCKED','humanValidation':'PENDING','sources':manifest,'artifactSha256':hashlib.sha256(shell.encode()).hexdigest()},indent=2)+'\n')
print('Built offline 21-activity prototype integration:',out/'musikkverkstad.html')
