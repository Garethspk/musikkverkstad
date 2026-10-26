# Privat HTTPS og Teams — full app for tilsette

**Plan/preparering, ikkje publisering.** Elevpublisering BLOCKED; lærar TA1–TA5,
musikk, omsetjing, elevar, AT, fysiske einingar og høgtalarar PENDING. Ingen vert,
kommunekonto, invitasjon eller distribusjon blir oppretta av byggjaren eller CI.

## Avklart leveringsmodell

Teams er inngangen til ei **privat HTTPS-nettside godkjend av kommunen**. Ei lenkje
som opnar Edge/Chrome i vanleg nettlesar, er standardløysinga. Vi veit ikkje om
kommunen tilbyr statisk hosting, kva identitetsløysing dei bruker, eller om Teams
Website/nettstad-faner er tillatne. Ikkje vel ein offentleg gratisteneste som standard.
Teams/SharePoint **Filer** er dokumentlagring: opplasta HTML kan bli lasta ned,
førehandsvist eller blokkert; dette er ikkje ei føresetnad om køyring av appen.

Dagens `dist/` har NN/NB/EN, tema01/02/03, Formverkstad, veke1–6 og hjelpeaktivitetar.
`dist/sound-compare.html` er eit utviklarverktøy, ikkje ei elevaktivitet, og er ikkje
med. Den eldre `teacher-review.html` er framleis berre Tema02; ikkje presenter henne
som full app. Den nye pakken har eigne manifest og eit synleg tilsettmerke i alle
språk. Musikalske skript/data er dei same som i den pinna grunnpakken; berre
skuleinnstillingar, statisk tilsettmerke og ein avgrensande CSP er pakka rundt.
Ingen redigeringsgrensesnitt, template.json, publiseringsverktøy eller ny læreplan.

## Før IT kan opprette ei fungerande privat adresse — konkrete spørsmål

1. Kva **godkjend privat HTTPS-vert** og ansvarleg driftskontakt kan kommunen bruke?
   Kan han servere statiske `.html`, `.mp3`, `.txt`, `.json`, `.md` og undermapper
   direkte, også under t.d. `/musikkverkstad/review/`, utan å skrive om alle URL-ar
   til index.html? Kven godkjenner tilgang, levetid, logging, støtte og sletting?
2. Korleis blir **namngitt tilsettgruppe** autentisert og autorisert på server,
   reverse proxy eller kommunen si identitetsløysing? Avgrens til tilsette ved
   Stord kulturskule som er godkjende for gjennomgangen; ikkje automatisk alle i
   kommunen, elevar, gjester eller alle som har lenkja. Appen lagar ingen kontoar.
3. Vernet må gjelde **alle stiar**: index/alle språk, direkte lyd-URL-ar, manifest,
   dokument og alternative alias/vertsnamn. Ingen anonym blob-/origin-/CDN-URL,
   offentleg GitHub Pages, lenkjeløyndom, robots.txt, klientpassord eller JS-nøkkel
   som erstatning for autentisering. Ikkje bruk hemmelege query-token i Teams-lenkja.
4. Kva HTTP-responshovud og MIME-typar kan verten setje? Bruk manifestet sitt
   `requiredResponseHeaders` som utgangspunkt: CSP, nosniff, no-referrer,
   `Cache-Control: private, no-store`, Permissions-Policy. HTML må vere `text/html;
   charset=utf-8`, MP3 `audio/mpeg`, JSON `application/json`, tekst/Markdown lesbar
   tekst. Sertifikat må vere gyldig; ikkje be lærarar hoppe over åtvaringar.
5. Er vanleg Teams-lenkje til privat HTTPS og «Opne i nettlesar» støtta? Er
   Website/nettstad-fane tilgjengeleg i akkurat dykkar Teams-klient/tenant? Er
   innlogging/cookies/lyd/fokus mogleg i innebygd vising? Test på faktiske klientar.

**Standard er inga innbygging.** Pakken har ikkje iframe. Tilrådd HTTP-CSP har
`frame-ancestors 'none'`. Det held eksterne rammer ute og krev vanleg nettlesar.
`frame-ancestors` kan ikkje setjast av HTML-meta; IT må setje HTTP-hovudet. Ikkje
endre eksisterande setup-/lærarkit-sandbox eller CSP for å tvinge Teams-innbygging.
Dersom IT seinare godkjenner innbygging, må dei avklare konkrete lovlege ancestor-
origins, eventuelle konfliktar med X-Frame-Options, identitetsflyt, tredjepartscookies,
Website-støtte, mobil, fokus og lyd separat. Ikkje bruk wildcard eller fjern vern
berre for å få fana til å verke. Bruk nettlesarlenkja når innbygging ikkje fungerer.

## Vedlikehaldar: lag og kontroller pakken (teknisk arbeid, ikkje læraroppgåve)

1. Sjekk ut den avtalte kandidatcommiten. `npm ci`, `npm run build`, full kvalitetsgate
   og eksakt-commit CI må kontrollerast. `npm run staff:prepare` lagar pakken frå
   faktisk pinna `setup/template.json` og byte-like `dist/`-filer. Appkjelde må vere
   committa; ingen gamle/skadde dist/template-byte blir aksepterte. Valfri validert
   schema6-fil: `node scripts/build-staff-review.cjs path/to/settings.json`.
   Standard er alle implementerte aktivitetar/nivå og Stord kulturskule, NN.
2. Utdata ligg berre i ignorert `.quality/staff-review/prepared/`: `site/`,
   `musikkverkstad-staff-review.zip`, ZIP-checksum. Ingen fil er automatisk lasta
   opp eller lagt i ein offentleg PR/release/CI-artefakt. Utdata er medvite utelatne
   frå CI-upload; generer privat frå den same godkjende commiten når IT er klar.
3. Kontroller ZIP SHA256, pakk ut privat, kontroller kvar linje i `checksums.sha256`.
   Manifestet pinjar endelege payload-byte, faktisk kjeldecommit, template/source/
   innstillingshash og underliggjande appkandidat. Manifestet er sjølv sjekksumma i
   checksums-fila; fila sjekksummar ikkje seg sjølv. ZIP-checksummen er separat.
   Hashar er integritet/proveniens, ikkje signatur, autentisering eller release-PASS.
4. **Hald att ved utviklingsfeil.** Kjende lokale managed-file://-feil skal stå som
   FAIL, aldri ommerkast. Den nye HTTP-leveransen må ha bestått eksakt kandidat-CI
   og faktiske HTTP-testar. Dette beviser ikkje lokal file://-opning eller produksjons-
   innlogging. Eigar/IT må vurdere avgrensa privat tilsettgjennomgang uttrykkeleg;
   dette dokumentet gir ikkje publiseringsløyve eller svekkjer nokon releasegate.

## IT: seinare privat installasjon — krev uttrykkeleg godkjenning

1. Hent den avtalte ZIP-en gjennom eksisterande privat kanal. Kontroller commit og
   sjekksummar; ikkje rediger appfiler. Monter berre innhaldet i **site/** som webrot,
   ikkje repoet, setup/, CI-diagnostikk, ZIP-arkiv, tempfiler eller kjeldekode.
2. Bruk helst eit **eige review-origin**. LocalStorage er origin-delt, ikkje skilt av
   URL-mapper. Ikkje bland testen med ein eksisterande elev-/produksjonsinstallasjon.
   Same origin brukar same lokale framgang/språk; ny origin krev eventuell eksport/
   import. Bruk berre testval. Ingen framgangsdata skal sendast til verten av appen.
3. Set HTTPS, tilsettautorisasjon på heile treet, rette MIME-typar og HTTP-hovud.
   Slå av kataloglisting og anonyme cache-/origin-/alternativvegar. Avklar avgrensa
   drifts-/innloggingsloggar og slettetid med kommunen; «ingen appanalyse» betyr
   ikkje at verten/SSO har null IP-/tilgangsloggar. Ingen logginnsamling er lagt til.
4. **Prøv frålogga/privat vindauge og uvedkommande testidentitet**, ikkje berre med
   eigaren innlogga: entry, `/en.html`, ei direkte `sounds/C4.mp3`, manifest og
   alternative alias skal nekte byte eller krevje godkjend innlogging. Eit uautorisert
   medlem/elev/gjest skal nektast. Retest omdirigeringar, cache og direkte origin.
   Frålogga «200 app/MP3»-respons blokkerer deling. Vern på berre startsida er feil.
5. Med autorisert tilsett: prøv index og alle språk, veke1–6/tema/form/andre aktivitetar,
   faktisk lyd med låg styrke, stopp/navigering, rette relative stiar frå endeleg
   undermappe og avgrensa skuleutgåve. Dokumenter nettlesar/OS/eining/kandidat.
6. Lagre den endelege **private HTTPS-adressa**, test henne frå Teams på faktisk
   maskin, og avtal kontakt, sluttdato/tilgangsstenging og tilbakemeldingskanal.
   Først etter eigar/IT-godkjenning kan ansvarleg person dele til avtalt tilsettgruppe.

## Ansvarleg person: lenkje i Teams (ingen utviklarverktøy for lærarane)

1. Opne rett **privat tilsettchat eller kanal** i Teams. Kontroller medlemskap;
   ikkje bruk elevteam, offentleg kanal, gjestekanal eller «alle».
2. Skriv ei kort melding: «Privat lærartest av Musikkverkstad. Prøv éi valfri
   3–5-minuttsøving. Ikkje del med elevar. Tilbakemelding til avtalt intern kontakt.»
3. Lim inn den godkjende HTTPS-adressa frå IT, eventuelt som lenkje med teksten
   «Opne Musikkverkstad – lærartest». Ikkje last ZIP/HTML opp i Filer som køyrbar app.
4. Test lenkja som vanleg tilsett. Vel **Opne i nettlesar** dersom Teams viser ei
   tom ramme, filførehandsvising eller innlogging/lyd blir blokkert. Oppgi denne
   enkle reservevegen i meldinga. Læraren skal ikkje installere noko eller endre vern.
5. Ei valfri Website/nettstad-fane kan berre brukast dersom IT har godkjent og testa
   ho. Menynamn og tilgjenge varierer; om ho manglar, bruk den vanlege lenkja.
6. Be om kort tilbakemelding frå dokumentet i pakken, gjerne munnleg. Ingen
   nettbasert skjema eller svarinnsamling er installert. Avtal privat lagring utan
   elevnamn og følg lokale rutinar. Dette arbeidet sender inga Teams-melding.

## Offline og avgrensingar

Dette er ei fleirfil-webside, ikkje installert offline-app. Etter at ein språkpage og
alle fem samples er lasta, kan den opne sida navigere/spela frå minnet utan nett.
Første lydlast, byte til ei ikkje-lasta språkside, reload, ny fane, utlogging eller
lukking krev normalt nett/ny autorisasjon. `no-store` er medvite: ikkje lov offline-
installasjon av ein privat tilsettpakke eller automatisk service-worker-cache.
Eit lasta dokument kan framleis vere i minnet etter vertstilgang blir trekt tilbake;
serverautorisasjon er ikkje DRM/fjernsletting. Tilsette må lukke fana og handtere
lokale eksportfiler ansvarleg. Appen sender ikkje elevdata; eksterne lisenslenkjer
finst i fotnoten som uttrykkelege val, ikkje bakgrunnskall.

Automatiske loopback HTTP-testar beviser ruter/byte/CSP/handlingar, ikkje kommunal
HTTPS/Entra/Teams, verkeleg tilgangskontroll, fysiske telefonar/AT eller høgtalarar.
Ingen slike menneske-/produksjonssjekkar er utførte eller markerte PASS her.
