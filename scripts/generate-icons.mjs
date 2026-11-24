// Renders public/icon.svg to PNG favicons + favicon.ico using the preinstalled Playwright Chromium.
// Usage: npm run icons
import { createRequire } from "node:module";
const { chromium } = createRequire(import.meta.url)("playwright");
import { readFile, writeFile } from "node:fs/promises";

const svg = await readFile(new URL("../public/icon.svg", import.meta.url), "utf8");
const browser = await chromium.launch();
const page = await browser.newPage();

async function render(size, { pad = 0, bg = "transparent" } = {}) {
  await page.setViewportSize({ width: size, height: size });
  const inner = size - pad * 2;
  await page.setContent(`<html><body style="margin:0;background:${bg};display:grid;place-items:center;width:${size}px;height:${size}px">${svg.replace("<svg ", `<svg width="${inner}" height="${inner}" `)}</body></html>`);
  return page.screenshot({ omitBackground: bg === "transparent", type: "png" });
}

await writeFile(new URL("../public/icons/icon-192.png", import.meta.url), await render(192));
await writeFile(new URL("../public/icons/icon-512.png", import.meta.url), await render(512));
await writeFile(new URL("../public/icons/maskable-512.png", import.meta.url), await render(512, { pad: 72, bg: "#0E1116" }));
await writeFile(new URL("../public/apple-touch-icon.png", import.meta.url), await render(180, { pad: 14, bg: "#0E1116" }));

// favicon.ico containing a 32×32 and 16×16 PNG
const pngs = [await render(32), await render(16)];
const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0); header.writeUInt16LE(1, 2); header.writeUInt16LE(pngs.length, 4);
let offset = 6 + 16 * pngs.length;
const dir = pngs.map((png, i) => {
  const e = Buffer.alloc(16); const s = i === 0 ? 32 : 16;
  e.writeUInt8(s, 0); e.writeUInt8(s, 1); e.writeUInt8(0, 2); e.writeUInt8(0, 3);
  e.writeUInt16LE(1, 4); e.writeUInt16LE(32, 6); e.writeUInt32LE(png.length, 8); e.writeUInt32LE(offset, 12);
  offset += png.length; return e;
});
await writeFile(new URL("../public/favicon.ico", import.meta.url), Buffer.concat([header, ...dir, ...pngs]));
await browser.close();
console.log("icons generated");
