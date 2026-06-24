/* =====================================================================
   GETTYSBURG FIELD COMPANION — ENGINE (mobile, GPS-aware)
===================================================================== */
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>[...r.querySelectorAll(s)];
function el(t,a={},h){const e=document.createElement(t);for(const k in a)e.setAttribute(k,a[k]);if(h!=null)e.innerHTML=h;return e;}
const SIL="data:image/svg+xml;base64,"+btoa("<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><rect width='120' height='120' fill='#1a212c'/><circle cx='60' cy='46' r='22' fill='#3a4654'/><path d='M22 110 q38-44 76 0' fill='#3a4654'/></svg>");
function img(k){return (window.GBASSETS&&GBASSETS[k])||SIL;}
function hasImg(k){return !!(window.GBASSETS&&GBASSETS[k]);}

/* ---- georef: real [lon,lat] -> map pixel [x,y] (least-squares affine) ---- */
function solve3(M,v){const A=M.map((r,i)=>r.concat(v[i]));
  for(let c=0;c<3;c++){let p=c;for(let r=c+1;r<3;r++)if(Math.abs(A[r][c])>Math.abs(A[p][c]))p=r;[A[c],A[p]]=[A[p],A[c]];const pv=A[c][c]||1e-9;
    for(let r=0;r<3;r++){if(r===c)continue;const f=A[r][c]/pv;for(let k=c;k<4;k++)A[r][k]-=f*A[c][k];}}
  return [A[0][3]/A[0][0],A[1][3]/A[1][1],A[2][3]/A[2][2]];}
let AFF;
(function fit(){let Sxx=0,Sxy=0,Sx=0,Syy=0,Sy=0,n=FC.ctrl.length,bX=[0,0,0],bY=[0,0,0];
  FC.ctrl.forEach(c=>{const x=c.ll[0],y=c.ll[1],ox=c.px[0],oy=c.px[1];
    Sxx+=x*x;Sxy+=x*y;Sx+=x;Syy+=y*y;Sy+=y;bX[0]+=x*ox;bX[1]+=y*ox;bX[2]+=ox;bY[0]+=x*oy;bY[1]+=y*oy;bY[2]+=oy;});
  const M=[[Sxx,Sxy,Sx],[Sxy,Syy,Sy],[Sx,Sy,n]];const X=solve3(M,bX),Y=solve3(M,bY);
  AFF={a:X[0],b:X[1],c:X[2],d:Y[0],e:Y[1],f:Y[2]};})();
function ll2px(lon,lat){return [AFF.a*lon+AFF.b*lat+AFF.c, AFF.d*lon+AFF.e*lat+AFF.f];}
// pixels per meter (for accuracy circle)
const _p0=ll2px(-77.235,39.81),_p1=ll2px(-77.235,39.811);
const PX_PER_M=Math.hypot(_p1[0]-_p0[0],_p1[1]-_p0[1])/111.32;
function haversine(la1,lo1,la2,lo2){const R=6371000,toR=Math.PI/180;
  const dLa=(la2-la1)*toR,dLo=(lo2-lo1)*toR;
  const x=Math.sin(dLa/2)**2+Math.cos(la1*toR)*Math.cos(la2*toR)*Math.sin(dLo/2)**2;
  return 2*R*Math.asin(Math.sqrt(x));}
function fmtDist(m){return m<1000?Math.round(m/5)*5+" m":(m/1609.34).toFixed(1)+" mi";}

/* ---- visited state ---- */
const VIS=JSON.parse(localStorage.getItem("fc_visited")||"{}");
function markVisited(id){VIS[id]=1;localStorage.setItem("fc_visited",JSON.stringify(VIS));}

/* ---- MAP: pan / zoom ---- */
const mapView=$("#mapView"),inner=$("#mapInner"),mapImg=$("#mapImg");
let MW=FC.map.w,MH=FC.map.h,scale=1,tx=0,ty=0,minScale=0.2;
mapImg.src=img(FC.map.key); mapImg.width=MW; mapImg.height=MH; inner.style.width=MW+"px"; inner.style.height=MH+"px";
function applyT(){inner.style.transform=`translate(${tx}px,${ty}px) scale(${scale})`;}
function clampT(){const vw=mapView.clientWidth,vh=mapView.clientHeight;
  const w=MW*scale,h=MH*scale;
  if(w<=vw)tx=(vw-w)/2; else tx=Math.min(0,Math.max(vw-w,tx));
  if(h<=vh)ty=(vh-h)/2; else ty=Math.min(0,Math.max(vh-h,ty));}
function fit(){const vw=mapView.clientWidth,vh=mapView.clientHeight;
  minScale=Math.min(vw/MW,vh/MH);scale=Math.max(vw/MW, minScale);tx=0;ty=0;clampT();applyT();}
function centerOn(px,py,zoom){const vw=mapView.clientWidth,vh=mapView.clientHeight;
  if(zoom)scale=Math.min(2.2,Math.max(scale,vw/MW*2.4));
  tx=vw/2-px*scale;ty=vh/2-py*scale;clampT();applyT();}
$("#zin").onclick=()=>zoomAt(mapView.clientWidth/2,mapView.clientHeight/2,1.4);
$("#zout").onclick=()=>zoomAt(mapView.clientWidth/2,mapView.clientHeight/2,1/1.4);
$("#fitBtn").onclick=fit;
function zoomAt(cx,cy,f){const ns=Math.min(3,Math.max(minScale,scale*f));
  const ix=(cx-tx)/scale,iy=(cy-ty)/scale;scale=ns;tx=cx-ix*scale;ty=cy-iy*scale;clampT();applyT();}
// pointer pan + pinch
const ptrs=new Map();let pinchD=0,pinchMid=null;
mapView.addEventListener("pointerdown",e=>{ptrs.set(e.pointerId,{x:e.clientX,y:e.clientY});mapView.setPointerCapture(e.pointerId);});
mapView.addEventListener("pointermove",e=>{if(!ptrs.has(e.pointerId))return;
  const prev=ptrs.get(e.pointerId);ptrs.set(e.pointerId,{x:e.clientX,y:e.clientY});
  if(ptrs.size===1){tx+=e.clientX-prev.x;ty+=e.clientY-prev.y;clampT();applyT();}
  else if(ptrs.size===2){const p=[...ptrs.values()];const d=Math.hypot(p[0].x-p[1].x,p[0].y-p[1].y);
    const mid={x:(p[0].x+p[1].x)/2,y:(p[0].y+p[1].y)/2};
    if(pinchD){zoomAt(mid.x,mid.y,d/pinchD);}pinchD=d;pinchMid=mid;}});
function endPtr(e){ptrs.delete(e.pointerId);if(ptrs.size<2){pinchD=0;}}
mapView.addEventListener("pointerup",endPtr);mapView.addEventListener("pointercancel",endPtr);
mapView.addEventListener("wheel",e=>{e.preventDefault();zoomAt(e.clientX,e.clientY,e.deltaY<0?1.12:1/1.12);},{passive:false});

/* ---- stand markers ---- */
const userDot=$("#userDot"),accCircle=$("#accuracy");
function renderMarkers(){
  $$(".stand-mk",inner).forEach(n=>n.remove());
  FC.stands.forEach((s,i)=>{const p=ll2px(s.lon,s.lat);
    const m=el("div",{class:"stand-mk"});m.style.left=p[0]+"px";m.style.top=p[1]+"px";
    m.innerHTML=`<div class="dotc">${i+1}</div>`;
    m.onclick=()=>openStand(s.id);
    inner.insertBefore(m,userDot);});
}

/* ---- GPS ---- */
let watchId=null,lastPos=null,curStand=null;
function gps(on){
  if(!("geolocation" in navigator)){setChip("err","No GPS");return;}
  if(on&&watchId==null){
    setChip("","Locating…");
    watchId=navigator.geolocation.watchPosition(onPos,onGpsErr,{enableHighAccuracy:true,maximumAge:3000,timeout:20000});
  }
}
function setChip(cls,txt){const c=$("#gpsChip");c.className="gps-chip"+(cls?" "+cls:"");$("#gpsTxt").textContent=txt;}
function onGpsErr(e){setChip("err", e.code===1?"GPS denied":"GPS error");}
function onPos(pos){
  const {latitude:la,longitude:lo,accuracy:ac}=pos.coords;lastPos={la,lo,ac};
  setChip("on","GPS on ±"+Math.round(ac)+"m");
  const p=ll2px(lo,la);
  userDot.classList.remove("hidden");userDot.style.left=p[0]+"px";userDot.style.top=p[1]+"px";
  const rpx=Math.max(8,(ac||20)*PX_PER_M);
  accCircle.classList.remove("hidden");accCircle.style.left=p[0]+"px";accCircle.style.top=p[1]+"px";
  accCircle.style.width=accCircle.style.height=(rpx*2)+"px";
  // nearest
  let best=null,bd=1e12;FC.stands.forEach(s=>{const d=haversine(la,lo,s.lat,s.lon);if(d<bd){bd=d;best=s;}});
  showNear(best,bd);
  // proximity trigger
  if(best&&bd<=best.r){ if(curStand!==best.id){curStand=best.id;arrived(best,bd);} }
  else curStand=null;
}
function showNear(s,d){const b=$("#nearBanner");if(!s){b.classList.add("hidden");return;}
  b.classList.remove("hidden");$("#nbName").textContent=s.name;
  const at=d<=s.r;$("#nbDist").textContent=at?"You are here":fmtDist(d);
  $("#nbName").style.color=at?"var(--good)":"";
  $("#nbGo").onclick=()=>openStand(s.id);}
function arrived(s,d){
  markVisited(s.id);renderList&&renderList();
  if(navigator.vibrate)navigator.vibrate([40,60,40]);
  toast("📍 You've reached "+s.name+" — tap to read",()=>openStand(s.id));
  centerOn.apply(null,[...ll2px(s.lon,s.lat),false]);
}
$("#locateBtn").onclick=()=>{
  if(!("geolocation" in navigator)){toast("Geolocation not supported on this device");return;}
  navigator.geolocation.getCurrentPosition(p=>{onPos(p);centerOn(...ll2px(p.coords.longitude,p.coords.latitude),true);gps(true);},
    onGpsErr,{enableHighAccuracy:true,timeout:20000});
};
// testing hook: window.fcSim(lat,lon)
window.fcSim=(la,lo,ac=15)=>onPos({coords:{latitude:la,longitude:lo,accuracy:ac}});

/* ---- TOASTS ---- */
function toast(msg,onTap){const host=$("#toast-host");host.innerHTML="";
  const t=el("div",{class:"toast"});t.textContent=msg;if(onTap)t.onclick=()=>{onTap();t.remove();};
  host.appendChild(t);setTimeout(()=>{t.parentNode&&t.remove();},5200);}

/* ---- SHEET ---- */
function openSheet(html){const sh=$("#sheet");
  sh.innerHTML=`<div class="sheet-card"><button class="sheet-close">✕</button><div class="sheet-grab"></div><div class="sheet-body">${html}</div></div>`;
  sh.classList.remove("hidden");
  sh.querySelector(".sheet-close").onclick=closeSheet;
  sh.onclick=e=>{if(e.target===sh)closeSheet();};
}
function closeSheet(){$("#sheet").classList.add("hidden");$("#sheet").innerHTML="";}
function sd(side){return `<span class="sd" style="background:${side==="union"?"var(--union)":"var(--conf)"}"></span>`;}

function openStand(id){
  const s=FC.stands.find(x=>x.id===id);if(!s)return;markVisited(id);renderList();
  let h=`<div class="eyebrow">${s.day}</div><h2>${s.name}</h2>`;
  const idx=FC.stands.indexOf(s)+1;h=`<div class="eyebrow">Stand ${idx} · ${s.day}</div><h2>${s.name}</h2>`;
  if(s.photo){h+=`<img class="sheet-img" src="${img(s.photo)}" alt="${s.name}">`;
    const meta=(window.__IMGMETA||{})[s.photo];if(meta)h+=`<div class="cap">${meta.title}${hasImg(s.photo)?"":" — (no period photo; marker locates the site)"}</div>`;}
  h+=`<p>${s.what}</p>`;
  if(s.decision){const d=s.decision;
    h+=`<div class="block decision"><h4>⚔ Decision — ${d.who}</h4><p class="qq">${d.q}</p>
      <div style="font-size:13.5px"><b class="hist">What happened:</b> ${d.history}</div>
      <div style="font-size:13.5px;margin-top:8px"><b style="color:#8fb6e0">Teaching point:</b> ${d.teach}</div></div>`;}
  if(s.discuss&&s.discuss.length){h+=`<div class="block discuss"><h4>⏸ Discussion</h4><ol class="qlist">${s.discuss.map(q=>`<li>${q}</li>`).join("")}</ol></div>`;}
  if(s.people&&s.people.length){h+=`<div class="block"><h4>Who was here</h4><div class="ppl-chips">`+
    s.people.map(k=>{const p=FC.people[k];if(!p)return"";return `<button class="chip" onclick="openPerson('${k}')"><img src="${img(k)}">${sd(p.side)}${p.name.split(". ").pop()}</button>`;}).join("")+`</div></div>`;}
  h+=`<button class="btn" onclick="(function(){closeSheet();showView('map');centerOn(${ll2px(s.lon,s.lat).map(v=>v.toFixed(1)).join(",")},true);})()">Show on map</button>`;
  openSheet(h);
}
window.openStand=openStand;

function openPerson(k){const p=FC.people[k];if(!p)return;
  const at=FC.stands.filter(s=>(s.people||[]).includes(k));
  let h=`<div class="eyebrow">${p.side==="union"?"Union":"Confederate"}</div><h2>${sd(p.side)}${p.name}</h2><div class="day">${p.role}</div>`;
  h+=`<img class="sheet-img" style="max-width:200px;border-radius:12px" src="${img(k)}" alt="${p.name}">`;
  const meta=(window.__IMGMETA||{})[k];if(meta)h+=`<div class="cap">${meta.license||""}</div>`;
  if(at.length){h+=`<div class="block"><h4>Featured at these stands</h4>`+
    at.map(s=>`<div class="stand-card" style="margin:6px 0" onclick="openStand('${s.id}')"><div class="num">${FC.stands.indexOf(s)+1}</div><div><div class="sc-n" style="font-size:14px">${s.name}</div><div class="sc-d">${s.day}</div></div><div class="chev">›</div></div>`).join("")+`</div>`;}
  openSheet(h);
}
window.openPerson=openPerson;
window.closeSheet=closeSheet;window.showView=showView;window.centerOn=centerOn;

/* ---- LISTS ---- */
function renderList(){const w=$("#listWrap");
  w.innerHTML=`<div class="sec-h">Staff Ride · ${FC.stands.length} Stands</div>`+
    FC.stands.map((s,i)=>`<div class="stand-card" onclick="openStand('${s.id}')">
      <div class="num">${i+1}</div>
      <div><div class="sc-n">${s.name}${VIS[s.id]?'<span class="visited-tag">✓ visited</span>':''}</div><div class="sc-d">${s.day}</div></div>
      <div class="chev">›</div></div>`).join("")+
    `<div class="install-hint">Tap a stand to read it now, or let GPS prompt you on the field.</div>`;
}
function renderPeople(){const w=$("#peopleWrap");
  const order=Object.keys(FC.people);
  w.innerHTML=`<div class="sec-h">Confederate</div>`+
    order.filter(k=>FC.people[k].side==="conf").map(k=>personRow(k)).join("")+
    `<div class="sec-h">Union</div>`+
    order.filter(k=>FC.people[k].side==="union").map(k=>personRow(k)).join("");
}
function personRow(k){const p=FC.people[k];
  return `<div class="person-row" onclick="openPerson('${k}')"><img src="${img(k)}"><div><div class="pn">${sd(p.side)}${p.name}</div><div class="pr">${p.role}</div></div></div>`;}
function renderAbout(){$("#aboutWrap").innerHTML=`
  <div class="sec-h">About</div>
  <p style="padding:0 4px">A GPS-aware field companion for the <b>U.S. Army War College</b> Gettysburg staff ride. As you walk the field, your location surfaces the events, the commander's decision, and the discussion questions for the ground you're standing on.</p>
  <div class="block"><h4>Using GPS on the field</h4><p style="margin:0;font-size:13.5px">Tap <b>◎ Locate</b> (map screen) and allow location access. The map shows your position; when you reach a stand you'll be prompted automatically. GPS works offline — no signal needed.</p></div>
  <div class="block"><h4>Install on your phone</h4><p style="margin:0;font-size:13.5px"><b>iPhone (Safari):</b> Share → <b>Add to Home Screen</b>.<br><b>Android (Chrome):</b> menu ⋮ → <b>Install app</b> / Add to Home screen.<br>Once installed it runs full-screen and <b>fully offline</b>.</p></div>
  <div class="block"><h4>Credits</h4><p style="margin:0;font-size:12.5px;color:var(--dim)">Base map: U.S. War Dept. (Cope) contour survey, Library of Congress. Photographs: public domain (LOC / Wikimedia). Interpretation synthesizes the standard accounts (OR; Coddington; Sears; Trudeau; NPS). Companion to the Gettysburg Staff Ride Simulator. Coordinates are approximate — follow NPS signage and your FI on the ground.</p></div>`;
}

/* ---- NAV ---- */
function showView(v){
  $$("#stage .view").forEach(s=>s.classList.add("hidden"));
  ({map:"mapView",list:"listView",people:"peopleView",about:"aboutView"})[v];
  $("#"+({map:"mapView",list:"listView",people:"peopleView",about:"aboutView"})[v]).classList.remove("hidden");
  $$("#nav button").forEach(b=>b.classList.toggle("active",b.dataset.v===v));
  if(v==="map"){requestAnimationFrame(()=>{if(scale<=0.001||!isFinite(scale))fit();applyT();});}
}
$$("#nav button").forEach(b=>b.onclick=()=>showView(b.dataset.v));

/* ---- BOOT ---- */
function boot(){
  renderMarkers();renderList();renderPeople();renderAbout();
  mapImg.complete?fit():(mapImg.onload=fit);
  fit();
  // gentle prompt to enable location
  setTimeout(()=>{if(!lastPos)toast("Tap ◎ to enable GPS and walk the field",null);},1400);
}
boot();
