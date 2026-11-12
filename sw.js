/* Crescent Load & Delivery Check - keeps the app on the phone so it opens with no signal */
var CACHE='crescent-check-v0.3.1';
var OWN=['./','./index.html','./manifest.webmanifest','./icon-180.png','./icon-512.png'];
var LIB='https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.js';
self.addEventListener('install',function(e){
  e.waitUntil(caches.open(CACHE).then(function(c){
    return c.addAll(OWN).then(function(){ return c.add(LIB).catch(function(){}); });
  }).then(function(){ return self.skipWaiting(); }));
});
self.addEventListener('activate',function(e){
  e.waitUntil(caches.keys().then(function(ks){ return Promise.all(ks.filter(function(k){ return k!==CACHE; }).map(function(k){ return caches.delete(k); })); }).then(function(){ return self.clients.claim(); }));
});
self.addEventListener('fetch',function(e){
  if(e.request.method!=='GET') return;
  e.respondWith(caches.open(CACHE).then(function(c){
    return c.match(e.request,{ignoreSearch:true}).then(function(hit){
      var net=fetch(e.request).then(function(r){ if(r&&(r.ok||r.type==='opaque')) c.put(e.request,r.clone()); return r; });
      if(hit){ net.catch(function(){}); return hit; }
      return net;
    });
  }));
});
