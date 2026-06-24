const { chromium } = require('playwright');
function star(cx,cy,R,r,n){let d="";for(let i=0;i<n*2;i++){const a=Math.PI/n*i-Math.PI/2,rad=i%2?r:R;d+=(i?"L":"M")+(cx+rad*Math.cos(a)).toFixed(1)+","+(cy+rad*Math.sin(a)).toFixed(1);}return d+"Z";}
function svg(maskable){
  const S=512, pad=maskable?64:0, k=(S-2*pad)/512; // scale content
  const cx=S/2, cy=S/2;
  const g=v=>pad+v*k;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${S}" height="${S}" viewBox="0 0 ${S} ${S}">
   <defs><radialGradient id="bg" cx="50%" cy="38%" r="75%">
     <stop offset="0%" stop-color="#1b2330"/><stop offset="100%" stop-color="#0e1218"/></radialGradient></defs>
   <rect width="${S}" height="${S}" fill="#0e1218"/>
   <rect x="${g(36)}" y="${g(36)}" width="${440*k}" height="${440*k}" rx="${70*k}" fill="url(#bg)" stroke="#c9a14a" stroke-width="${10*k}"/>
   <path d="${star(cx,g(196),k*92,k*40,5)}" fill="#c9a14a" stroke="#5a3d0a" stroke-width="${4*k}"/>
   <text x="${cx}" y="${g(330)}" text-anchor="middle" font-family="Georgia,serif" font-weight="700" font-size="${64*k}" letter-spacing="${2*k}" fill="#efe5cb">GETTYSBURG</text>
   <text x="${cx}" y="${g(396)}" text-anchor="middle" font-family="Georgia,serif" font-size="${44*k}" letter-spacing="${8*k}" fill="#c0463c">1863</text>
   <text x="${cx}" y="${g(446)}" text-anchor="middle" font-family="-apple-system,Arial" font-size="${22*k}" letter-spacing="${3*k}" fill="#a7a293">FIELD COMPANION</text>
  </svg>`;
}
(async()=>{
  const b=await chromium.launch();const p=await b.newPage({viewport:{width:512,height:512},deviceScaleFactor:1});
  for(const [name,size,mask] of [["icon-512.png",512,false],["icon-192.png",192,false],["icon-512-maskable.png",512,true]]){
    const s=svg(mask).replace('width="512" height="512"',`width="${size}" height="${size}"`);
    await p.setContent(`<body style="margin:0">${s}</body>`);
    await p.setViewportSize({width:size,height:size});
    await p.waitForTimeout(150);
    await (await p.$('svg')).screenshot({path:name});
    console.log("wrote",name,size);
  }
  await b.close();
})();
