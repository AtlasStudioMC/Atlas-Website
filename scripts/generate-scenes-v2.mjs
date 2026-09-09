// Distinct voxel scene types, not one generator reseeded.
//
// The first generator produced isometric terrain; changing its seed only changed where the bumps
// went, so every scene read as the same picture. This one has separate builders with different
// structure, camera and framing:
//
//   spikes  - tall ice spires on a frozen plain, big empty sky, vertical emphasis
//   cavern  - enclosed underground chamber, stalactites, glowing crystal, dark and framed
//   depths  - layered ocean cross-section, kelp columns, light shafts, horizontal banding
//
//   node scripts/generate-scenes-v2.mjs <type> <seed> <name>  ->  /tmp/voxgen/<name>.webp (+ -sm)
//
// Cool palette by construction; nothing needs recolouring afterwards.
import sharp from 'sharp';
import fs from 'fs';

const W = 2000, H = 1116;
const rngOf = (s) => () => { s |= 0; s = s + 0x6D2B79F5 | 0; let t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
const cl = v => Math.max(0, Math.min(255, Math.round(v)));
const hex = ([r, g, b]) => '#' + [r, g, b].map(v => cl(v).toString(16).padStart(2, '0')).join('');
const mix = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t);

function skyDefs(id, top, bottom) {
  return `<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="${hex(top)}"/><stop offset="100%" stop-color="${hex(bottom)}"/></linearGradient>`;
}
function stars(rng, n, maxY, o = []) {
  for (let i = 0; i < n; i++) o.push(`<circle cx="${(rng()*W).toFixed(1)}" cy="${(rng()*maxY).toFixed(1)}" r="${(rng()*1.3+0.3).toFixed(2)}" fill="#e6ecff" opacity="${(0.15+rng()*0.5).toFixed(2)}"/>`);
  return o;
}
// one voxel cube in isometric projection
function cube(x, y, w, h, top, left, right) {
  const hw = w / 2, hh = w / 4;
  return `<path d="M${x} ${y-hh}L${x+hw} ${y}L${x} ${y+hh}L${x-hw} ${y}Z" fill="${hex(top)}"/>`
       + `<path d="M${x-hw} ${y}L${x} ${y+hh}L${x} ${y+hh+h}L${x-hw} ${y+h}Z" fill="${hex(left)}"/>`
       + `<path d="M${x+hw} ${y}L${x} ${y+hh}L${x} ${y+hh+h}L${x+hw} ${y+h}Z" fill="${hex(right)}"/>`;
}

// ---------------------------------------------------------------- spikes
function spikes(seed) {
  const rng = rngOf(seed), o = [];
  const TOP = [10,14,32], HOR = [78,102,156], FOG = [78,102,156];
  o.push(`<defs>${skyDefs('sky', TOP, HOR)}</defs><rect width="${W}" height="${H}" fill="url(#sky)"/>`);
  stars(rng, 170, H * 0.55, o);
  // ground: a field of cubes rather than a flat fill, so the plane reads as blocks
  o.push(`<rect x="0" y="${H*0.66}" width="${W}" height="${H*0.34}" fill="${hex([70,90,136])}"/>`);
  for (let i = 0; i < 420; i++) {
    const d = rng(), x = rng()*W*1.06 - W*0.03, y = H*0.66 + d*H*0.36;
    const fog = Math.pow(1-d, 1.5)*0.85;
    const c = mix([150,176,214], FOG, fog);
    o.push(cube(x, y, (34+rng()*46)*(0.45+d), 22*(0.45+d), c, c.map(v=>v*0.76), c.map(v=>v*0.58)));
  }
  // spires, far to near so nearer ones overlap
  const spires = [];
  for (let i = 0; i < 46; i++) spires.push({ x: rng()*W*1.1 - W*0.05, d: rng() });
  spires.sort((a,b) => a.d - b.d);
  for (const s of spires) {
    const depth = s.d;                                  // 0 far .. 1 near
    const baseY = H*0.66 + depth*H*0.30;
    const hgt   = (90 + rng()*260) * (0.45 + depth*1.15);
    const wid   = (52 + rng()*70) * (0.5 + depth);   // chunky, not needles
    const fog   = Math.pow(1-depth, 1.5)*0.9;
    const ice   = mix([196,216,244], FOG, fog);
    const l = mix(ice.map(v=>v*0.72), FOG, fog), r = mix(ice.map(v=>v*0.52), FOG, fog);
    // stack cubes into a tapering spire
    const steps = Math.max(4, Math.round(hgt/34));
    for (let k = 0; k < steps; k++) {
      const t = k/steps, w = wid*(1-t*0.55), y = baseY - k*(hgt/steps);  // gentle taper
      o.push(cube(s.x, y, w, hgt/steps + 2, ice, l, r));
    }
  }
  return o.join('');
}

// ---------------------------------------------------------------- cavern
function cavern(seed) {
  const rng = rngOf(seed), o = [];
  const ROCK = [30,38,62], DEEP = [8,11,24], GLOW = [120,168,232];
  o.push(`<defs>
    <radialGradient id="glow" cx="50%" cy="62%" r="55%">
      <stop offset="0%" stop-color="${hex([54,84,142])}"/><stop offset="60%" stop-color="${hex([20,28,52])}"/>
      <stop offset="100%" stop-color="${hex(DEEP)}"/></radialGradient></defs>
    <rect width="${W}" height="${H}" fill="url(#glow)"/>`);
  const col = (d) => { const f = Math.pow(1-d, 1.3)*0.85; return mix(ROCK, DEEP, f); };
  // ceiling mass + stalactites
  for (let i = 0; i < 150; i++) {
    const x = rng()*W, d = rng(), w = 20 + rng()*54, len = 40 + rng()*260*(0.4+d);
    const c = col(d), l = c.map(v=>v*0.7), r = c.map(v=>v*0.5);
    const steps = Math.max(2, Math.round(len/30));
    for (let k = 0; k < steps; k++) {
      const t = k/steps;
      o.push(cube(x, 40 + k*(len/steps), w*(1-t*0.75), len/steps + 2, c, l, r));
    }
  }
  // floor mass + stalagmites
  for (let i = 0; i < 130; i++) {
    const x = rng()*W, d = rng(), w = 22 + rng()*58, len = 40 + rng()*230*(0.4+d);
    const c = col(d), l = c.map(v=>v*0.7), r = c.map(v=>v*0.5);
    const steps = Math.max(2, Math.round(len/30));
    for (let k = 0; k < steps; k++) {
      const t = k/steps;
      o.push(cube(x, H - 30 - k*(len/steps), w*(1-t*0.75), len/steps + 2, c, l, r));
    }
  }
  // crystal clusters: angular, rooted on the floor, lighting the rock around them
  o.push(`<defs><radialGradient id="cg"><stop offset="0%" stop-color="#8ab4ff" stop-opacity="0.15"/>
    <stop offset="100%" stop-color="#8ab4ff" stop-opacity="0"/></radialGradient></defs>`);
  for (let i = 0; i < 22; i++) {
    const bx = rng()*W, by = H*0.80 + rng()*H*0.16;          // sitting on the cave floor
    const n = 2 + Math.floor(rng()*3);
    o.push(`<circle cx="${bx}" cy="${by-40}" r="${80+rng()*60}" fill="url(#cg)"/>`);
    for (let c2 = 0; c2 < n; c2++) {
      const x = bx + (rng()-0.5)*70, hgt = 34 + rng()*74, w = 11 + rng()*15;
      const g = mix(GLOW, [214,234,255], rng()*0.55);
      const dark = g.map(v => v*0.55);
      // faceted shard: lit face + shaded face + tip
      o.push(`<path d="M${x} ${by-hgt}L${x+w} ${by-hgt*0.34}L${x+w} ${by}L${x} ${by+w*0.35}Z" fill="${hex(dark)}"/>`);
      o.push(`<path d="M${x} ${by-hgt}L${x-w} ${by-hgt*0.34}L${x-w} ${by}L${x} ${by+w*0.35}Z" fill="${hex(g)}"/>`);
    }
  }
  return o.join('');
}

// ---------------------------------------------------------------- depths
function depths(seed) {
  const rng = rngOf(seed), o = [];
  const SURF = [58,92,150], ABYSS = [6,10,26];
  o.push(`<defs>${skyDefs('water', SURF, ABYSS)}</defs><rect width="${W}" height="${H}" fill="url(#water)"/>`);
  // light shafts from the surface
  for (let i = 0; i < 14; i++) {
    const x = rng()*W, w = 40 + rng()*130, lean = (rng()-0.5)*160;
    o.push(`<path d="M${x} 0L${x+w} 0L${x+w+lean} ${H*0.8}L${x+lean} ${H*0.8}Z" fill="#a8c6ff" opacity="${(0.020+rng()*0.030).toFixed(3)}"/>`);
  }
  // kelp columns, far to near
  const kelp = [];
  for (let i = 0; i < 70; i++) kelp.push({ x: rng()*W, d: rng() });
  kelp.sort((a,b)=>a.d-b.d);
  for (const k of kelp) {
    const depth = k.d, fog = Math.pow(1-depth, 1.4)*0.92;
    const base = H*0.98, hgt = 180 + rng()*520*(0.4+depth), w = (14+rng()*16)*(0.5+depth);
    const c = mix([44,104,96], ABYSS, fog), l = mix(c.map(v=>v*0.7), ABYSS, fog), r = mix(c.map(v=>v*0.5), ABYSS, fog);
    const steps = Math.max(4, Math.round(hgt/28));
    let sway = 0;
    for (let s = 0; s < steps; s++) {
      sway += (rng()-0.5)*7;
      o.push(cube(k.x + sway, base - s*(hgt/steps), w, hgt/steps + 2, c, l, r));
    }
  }
  // seafloor
  for (let i = 0; i < 200; i++) {
    const x = rng()*W, d = rng(), fog = Math.pow(1-d,1.4)*0.9;
    const c = mix([52,64,94], ABYSS, fog);
    o.push(cube(x, H*0.9 + d*H*0.12, 40+rng()*50, 30, c, c.map(v=>v*0.7), c.map(v=>v*0.5)));
  }
  return o.join('');
}

const BUILDERS = { spikes, cavern, depths };
const type = process.argv[2], seed = Number(process.argv[3] || 1), name = process.argv[4] || type;
if (!BUILDERS[type]) { console.error('type must be one of: ' + Object.keys(BUILDERS).join(', ')); process.exit(1); }
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${BUILDERS[type](seed)}</svg>`;
fs.mkdirSync('/tmp/voxgen', { recursive: true });
await sharp(Buffer.from(svg), { limitInputPixels: false }).webp({ quality: 84 }).toFile(`/tmp/voxgen/${name}.webp`);
await sharp(`/tmp/voxgen/${name}.webp`).resize(1000).webp({ quality: 82 }).toFile(`/tmp/voxgen/${name}-sm.webp`);
console.log(`${type} -> /tmp/voxgen/${name}.webp`);
