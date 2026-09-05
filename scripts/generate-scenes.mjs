// Generates the voxel landscape artwork used as page backdrops.
//
// The scenes are procedurally rendered rather than sourced: original artwork, no Minecraft assets
// or screenshots involved. Deterministic from the seed, so re-running reproduces the same scene.
//
//   node scripts/generate-scenes.mjs <seed> <name>   ->  /tmp/voxgen/<name>.webp (+ -sm)
//
// Palette is cool-only by construction - every block colour, the sky gradient and the fog are
// blues and greys, so the artwork matches the site without any post-hoc recolouring.
import sharp from 'sharp';
import fs from 'fs';

// --- deterministic value noise -------------------------------------------------
function mulberry(seed){return()=>{seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
function makeNoise(seed){
  const r=mulberry(seed), G=256, g=new Float64Array(G*G);
  for(let i=0;i<G*G;i++) g[i]=r();
  const at=(x,y)=>g[((y&255)*G)+(x&255)];
  const smooth=t=>t*t*(3-2*t);
  return (x,y)=>{
    const xi=Math.floor(x), yi=Math.floor(y), xf=x-xi, yf=y-yi;
    const u=smooth(xf), v=smooth(yf);
    const a=at(xi,yi), b=at(xi+1,yi), c=at(xi,yi+1), d=at(xi+1,yi+1);
    return (a*(1-u)+b*u)*(1-v) + (c*(1-u)+d*u)*v;
  };
}
function fbm(n,x,y,oct=5){let s=0,amp=0.5,f=1,norm=0;for(let i=0;i<oct;i++){s+=n(x*f,y*f)*amp;norm+=amp;amp*=0.5;f*=2;}return s/norm;}

// --- palette (cool only) -------------------------------------------------------
const SKY_TOP=[8,11,26], SKY_HORIZON=[46,58,104], FOG=[46,58,104];
function lerp(a,b,t){return a+(b-a)*t;}
function mix(c1,c2,t){return [lerp(c1[0],c2[0],t),lerp(c1[1],c2[1],t),lerp(c1[2],c2[2],t)];}
function hex([r,g,b]){const c=v=>Math.max(0,Math.min(255,Math.round(v))).toString(16).padStart(2,'0');return '#'+c(r)+c(g)+c(b);}

// height 0..1 -> block colour, all cool
function blockColor(h){
  if(h<0.30) return [38,64,120];    // deep ice water
  if(h<0.38) return [70,110,168];   // shallow ice
  if(h<0.46) return [126,158,196];  // frozen shore
  if(h<0.62) return [58,72,116];    // cold stone
  if(h<0.74) return [92,106,150];   // lighter stone
  if(h<0.86) return [176,192,222];  // snow
  return [226,234,248];             // bright snow cap
}

const W=2000, H=1116;
const GX=190, GZ=190;            // grid columns
const TW=26, TH=13, BH=10;       // iso tile width/height, block height
const seed=Number(process.argv[2]||7);
const noise=makeNoise(seed), tree=makeNoise(seed+991);

const heights=[], colors=[];
for(let z=0;z<GZ;z++){
  heights.push([]); colors.push([]);
  for(let x=0;x<GX;x++){
    let h=fbm(noise,x/34,z/34,5);
    h=Math.pow(h,1.35);                                   // flatten lowlands
    const ridge=Math.abs(fbm(noise,x/70+40,z/70+40,3)-0.5)*2;
    h=h*0.62+(1-ridge)*0.38;                              // add ridgelines
    heights[z].push(h); colors[z].push(blockColor(h));
  }
}

// --- build SVG -----------------------------------------------------------------
const out=[];
out.push(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">`);
out.push(`<defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
<stop offset="0%" stop-color="${hex(SKY_TOP)}"/><stop offset="20%" stop-color="${hex(mix(SKY_TOP,SKY_HORIZON,0.55))}"/>
<stop offset="34%" stop-color="${hex(SKY_HORIZON)}"/><stop offset="100%" stop-color="${hex(SKY_HORIZON)}"/></linearGradient></defs>`);
out.push(`<rect width="${W}" height="${H}" fill="url(#sky)"/>`);

// stars
const sr=mulberry(seed+5);
for(let i=0;i<150;i++){
  const sx=sr()*W, sy=sr()*H*0.5, o=(0.15+sr()*0.5).toFixed(2), r=(sr()*1.3+0.3).toFixed(2);
  out.push(`<circle cx="${sx.toFixed(1)}" cy="${sy.toFixed(1)}" r="${r}" fill="#dfe6ff" opacity="${o}"/>`);
}

const originX=W*0.5, originY=H*0.40;
const maxD=GX+GZ;
// painter's algorithm: far (small x+z) first
for(let d=0; d<maxD; d++){
  for(let x=0;x<GX;x++){
    const z=d-x; if(z<0||z>=GZ) continue;
    const h=heights[z][x];
    const top=Math.round(h*24);                       // quantise to block steps
    const sx=originX+(x-z)*(TW/2);
    const sy=originY+(x+z)*(TH/2)-top*BH;
    if(sx<-TW||sx>W+TW||sy<-60||sy>H+80) continue;
    const depth=d/maxD;                               // 0 far .. 1 near
    const fogT=Math.pow(1-depth,1.45)*0.985;          // dissolves the far grid edge into the sky
    const base=colors[z][x];
    const tp=mix(base,FOG,fogT), lf=mix(base.map(v=>v*0.62),FOG,fogT), rf=mix(base.map(v=>v*0.42),FOG,fogT);
    const hw=TW/2, hh=TH/2;
    out.push(`<path d="M${sx} ${sy-hh}L${sx+hw} ${sy}L${sx} ${sy+hh}L${sx-hw} ${sy}Z" fill="${hex(tp)}"/>`);
    out.push(`<path d="M${sx-hw} ${sy}L${sx} ${sy+hh}L${sx} ${sy+hh+BH}L${sx-hw} ${sy+BH}Z" fill="${hex(lf)}"/>`);
    out.push(`<path d="M${sx+hw} ${sy}L${sx} ${sy+hh}L${sx} ${sy+hh+BH}L${sx+hw} ${sy+BH}Z" fill="${hex(rf)}"/>`);
    // blocky pines on mid-altitude land
    if(h>0.50&&h<0.84&&tree(x*0.9,z*0.9)>0.79){
      const th=3+Math.floor(tree(x*2.1,z*2.1)*3);
      for(let t=0;t<th;t++){
        const ty=sy-t*BH, w=(t<th-1? hw*0.72 : hw*0.4);
        const lc=mix([44,86,96],FOG,fogT), ls=mix([30,60,70],FOG,fogT);
        out.push(`<path d="M${sx} ${ty-hh*0.7}L${sx+w} ${ty}L${sx} ${ty+hh*0.7}L${sx-w} ${ty}Z" fill="${hex(lc)}"/>`);
        out.push(`<path d="M${sx-w} ${ty}L${sx} ${ty+hh*0.7}L${sx} ${ty+hh*0.7+BH*0.5}L${sx-w} ${ty+BH*0.5}Z" fill="${hex(ls)}"/>`);
      }
    }
  }
}
out.push(`</svg>`);
const svg=out.join('');
fs.writeFileSync('/tmp/voxgen/scene.svg', svg);
console.log('svg bytes', svg.length);
const outName=process.argv[3]||'preview';
await sharp(Buffer.from(svg), {limitInputPixels:false}).webp({quality:84}).toFile('/tmp/voxgen/'+outName+'.webp');
await sharp('/tmp/voxgen/'+outName+'.webp').resize(1000).webp({quality:82}).toFile('/tmp/voxgen/'+outName+'-sm.webp');
console.log('rendered');
