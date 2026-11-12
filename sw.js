const C="bacr-v3",FB="https://www.gstatic.com/firebasejs/13.2.0/";
const LOCAL=["./","./index.html","./manifest.webmanifest","./icon-192.png?v=2","./icon-512.png?v=2"];
const EXT=[FB+"firebase-app.js",FB+"firebase-auth.js",FB+"firebase-firestore.js"];
async function warm(c){const seen=new Set(),q=[...EXT];while(q.length&&seen.size<80){const u=q.shift();if(seen.has(u))continue;seen.add(u);try{const r=await fetch(u,{mode:"cors"});if(!r.ok)continue;await c.put(u,r.clone());const t=await r.text();for(const m of t.matchAll(/(?:from|import)\s*\(?\s*["']((?:https:\/\/www\.gstatic\.com\/firebasejs\/|\.\.?\/)[^"']+\.js)["']/g)){const n=new URL(m[1],u).href;if(!seen.has(n))q.push(n)}}catch(e){}}}
self.addEventListener("install",e=>{e.waitUntil(caches.open(C).then(async c=>{await Promise.all(LOCAL.map(u=>c.add(u).catch(()=>{})));await warm(c)}).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
const hit=r=>caches.match(r,{ignoreVary:true,ignoreSearch:r.url.indexOf("firebasejs")<0});
self.addEventListener("fetch",e=>{const r=e.request;if(r.method!=="GET")return;const u=new URL(r.url);
 if(u.origin===location.origin){e.respondWith(Promise.race([fetch(r).then(x=>{if(x.ok){const cp=x.clone();caches.open(C).then(c=>c.put(r,cp))}return x}),new Promise((_,j)=>setTimeout(j,4000))]).catch(()=>hit(r).then(m=>m||caches.match("./index.html"))));return}
 if(u.hostname==="www.gstatic.com"&&u.pathname.indexOf("/firebasejs/")>=0){e.respondWith(hit(r).then(m=>m||fetch(r).then(x=>{const cp=x.clone();caches.open(C).then(c=>c.put(r,cp));return x})))}});
