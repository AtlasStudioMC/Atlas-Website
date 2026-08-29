import sharp from "sharp";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";

const logoSvg = readFileSync(new URL("../src/assets/logo.svg", import.meta.url));
const ogSvg = readFileSync(new URL("./og-source.svg", import.meta.url));

const out = (p) => fileURLToPath(new URL(p, import.meta.url));

await sharp(logoSvg).resize(32, 32).png().toFile(out("../public/favicon-32.png"));
await sharp(logoSvg).resize(192, 192).png().toFile(out("../public/favicon-192.png"));
await sharp(logoSvg).resize(180, 180).png().toFile(out("../public/apple-touch-icon.png"));
await sharp(ogSvg).resize(1200, 630).png().toFile(out("../public/og-image.png"));

console.log("done");
