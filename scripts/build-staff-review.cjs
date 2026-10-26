/* Preparation only. Does not host, authenticate, publish or approve pupil use. */
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const {execFileSync}=require('node:child_process');
const SC=require('../src/school/config.js'),PK=require('../src/school/package.js');
const root=path.resolve(__dirname,'..');
const hash=v=>crypto.createHash('sha256').update(v).digest('hex');
const CSP="default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; media-src 'self'; object-src 'none'; worker-src 'none'; frame-src 'none'; base-uri 'none'; form-action 'none'";
const HEADERS=Object.freeze({'Content-Security-Policy':CSP+"; frame-ancestors 'none'",'X-Content-Type-Options':'nosniff','Referrer-Policy':'no-referrer','Cache-Control':'private, no-store','Permissions-Policy':'microphone=(), camera=(), geolocation=()'});
const style='<style id="staff-review-style">#staffReview{background:#101820;color:#f3f5ef;border-bottom:2px solid #f4d48b;padding:12px 18px;font:14px/1.5 system-ui;overflow-wrap:anywhere}#staffReview a{color:#c6f184;display:inline-block;padding:12px;min-height:48px;box-sizing:border-box}#staffReview a:focus-visible{outline:3px solid #f4d48b}#staffReview details{padding:4px 0}#staffReview summary{cursor:pointer;min-height:48px}#staffReview code{overflow-wrap:anywhere}</style>';
function banner(identity,locale){const labels={nn:['PRIVAT LÆRARTEST · BERRE TILSETTE · IKKJE FOR ELEVAR','Elevpublisering BLOCKED · menneskeleg validering PENDING','Om testen og tilbakemelding'],nb:['PRIVAT LÆRERTEST · BARE ANSATTE · IKKE FOR ELEVER','Elevpublisering BLOCKED · menneskelig validering PENDING','Om testen og tilbakemelding'],en:['PRIVATE STAFF REVIEW · STAFF ONLY · NOT FOR PUPILS','Pupil release BLOCKED · human validation PENDING','About this review and feedback']}[locale];return `<aside id="staffReview" aria-label="${labels[0]}"><strong>${labels[0]}</strong><p>${labels[1]}</p><details><summary>Versjon / version</summary><p>Commit: <code>${identity.sourceCommit}</code><br>App candidate SHA-256: <code>${identity.appCandidateHash}</code></p></details><a href="index.html">${labels[2]}</a></aside>`}
function decorate(html,identity,locale){if((html.match(/<head>/g)||[]).length!==1||(html.match(/<body>/g)||[]).length!==1)throw Error('Unexpected compiled page');return html.replace('<meta charset="utf-8">',`<meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="${CSP}"><meta name="referrer" content="no-referrer">${style}`).replace('<body>','<body>'+banner(identity,locale))}
const defaults=()=>({...SC.defaults(),schoolName:'Stord kulturskule'});
async function prepare(settings=defaults()){
 const raw=fs.readFileSync(path.join(root,'setup/template.json'),'utf8'),setup=fs.readFileSync(path.join(root,'setup/index.html'),'utf8'),pin=setup.match(/id="school-template"[^>]+data-sha256="([a-f0-9]{64})"/)?.[1];
 const template=await PK.openTemplate(raw,pin),candidate=await PK.prepare(template,settings);await PK.verify(candidate);
 // Require the real compiled files represented by the pinned template, not stale dist.
 for(const file of PK.policy.templatePaths)if(!fs.readFileSync(path.join(root,'dist',file)).equals(Buffer.from(template.files[file])))throw Error('dist/template mismatch: '+file);
 const sourceIdentity=crypto.createHash('sha256'),sourceFiles=[];
 const walk=dir=>{for(const e of fs.readdirSync(path.join(root,dir),{withFileTypes:true})){const p=dir+'/'+e.name;if(e.isDirectory())walk(p);else if(e.isFile())sourceFiles.push(p)}};walk('src');
 for(const p of [...sourceFiles,'translate.py','translations-extra.txt','scripts/validate-school.cjs'].sort()){const b=fs.readFileSync(path.join(root,p));sourceIdentity.update(p+'\0'+b.length+'\0');sourceIdentity.update(b)}
 if(sourceIdentity.digest('hex')!==template.sourceHash)throw Error('Stale source template; rebuild the committed application');
 const sourceCommit=execFileSync('git',['rev-parse','HEAD'],{cwd:root,encoding:'utf8'}).trim();
 if(!/^[a-f0-9]{40}$/.test(sourceCommit))throw Error('Missing source commit');
 const dirty=execFileSync('git',['status','--porcelain','--untracked-files=all','--','src','translate.py','translations-extra.txt','scripts/validate-school.cjs'],{cwd:root,encoding:'utf8'}).trim();if(dirty)throw Error('Commit application source before staff preparation');
 const identity={formatVersion:1,purpose:'private-full-app-staff-review',sourceCommit,sourceHash:template.sourceHash,templateHash:template.templateHash,appCandidateHash:candidate.manifest.candidateHash,settingsHash:candidate.manifest.settingsHash,pupilRelease:'BLOCKED',humanValidation:'PENDING',accessControl:'REQUIRED_AT_HOST_NOT_INCLUDED'};
 const files=Object.create(null);
 for(const name of ['nn.html','nb.html','en.html'])files[name]=Buffer.from(decorate(Buffer.from(candidate.files[name]).toString('utf8'),identity,name.slice(0,2)));
 for(const name of PK.policy.templatePaths.filter(p=>p.startsWith('sounds/')))files[name]=Buffer.from(candidate.files[name]);
 files['school-settings.json']=Buffer.from(candidate.files['school-settings.json']);
 files['index.html']=Buffer.from(`<!doctype html><html lang="nn"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="Content-Security-Policy" content="${CSP}"><meta name="referrer" content="no-referrer"><title>Musikkverkstad · Privat lærartest</title>${style}<style>body{background:#101820;color:#f3f5ef;font:18px/1.6 system-ui;margin:0}main{max-width:900px;padding:24px;margin:auto}main a{color:#c6f184;display:inline-block;min-height:48px;padding:12px}a:focus-visible{outline:3px solid #f4d48b}</style></head><body>${banner(identity,'nn')}<main><h1>Heile Musikkverkstad · seks veker</h1><p>Berre privat gjennomgang for tilsette ved Stord kulturskule. Vel språk og prøv éi valfri oppgåve i 3–5 minutt. Du treng ikkje oppsett eller installasjon.</p><nav aria-label="Språk"><a href="nn.html">Opne heile appen · Nynorsk</a><a href="nb.html">Bokmål</a><a href="en.html">English</a></nav><p>Appen har alle implementerte aktivitetar som skuleoppsettet tillèt, også tema, Formverkstad og veke 1–6. Dette er ikkje den eldre Tema 02-pakken. Ingen oppgåver er godkjende for elevbruk.</p><p>Bruk berre eigne testval, aldri elevnamn eller elevdata. Arbeidet blir lagra lokalt i denne nettlesaren; ingen svar blir sende til ein lærar. Innlogging hos kommunen vernar tilgangen, ikkje gjennomføringa i appen. Ein tekst om «privat» er ikkje tilgangskontroll.</p><p><a href="LAERARTILBAKEMELDING.md">Kort lærarguide og tomt tilbakemeldingsskjema</a><a href="LES-MEG.txt">Praktisk hjelp og avgrensingar</a></p><p>Lyd krev første nedlasting frå same private vert. Start lågt med lydstyrken. Ikkje del lenkja med elevar. Stopp og kontakt den avtalte interne kontaktpersonen ved problem; ikkje slå av nettlesarvern.</p></main></body></html>`);
 for(const [file,doc]of [['LES-MEG.txt','LES-MEG.txt'],['LAERARTILBAKEMELDING.md','teacher-feedback.md'],['IT-DRIFT.md','hosting-and-teams.md']])files[file]=fs.readFileSync(path.join(root,'docs/staff-review',doc));
 files['LES-MEG.txt']=Buffer.concat([files['LES-MEG.txt'],Buffer.from('\nKJELDECOMMIT: '+identity.sourceCommit+'\nAPPKANDIDAT SHA-256: '+identity.appCandidateHash+'\nSOURCE SHA-256: '+identity.sourceHash+'\n')]);
 const manifest={...identity,files:Object.keys(files).sort().map(p=>({path:p,size:files[p].length,sha256:hash(files[p])})),requiredResponseHeaders:HEADERS};
 files['staff-review-manifest.json']=Buffer.from(JSON.stringify(manifest,null,2)+'\n');
 files['checksums.sha256']=Buffer.from(Object.keys(files).sort().map(p=>`${hash(files[p])}  ${p}\n`).join(''));
 return {files,manifest};
}
async function build(output=path.join(root,'.quality/staff-review/prepared'),settings=defaults()){
 output=path.resolve(output);const allowed=path.join(root,'.quality/staff-review')+path.sep;if(!output.startsWith(allowed))throw Error('Staff outputs must stay inside ignored .quality/staff-review/');
 const result=await prepare(settings),stage=output+'.tmp';fs.rmSync(stage,{recursive:true,force:true});fs.mkdirSync(stage,{recursive:true});
 for(const [name,bytes]of Object.entries(result.files)){const dest=path.join(stage,'site',name);fs.mkdirSync(path.dirname(dest),{recursive:true});fs.writeFileSync(dest,bytes)}
 execFileSync(process.env.PYTHON||'python3',['-c',`import zipfile,pathlib,sys
base=pathlib.Path(sys.argv[1]); z=zipfile.ZipFile(sys.argv[2],'w',compression=zipfile.ZIP_STORED)
for p in sorted(base.rglob('*')):
 if p.is_file():
  i=zipfile.ZipInfo(p.relative_to(base).as_posix(),(1980,1,1,0,0,0)); i.external_attr=0o100644<<16; z.writestr(i,p.read_bytes())
z.close()`,path.join(stage,'site'),path.join(stage,'musikkverkstad-staff-review.zip')]);
 const zip=fs.readFileSync(path.join(stage,'musikkverkstad-staff-review.zip'));fs.writeFileSync(path.join(stage,'musikkverkstad-staff-review.zip.sha256'),hash(zip)+'  musikkverkstad-staff-review.zip\n');
 fs.rmSync(output,{recursive:true,force:true});fs.renameSync(stage,output);return result;
}
module.exports={prepare,build,CSP,HEADERS,decorate};
if(require.main===module){const args=process.argv.slice(2);if(args.length>1){console.error('Usage: node scripts/build-staff-review.cjs [settings.json]');process.exitCode=1}else build(undefined,args[0]?SC.parse(fs.readFileSync(args[0],'utf8')):defaults()).then(r=>console.log('Prepared ignored staff package; '+r.manifest.sourceCommit+' / '+r.manifest.appCandidateHash+'; access control REQUIRED; pupil release BLOCKED.')).catch(e=>{console.error(e.message);process.exitCode=1})}
