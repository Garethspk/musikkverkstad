/* LOOPBACK TEST FIXTURE ONLY. Public dummy credentials; not municipal authentication/TLS. */
const http=require('node:http'),fs=require('node:fs'),path=require('node:path');
const {HEADERS}=require('../../scripts/build-staff-review.cjs');
const auth='Basic '+Buffer.from('fixture-staff:fixture-only').toString('base64');
const mime={'.html':'text/html; charset=utf-8','.mp3':'audio/mpeg','.txt':'text/plain; charset=utf-8','.md':'text/plain; charset=utf-8','.json':'application/json','.sha256':'text/plain; charset=utf-8'};
http.createServer((req,res)=>{
 for(const [k,v]of Object.entries(HEADERS))res.setHeader(k,v);
 if(req.headers.authorization!==auth){res.writeHead(401,{'WWW-Authenticate':'Basic realm="Loopback fixture only"'});res.end('Staff fixture access required');return}
 if(!['GET','HEAD'].includes(req.method)){res.writeHead(405);res.end();return}
 const url=new URL(req.url,'http://127.0.0.1'),match=url.pathname.match(/^\/review\/(full|restricted)(\/.*)?$/);
 if(!match){res.writeHead(404);res.end();return}
 if(!match[2]){res.writeHead(302,{Location:url.pathname+'/'});res.end();return}
 const relative=match[2]==='/'?'index.html':match[2].slice(1),site=path.resolve('.quality/staff-review',match[1],'site');
 const manifest=JSON.parse(fs.readFileSync(path.join(site,'staff-review-manifest.json'))),allowed=[...manifest.files.map(f=>f.path),'staff-review-manifest.json','checksums.sha256'];
 if(!allowed.includes(relative)){res.writeHead(404);res.end();return}
 const file=path.join(site,relative),bytes=fs.readFileSync(file);res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream','Content-Length':bytes.length});res.end(req.method==='HEAD'?undefined:bytes);
}).listen(8768,'127.0.0.1');
