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


// ---------------------------------------------------------------- aurora
// Night sky with aurora curtains over a blocky snowfield. Built for the Aurora
// product, so the light is the subject and the ground is a dark, quiet base.
function aurora(seed) {
  const rng = rngOf(seed), o = [];
  const TOP = [7,10,26], HOR = [40,58,104], FOG = [40,58,104];
  const bands = [
    { hue: [ 96,232,196], x: W*0.21, amp: 128, w: 340, op: 0.50, reach: 1.00 },
    { hue: [ 84,186,255], x: W*0.44, amp: 168, w: 420, op: 0.46, reach: 0.78 },
    { hue: [146,126,242], x: W*0.66, amp: 108, w: 300, op: 0.38, reach: 0.94 },
    { hue: [ 96,216,255], x: W*0.86, amp:  88, w: 250, op: 0.30, reach: 0.66 },
  ];
  o.push(`<defs>${skyDefs('sky', TOP, HOR)}
    <filter id="soft" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="17"/></filter>
    ${bands.map((b,i) => `<linearGradient id="au${i}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${hex(b.hue)}" stop-opacity="0"/>
      <stop offset="34%" stop-color="${hex(b.hue)}" stop-opacity="${b.op}"/>
      <stop offset="100%" stop-color="${hex(b.hue)}" stop-opacity="0"/>
    </linearGradient>`).join('')}
  </defs><rect width="${W}" height="${H}" fill="url(#sky)"/>`);
  stars(rng, 220, H * 0.6, o);

  // Each curtain is a stack of narrow vertical slices following a sine, which reads as
  // folded light rather than a flat painted ribbon.
  for (let i = 0; i < bands.length; i++) {
    const b = bands[i], slices = 46, top = H*0.04, bot = H*0.62;
    const parts = [];
    for (let k = 0; k < slices; k++) {
      const t = k/slices;
      // Two sines at different rates: one folds the curtain sideways, the other lifts and
      // drops its top edge. A flat top edge is what made these look like painted columns.
      const sx = b.x + Math.sin(t*Math.PI*1.7 + i) * b.amp + (rng()-0.5)*14;
      const sw = (b.w/slices) * (1.25 - Math.abs(t-0.5));
      // One gentle period across the curtain, not several: multiple periods put symmetric
      // notches in the top edge and the whole thing starts reading as a letterform.
      const drape = Math.sin(t*Math.PI*0.85 + i*0.9);
      const y0 = top + (bot-top)*0.10*(0.5 + 0.5*drape) + (rng()-0.5)*10;
      const h  = (bot - y0) * (0.78 + 0.22*Math.sin(t*Math.PI)) * b.reach;
      parts.push(`<rect x="${(sx-sw/2).toFixed(1)}" y="${y0.toFixed(1)}" width="${sw.toFixed(1)}" height="${Math.max(8,h).toFixed(1)}" fill="url(#au${i})"/>`);
    }
    o.push(`<g filter="url(#soft)">${parts.join('')}</g>`);
  }

  // snowfield
  o.push(`<rect x="0" y="${H*0.68}" width="${W}" height="${H*0.32}" fill="${hex([34,48,86])}"/>`);
  for (let i = 0; i < 460; i++) {
    const d = rng(), x = rng()*W*1.06 - W*0.03, y = H*0.68 + d*H*0.34;
    const fog = Math.pow(1-d, 1.4)*0.88;
    const c = mix([182,204,238], FOG, fog);
    o.push(cube(x, y, (32+rng()*44)*(0.45+d), 20*(0.45+d), c, c.map(v=>v*0.74), c.map(v=>v*0.55)));
  }
  // pines, stacked cubes tapering to a point
  const pines = [];
  for (let i = 0; i < 26; i++) pines.push({ x: rng()*W*1.08 - W*0.04, d: rng() });
  pines.sort((a,b) => a.d - b.d);
  for (const t of pines) {
    const baseY = H*0.70 + t.d*H*0.28, hgt = (70 + rng()*110) * (0.5 + t.d);
    const fog = Math.pow(1-t.d, 1.4)*0.9;
    const nd = mix([28,62,64], FOG, fog);
    const steps = Math.max(4, Math.round(hgt/26));
    for (let k = 0; k < steps; k++) {
      const f = k/steps, w = (46 + t.d*34) * (1 - f*0.82);
      o.push(cube(t.x, baseY - k*(hgt/steps), w, hgt/steps + 2, nd, nd.map(v=>v*0.7), nd.map(v=>v*0.5)));
    }
  }
  return o.join('');
}

// ---------------------------------------------------------------- islands
// Voxel islands adrift over open sky. Horizontal and airy, so it works as a
// full-bleed band between two sections of text.
function islands(seed) {
  const rng = rngOf(seed), o = [];
  const TOP = [12,20,48], HOR = [92,126,190], FOG = [92,126,190];
  o.push(`<defs>${skyDefs('sky', TOP, HOR)}
    <linearGradient id="fall" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${hex([150,198,246])}" stop-opacity="0.92"/>
      <stop offset="100%" stop-color="${hex([120,170,226])}" stop-opacity="0"/>
    </linearGradient></defs><rect width="${W}" height="${H}" fill="url(#sky)"/>`);
  stars(rng, 90, H * 0.34, o);

  const isles = [];
  for (let i = 0; i < 9; i++) isles.push({ x: rng()*W*1.02 - W*0.01, y: H*(0.16 + rng()*0.62), d: rng() });
  isles.sort((a,b) => a.d - b.d);

  for (const is of isles) {
    const fog = Math.pow(1-is.d, 1.35)*0.9;
    const span = (150 + rng()*300) * (0.4 + is.d);     // how wide the top plate is
    const grass = mix([116,186,120], FOG, fog);
    const dirt  = mix([126,94,66],  FOG, fog);
    const rock  = mix([96,104,124], FOG, fog);
    const cw = 34 * (0.45 + is.d);
    const cols = Math.max(3, Math.round(span / (cw*0.55)));

    // underside first: a rough cone of stone hanging below the plate
    for (let layer = 1; layer < Math.round(6 + is.d*7); layer++) {
      const shrink = 1 - layer/ (7 + is.d*7);
      const n = Math.max(1, Math.round(cols*shrink*0.9));
      for (let c = 0; c < n; c++) {
        const x = is.x + (c - (n-1)/2) * cw*0.55 + (rng()-0.5)*cw*0.25;
        o.push(cube(x, is.y + layer*cw*0.30, cw*(0.9+rng()*0.2), cw*0.4, rock, rock.map(v=>v*0.72), rock.map(v=>v*0.52)));
      }
    }
    // Dirt course then grass, laid out as an isometric grid. A single row of cubes reads as
    // a flat slice cut out of card; rows stepping back and up give the plate a surface.
    const rows = Math.max(2, Math.round(3 + is.d*3));
    for (const [dy, col] of [[cw*0.22, dirt], [0, grass]]) {
      for (let r = rows - 1; r >= 0; r--) {              // back rows first
        const ox = (r - (rows-1)/2) * cw*0.5;
        const oy = -(r - (rows-1)/2) * cw*0.25;
        for (let c = 0; c < cols; c++) {
          const x = is.x + ox + (c - (cols-1)/2) * cw*0.5 + (rng()-0.5)*cw*0.1;
          const shade = (1 - r*0.035) * (0.94 + rng()*0.12);  // row depth plus per-block variation
          const cc = col.map(v => v*shade);
          o.push(cube(x, is.y + dy + oy, cw*(0.96+rng()*0.1), cw*0.34, cc, cc.map(v=>v*0.74), cc.map(v=>v*0.54)));
        }
      }
    }
    // a thin fall of water off the larger, nearer islands, starting under the plate
    if (is.d > 0.55 && rng() > 0.4) {
      const fx = is.x + (rng()-0.5)*span*0.35, fw = cw*0.34;
      const fy = is.y + cw*0.7;
      o.push(`<rect x="${(fx-fw/2).toFixed(1)}" y="${fy.toFixed(1)}" width="${fw.toFixed(1)}" height="${(H*0.30*is.d).toFixed(1)}" fill="url(#fall)"/>`);
    }
  }
  return o.join('');
}

const BUILDERS = { spikes, cavern, depths, aurora, islands };
const type = process.argv[2], seed = Number(process.argv[3] || 1), name = process.argv[4] || type;
if (!BUILDERS[type]) { console.error('type must be one of: ' + Object.keys(BUILDERS).join(', ')); process.exit(1); }
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${BUILDERS[type](seed)}</svg>`;
fs.mkdirSync('/tmp/voxgen', { recursive: true });
// Cool white balance and a light lift, matching the rest of the set. Done with recomb rather
// than a hue rotation: rotating hue is what wrecked the Minecraft palette the first time round.
const COOL = [[0.96, 0.01, 0.03], [0.01, 0.98, 0.03], [0.02, 0.03, 1.05]];
await sharp(Buffer.from(svg), { limitInputPixels: false })
  .recomb(COOL).modulate({ brightness: 1.06, saturation: 1.04 })
  .webp({ quality: 84 }).toFile(`/tmp/voxgen/${name}.webp`);
await sharp(`/tmp/voxgen/${name}.webp`).resize(1000).webp({ quality: 82 }).toFile(`/tmp/voxgen/${name}-sm.webp`);
console.log(`${type} -> /tmp/voxgen/${name}.webp`);
