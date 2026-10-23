from pathlib import Path
import re
import argparse, json, subprocess
parser = argparse.ArgumentParser(description='Build pupil pages and separate school setup')
parser.add_argument('--school-settings', type=Path)
parser.add_argument('--output', type=Path, default=Path('dist'))
parser.add_argument('--no-admin', action='store_true')
args = parser.parse_args()
validated = subprocess.run(['node', 'scripts/validate-school.cjs'] + ([str(args.school_settings)] if args.school_settings else []), capture_output=True, text=True)
if validated.returncode:
    parser.error(validated.stderr.strip())
settings = json.loads(validated.stdout)
def safe_json(value):
    return re.sub(r'[<>&\u2028\u2029]', lambda m: '\\u%04x' % ord(m[0]), json.dumps(value, ensure_ascii=False, separators=(',', ':')))
settings_json = safe_json(settings)
settings_tag = '<script id="school-settings" type="application/json">' + settings_json + '</script>'
output = args.output
output.mkdir(parents=True, exist_ok=True)
rows = """
Mi øving|Min øving|My practice
Høyr. Utforsk. Skap.|Lytt. Utforsk. Skap.|Listen. Explore. Create.
Hjelp og informasjon|Hjelp og informasjon|Help and information
Lydstyrke|Lydstyrke|Volume
Opnar Musikkverkstad …|Åpner Musikkverkstad …|Opening Musikkverkstad …
Rytmereparatøren|Rytmereparatøren|Rhythm Repair
Høyr mønsteret. Finn delen som manglar.|Hør mønsteret. Finn delen som mangler.|Listen to the pattern. Find the missing part.
Rytme og takt|Rytme og takt|Rhythm and metre
Melodidetektiven|Melodidetektiven|Melody Detective
Fang melodien og bygg han opp att.|Fang melodien og bygg den opp igjen.|Catch the melody and rebuild it.
Gehør og melodi|Gehør og melodi|Listening and melody
Finn heim|Finn hjem|Find Home
Utforsk kva akkordane gjer i musikken.|Utforsk hva akkordene gjør i musikken.|Explore what chords do in music.
Toneart og harmoni|Toneart og harmoni|Key and harmony
Utfordring|Utfordring|Challenge
Fordjuping|Fordypning|Go deeper
Utforsk|Utforsk|Explore
Ditt eige musikklaboratorium|Ditt eget musikklaboratorium|Your own music laboratory
Høyr noko nytt.|Hør noe nytt.|Hear something new.
Finn ut kvifor.|Finn ut hvorfor.|Find out why.
Tre musikalske utfordringar. Vel kvar du vil starte, prøv deg fram og finn ditt nivå.|Tre musikalske utfordringer. Velg hvor du vil starte, prøv deg frem og finn ditt nivå.|Three musical challenges. Choose where to start, experiment and find your level.
Vel ei utfordring|Velg en utfordring|Choose a challenge
Ingen fast rekkjefølgje|Ingen fast rekkefølge|No fixed order
oppgåver utforska|oppgaver utforsket|tasks explored
Skaparoppdrag|Skaperoppdrag|Creative mission
Same start. Ny slutt.|Samme start. Ny slutt.|Same start. New ending.
Lag ein liten melodisk variasjon. Du bestemmer korleis han skal låte.|Lag en liten melodisk variasjon. Du bestemmer hvordan den skal låte.|Make a short melodic variation. You decide how it sounds.
Opne verkstaden|Åpne verkstedet|Open the workshop
Du kan høyre om att så ofte du vil. Start lågt med lydstyrken, og vel eit nivå som passar deg.|Du kan høre om igjen så ofte du vil. Start med lav lydstyrke, og velg et nivå som passer deg.|Replay as often as you like. Start with a low volume and choose a level that suits you.
Åttandedel|Åttendedel|Eighth note
Punktert firedel|Punktert firedel|Dotted quarter note
Firedel|Firedel|Quarter note
Halvnote|Halvnote|Half note
Du kan alltid byte.|Du kan alltid bytte.|You can always change it.
Lytt til heile rytmen. Vel noteverdien som manglar i mønsteret.|Lytt til hele rytmen. Velg noteverdien som mangler i mønsteret.|Listen to the whole rhythm. Choose the missing note value.
Lytt til melodien. Vel ei rute, og set inn tonen du høyrde.|Lytt til melodien. Velg en rute, og sett inn tonen du hørte.|Listen to the melody. Select a slot and enter the note you heard.
Lytt til tonearten og prøv dei to eller tre avslutningane. Finn akkorden som fører frå V tilbake til I.|Lytt til tonearten og prøv de to eller tre avslutningene. Finn akkorden som fører fra V tilbake til I.|Listen to the key and try the endings. Find the chord that leads from V back to I.
Lytt til ein akkord i ein tydeleg toneart. Kva funksjon har han?|Lytt til en akkord i en tydelig toneart. Hvilken funksjon har den?|Listen to a chord in an established key. What is its function?
Notebilete av svaret ditt|Notebilde av svaret ditt|Notation of your answer
Svaret ditt på notelinjer, G-nøkkel|Svaret ditt på notelinjer, G-nøkkel|Your answer on a treble staff
G-nøkkel · C4 er midt-C · H = engelsk B, B = engelsk B♭|G-nøkkel · C4 er midt-C · H = engelsk B, B = engelsk B♭|Treble clef · C4 is middle C · English note names: B and B♭
Kva note manglar?|Hvilken note mangler?|Which note is missing?
Kvar 6/8-takt har seks åttandedelar, grupperte 3 + 3. Ei punktert firedel er eitt hovudslag.|Hver 6/8-takt har seks åttendedeler, gruppert 3 + 3. En punktert firedel er ett hovedslag.|Each 6/8 bar has six eighth notes, grouped 3 + 3. A dotted quarter note is one main beat.
Ein firedel er eitt pulsslag.|En firedel er ett pulsslag.|A quarter note is one beat.
Taktstrek|Taktstrek|Barline
Manglande note|Manglende note|Missing note
Bygg melodien du høyrde|Bygg melodien du hørte|Rebuild the melody you heard
Alle tonane er like lange. Dette er ei melodiøving utan taktstrekar.|Alle tonene er like lange. Dette er en melodiøvelse uten taktstreker.|All notes have equal length. This melody exercise has no barlines.
ikkje vald|ikke valgt|not selected
Høyr svaret mitt|Hør svaret mitt|Play my answer
Sjå svaret mitt som notar|Se svaret mitt som noter|Show my answer as notation
Kva avslutning går frå V til I?|Hvilken avslutning går fra V til I?|Which ending moves from V to I?
Kva akkordfunksjon høyrer du?|Hvilken akkordfunksjon hører du?|Which chord function do you hear?
I er tonika: den tonale heimen i denne øvinga.|I er tonika: det tonale hjemmet i denne øvelsen.|I is the tonic: the tonal home in this exercise.
Høyr tonearten før du samanliknar akkordane.|Hør tonearten før du sammenligner akkordene.|Listen to the key before comparing the chords.
Dette er funksjonar i vestleg durtonalitet. Andre musikalske tradisjonar kan organisere tonane annleis.|Dette er funksjoner i vestlig durtonalitet. Andre musikalske tradisjoner kan organisere tonene annerledes.|These are functions in Western major-key tonality. Other musical traditions may organise pitches differently.
Alle aktivitetar|Alle aktiviteter|All activities
Øv i ditt tempo|Øv i ditt tempo|Practise at your own pace
Høyr toneart og oppgåve|Hør toneart og oppgave|Play key and challenge
Høyr oppgåva|Hør oppgaven|Play the challenge
Høyr rolegare|Hør langsommere|Play more slowly
Sjekk svaret|Sjekk svaret|Check answer
Neste oppgåve|Neste oppgave|Next challenge
Ny oppgåve|Ny oppgave|New challenge
Du har verktøy|Du har verktøy|Tools to help you
Å lytte fleire gonger er ein del av øvinga. Bruk hjelp når du treng det.|Å lytte flere ganger er en del av øvingen. Bruk hjelp når du trenger det.|Listening again is part of practice. Use help whenever you need it.
Gje meg eit hint|Gi meg et hint|Give me a hint
Sjå eit døme|Se et eksempel|Show an example
Vis og forklar svaret|Vis og forklar svaret|Show and explain the answer
Hint som røper delar av svaret blir ikkje brukte til å vurdere nivået ditt.|Hint som røper deler av svaret blir ikke brukt til å vurdere nivået ditt.|Attempts with answer hints are not used to estimate your level.
Kva øver eg på?|Hva øver jeg på?|What am I practising?
Å knyte noteverdiar og høyrde rytmar saman. Å telje verdiar er ikkje det same som å halde ein jamn puls.|Å knytte noteverdier og hørte rytmer sammen. Å telle verdier er ikke det samme som å holde en jevn puls.|Connecting note values with heard rhythms. Counting values is different from keeping a steady pulse.
Å hugse og finne tonehøgder i ein melodi. Prøv å høyre etter retninga mellom tonane.|Å huske og finne tonehøyder i en melodi. Prøv å høre etter retningen mellom tonene.|Remembering and finding pitches in a melody. Listen for the direction between notes.
Å kjenne att akkordfunksjonar i ein toneart. Ein akkord åleine fortel ikkje kva funksjon han har.|Å kjenne igjen akkordfunksjoner i en toneart. En akkord alene forteller ikke hvilken funksjon den har.|Recognising chord functions in a key. An isolated chord does not establish its function.
Du fekk til |Du fikk til |You solved 
 av 10 nye oppgåver utan svarhint. Vil du prøve neste nivå?| av 10 nye oppgaver uten svarhint. Vil du prøve neste nivå?| of 10 new challenges without answer hints. Try the next level?
Vil du prøve eit rolegare steg eller halde fram her? Du bestemmer.|Vil du prøve et enklere steg eller fortsette her? Du bestemmer.|Try an easier step or continue here? You decide.
Prøv nivå|Prøv nivå|Try level
Hald fram her|Fortsett her|Continue here
Vel eit svar først.|Velg et svar først.|Choose an answer first.
Fyll ut alle rutene før du sjekkar.|Fyll ut alle rutene før du sjekker.|Fill all the slots before checking.
Det stemmer!|Det stemmer!|Correct!
Høyr ein gong til. Samanlikn melodien med svaret ditt.|Hør en gang til. Sammenlign melodien med svaret ditt.|Listen again. Compare the melody with your answer.
Samanlikn lengda på noten med plassen som manglar. Høyr mønsteret ein gong til.|Sammenlign lengden på noten med plassen som mangler. Hør mønsteret en gang til.|Compare the note length with the missing space. Listen to the pattern again.
Denne akkorden finst i tonearten, men svarar ikkje på denne oppgåva. Samanlikn heile frasen.|Denne akkorden finnes i tonearten, men svarer ikke på denne oppgaven. Sammenlign hele frasen.|This chord belongs to the key but does not answer this challenge. Compare the whole phrase.
Prøv ei justering.|Prøv en justering.|Try an adjustment.
Den manglande noten er ein |Den manglende noten er en |The missing value is: 
Dei to 6/8-taktene har til saman tolv åttandedelar.|De to 6/8-taktene har til sammen tolv åttendedeler.|The two 6/8 bars contain twelve eighth notes in total.
Noteverdiane i takta blir til saman fire firedelar.|Noteverdiene i takten blir til sammen fire firedeler.|The note values in the bar add up to four quarter notes.
Melodien er |Melodien er |The melody is 
. Lytt til heile melodien igjen og legg merke til stega og spranga.|. Lytt til hele melodien igjen og legg merke til trinnene og sprangene.|. Listen again and notice the steps and leaps.
I er durakkorden på første trinn. Etter V fører han tilbake til tonika i denne frasen.|I er durakkorden på første trinn. Etter V fører den tilbake til tonika i denne frasen.|I is the major chord on the first scale degree. Following V, it returns to the tonic in this phrase.
I er durakkorden på første trinn: tonika i tonearten du høyrde.|I er durakkorden på første trinn: tonika i tonearten du hørte.|I is the major chord on the first scale degree: the tonic in the key you heard.
Dette er |Dette er |This is 
. Samanlikn han med I etter at du har høyrt tonearten.|. Sammenlign den med I etter at du har hørt tonearten.|. Compare it with I after listening to the key.
Lytt og samanlikn.|Lytt og sammenlign.|Listen and compare.
Ein tone er på plass.|En tone er på plass.|One note is in place.
. Høyr igjen og finn dei andre.|. Hør igjen og finn de andre.|. Listen again and find the others.
Sjå på lengda.|Se på lengden.|Look at the length.
Plassen som manglar er |Plassen som mangler er |The missing space is 
 firedelar lang. Ein åttandedel er ein halv firedel.| firedeler lang. En åttendedel er en halv firedel.| quarter notes long. An eighth note is half a quarter note.
Lytt etter funksjonen.|Lytt etter funksjonen.|Listen for the function.
Målet er tonika, akkorden på første trinn. Samanlikn med den siste akkorden i innleiinga.|Målet er tonika, akkorden på første trinn. Sammenlign med den siste akkorden i innledningen.|The target is the tonic, the chord on the first scale degree. Compare it with the last chord of the introduction.
Målet er |Målet er |The target is 
. Prøv å samanlikne kandidatane etter innleiinga.|. Prøv å sammenligne alternativene etter innledningen.|. Compare the options after the introduction.
Her er eit løysingsforslag.|Her er et løsningsforslag.|Here is the answer.
 Denne oppgåva tel ikkje som sjølvstendig løyst.| Denne oppgaven teller ikke som selvstendig løst.| This challenge does not count as independently solved.
I 4/4 fyller ein halvnote to slag. To firedelar fyller dei to siste: 2 + 1 + 1 = 4. I 6/8 kan to punkterte firedelar fylle éi takt.|I 4/4 fyller en halvnote to slag. To firedeler fyller de to siste: 2 + 1 + 1 = 4. I 6/8 kan to punkterte firedeler fylle én takt.|In 4/4 a half note fills two beats. Two quarter notes fill the remaining beats: 2 + 1 + 1 = 4. In 6/8 two dotted quarter notes fill one bar.
C4 – D4 – E4 går opp to gonger. C4 – E4 – D4 går først opp, så ned. Vel ei rute før du set inn tonen.|C4 – D4 – E4 går opp to ganger. C4 – E4 – D4 går først opp, så ned. Velg en rute før du setter inn tonen.|C4 – D4 – E4 rises twice. C4 – E4 – D4 rises, then falls. Select a slot before entering a note.
I C-dur er I = C-dur, IV = F-dur og V = G-dur. Høyr C–F–G–C: den siste akkorden kjem tilbake til tonika.|I C-dur er I = C-dur, IV = F-dur og V = G-dur. Hør C–F–G–C: den siste akkorden kommer tilbake til tonika.|In C major, I = C major, IV = F major and V = G major. Listen to C–F–G–C: the last chord returns to the tonic.
Døme|Eksempel|Example
To takter, fire firedelar i kvar. Behald starten, og lag ein ny slutt på den andre takta.|To takter, fire firedeler i hver. Behold starten, og lag en ny slutt på den andre takten.|Two bars, four quarter notes in each. Keep the opening and change the ending of the second bar.
Ingen poeng · Ditt uttrykk|Ingen poeng · Ditt uttrykk|No scores · Your expression
Oppdraget|Oppdraget|Your mission
Første takt og dei to første tonane i andre takt er låste. Endre minst éin av dei to siste tonane. Alle tonane er firedelar.|Første takt og de to første tonene i andre takt er låst. Endre minst én av de to siste tonene. Alle tonene er firedeler.|The first bar and the first two notes of bar two are locked. Change at least one of the last two notes. All notes are quarter notes.
Høyr melodien|Hør melodien|Play the melody
Samanlikn med originalen|Sammenlign med originalen|Compare with the original
Lagre varianten|Lagre varianten|Save variation
Kva endra seg då du valde ein annan slutt? Kva versjon vil du behalde? Det finst fleire gode svar.|Hva endret seg da du valgte en annen slutt? Hvilken versjon vil du beholde? Det finnes flere gode svar.|What changed with your new ending? Which version would you keep? There are many good answers.
Di eiga reise|Din egen reise|Your own journey
Framgangen ligg i denne nettlesaren på denne eininga. Han er ikkje sendt til ein lærar.|Fremgangen ligger i denne nettleseren på denne enheten. Den er ikke sendt til en lærer.|Progress stays in this browser on this device. It is not sent to a teacher.
Oppgåver løyste|Oppgaver løst|Challenges solved
Rett på første forsøk utan svarhint|Riktig på første forsøk uten svarhint|Correct first time without answer hints
Lagra melodivariantar|Lagrede melodivarianter|Saved melody variations
Mine melodivariantar|Mine melodivarianter|My melody variations
Lag din første variant i skaparverkstaden.|Lag din første variant i skaperverkstedet.|Create your first variation in the workshop.
Ta vare på arbeidet|Ta vare på arbeidet|Keep your work
Eksporter ein kopi før du flyttar appen, byter nettlesar eller slettar nettlesardata.|Eksporter en kopi før du flytter appen, bytter nettleser eller sletter nettleserdata.|Export a copy before moving the app, changing browser or clearing browser data.
Endre minst éin av dei to siste tonane for å lage ein variasjon.|Endre minst én av de to siste tonene for å lage en variasjon.|Change at least one of the last two notes to make a variation.
Du har 30 lagra variantar. Eksporter ein kopi; denne prototypen har plass til 30.|Du har 30 lagrede varianter. Eksporter en kopi; denne prototypen har plass til 30.|You have 30 saved variations. Export a copy; this prototype has space for 30.
Varianten er lagra i «Mi øving».|Varianten er lagret i «Min øving».|Variation saved in My practice.
Varianten er i denne økta. Eksporter framgangen for å ta vare på han.|Varianten er i denne økten. Eksporter fremgangen for å ta vare på den.|Your variation is in this session. Export progress to keep it.
Fila er for stor.|Filen er for stor.|The file is too large.
Import erstattar framgangen på denne eininga. Har du eksportert det du vil behalde?|Import erstatter fremgangen på denne enheten. Har du eksportert det du vil beholde?|Import replaces progress on this device. Have you exported what you want to keep?
Framgangen er importert.|Fremgangen er importert.|Progress imported.
Kunne ikkje importere: |Kunne ikke importere: |Could not import: 
tonika · heim|tonika · hjem|tonic · home
sjette trinn|sjette trinn|sixth degree
Melodivariant |Melodivariant |Melody variation 
Hald fram|Fortsett|Continue
 utforska| utforsket| explored
 løyste| løst| solved
 tonar| toner| notes
 firedelar| firedeler| quarter notes
Nivå|Nivå|Level
Stopp|Stopp|Stop
Høyr|Hør|Listen
Spel |Spill |Play 
Opne|Åpne|Open
Eksporter|Eksporter|Export
Importer|Importer|Import
Takt |Takt |Bar 
 slag | slag | beat 
Tone |Tone |Note 
 er | er | is 
Lyd |Lyd |Volume 
"""
# Long-form help and errors follow in a separate table.
extra = Path('translations-extra.txt').read_text() if Path('translations-extra.txt').exists() else ''
source=Path('src/app.nn.html').read_text()
triples=[line.split('|') for line in (rows+extra).strip('\n').splitlines() if line]
assert all(len(r)==3 for r in triples)
for locale,index in [('nn',0),('nb',1),('en',2)]:
    mapping={r[0]:r[index].replace("'",'’') for r in triples if r[0]!=r[index]}
    pattern=re.compile('|'.join(re.escape(k) for k in sorted(mapping,key=len,reverse=True))) if mapping else None
    s=pattern.sub(lambda m:mapping[m.group()],source) if pattern else source
    if locale=='en':
        s=s.replace("'A','B','H'","'A','B♭','B'").replace("?'takt':'takter'","?'bar':'bars'").replace('-dur',' major')
    s=s.replace('<html lang="nn">',f'<html lang="{locale}">')
    nav='<nav class="language-tabs" aria-label="Language / Språk">'+''.join(f'<a href="{code}.html" lang="{code}" data-language="{code}"'+(' aria-current="page"' if code==locale else '')+'>'+label+'</a>' for code,label in [('nn','Nynorsk'),('nb','Bokmål'),('en','English')])+'</nav>'
    s=s.replace('<!-- LANGUAGE_MENU -->', '<div class="nv-language"><strong>Språk</strong>'+nav+'</div>')
    css='\n.language-tabs{max-width:1144px;margin:12px auto 0;padding:0 24px;display:flex;gap:6px}.language-tabs a{display:inline-block;padding:10px 16px;border:1px solid var(--edge);border-radius:10px;color:var(--text);text-decoration:none;font-size:14px}.language-tabs a[aria-current]{background:var(--green);color:#18241b;font-weight:700}.language-tabs a:focus-visible{outline:3px solid var(--gold)}\n'
    s=s.replace('</style>',css+'</style>')
    s=s.replace("'use strict';", "'use strict';\n"+Path('src/programme-core.js').read_text()+"\n"+Path('src/school/config.js').read_text()+"\nconst schoolSettings=SchoolConfig.parse(document.getElementById('school-settings').textContent);\n"+Path('src/school/pupil.js').read_text()+"\ntry{localStorage.setItem('musikkverkstad-language','"+locale+"')}catch(e){}\n")
    s=s.replace('\nrender();', '\n'+Path('src/practice.js').read_text()+'\n'+Path('src/theme.js').read_text()+'\n'+Path('src/puzzle.js').read_text()+'\n'+Path('src/notation.js').read_text()+'\n'+Path('src/groove.js').read_text()+'\n'+Path('src/form.js').read_text()+'\n'+Path('src/programme.js').read_text()+'\n'+Path('src/navigation.js').read_text()+'\nrender();')
    s=s.replace('</head>', '<style>'+Path('src/studio.css').read_text()+Path('src/form.css').read_text()+Path('src/programme.css').read_text()+'</style></head>')
    s=s.replace('</head>',settings_tag+'</head>')
    (output/f'{locale}.html').write_text(s)
index_page = ('''<!doctype html><html lang="nn"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Musikkverkstad</title><style>body{background:#101820;color:#f3f5ef;font:18px system-ui;padding:30px}a{color:#c6f184;display:inline-block;padding:16px}</style></head><body><h1>Musikkverkstad</h1><nav><a href="nn.html">Nynorsk</a><a href="nb.html">Bokmål</a><a href="en.html">English</a></nav><script>let l='nn';try{const v=localStorage.getItem('musikkverkstad-language');if(['nn','nb','en'].includes(v))l=v}catch(e){}location.replace(l+'.html');</script></body></html>''')
(output/'index.html').write_text(index_page.replace('</head>',settings_tag+'</head>').replace("let l='nn'", "let l=JSON.parse(document.getElementById('school-settings').textContent).defaultLanguage"))
print('Built three language versions.')

import shutil
shutil.copyfile('src/sound-compare.html',output/'sound-compare.html')
shutil.copytree('src/sounds',output/'sounds',dirs_exist_ok=True)
if not args.no_admin:
    import base64, hashlib
    policy=json.loads(Path('src/school/package-policy.json').read_text())
    files=[]
    for name in policy['templatePaths']:
        data=(output/name).read_bytes()
        assert len(data)<=policy['maxFileBytes']
        files.append(dict(path=name,size=len(data),sha256=hashlib.sha256(data).hexdigest(),base64=base64.b64encode(data).decode('ascii')))
    identity=hashlib.sha256()
    for path in sorted([*Path('src').rglob('*'),Path('translate.py'),Path('translations-extra.txt'),Path('scripts/validate-school.cjs')]):
        if path.is_file():
            data=path.read_bytes();identity.update(str(path).encode()+b'\0'+str(len(data)).encode()+b'\0'+data)
    bundle=json.dumps(dict(formatVersion=1,settingsSchemaVersion=5,sourceHash=identity.hexdigest(),pupilRelease='BLOCKED',files=files),separators=(',',':'))
    bundle_hash=hashlib.sha256(bundle.encode()).hexdigest()
    Path('setup').mkdir(exist_ok=True)
    Path('setup/template.json').write_text(bundle)
    admin=Path('src/school/admin.html').read_text().replace('/* SCHOOL_CONFIG */',Path('src/school/config.js').read_text()).replace('/* SCHOOL_ADMIN */',Path('src/school/admin.js').read_text())
    packaging='<script>globalThis.SchoolPackagePolicy='+safe_json(policy)+';</script><script>'+Path('src/school/package.js').read_text()+'</script>'
    packaging+='<script id="school-template" type="application/json" data-sha256="'+bundle_hash+'">'+bundle+'</script>'
    admin=admin.replace('<!-- SCHOOL_PACKAGE -->',packaging)
    Path('setup/index.html').write_text(admin)

    # Adult-only entry: same template, allowlist and preview transport, no configuration form.
    review = Path('src/school/teacher-review.html').read_text().replace('/* SCHOOL_CONFIG */',Path('src/school/config.js').read_text()).replace('/* TEACHER_REVIEW */',Path('src/school/teacher-review.js').read_text()).replace('<!-- SCHOOL_PACKAGE -->',packaging)
    review_output=Path('.quality/teacher-kit');review_output.mkdir(parents=True,exist_ok=True)
    (review_output/'teacher-review.html').write_text(review)
    (review_output/'teacher-review-manifest.json').write_text(json.dumps(dict(formatVersion=1,purpose='private-adult-teacher-review',pupilRelease='BLOCKED',teacherAdoption='PENDING',sourceHash=identity.hexdigest(),templateHash=bundle_hash,artifact='teacher-review.html',artifactSha256=hashlib.sha256(review.encode()).hexdigest(),entry=dict(theme='groove',mode='listen',suggestedLevel=1,language='nn')),indent=2)+'\n')
