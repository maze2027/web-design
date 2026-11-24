// Verifies WCAG contrast for every text/background pairing used in the design system.
const hex = (h) => h.match(/\w\w/g).map((x) => parseInt(x, 16) / 255).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
const L = (h) => { const [r, g, b] = hex(h.replace("#", "")); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
const ratio = (a, b) => { const [x, y] = [L(a), L(b)].sort((m, n) => n - m); return (x + 0.05) / (y + 0.05); };
const pairs = [
  ["paper text on asphalt", "#F6F4EE", "#0E1116"],
  ["yellow on asphalt", "#FFC72C", "#0E1116"],
  ["asphalt on yellow (CTA)", "#0E1116", "#FFC72C"],
  ["slate on asphalt", "#8A94A6", "#0E1116"],
  ["slate on asphalt-2 (cards)", "#8A94A6", "#161B22"],
  ["green on asphalt", "#22C55E", "#0E1116"],
  ["green on asphalt-2", "#22C55E", "#161B22"],
  ["asphalt on paper", "#0E1116", "#F6F4EE"],
  ["ink-muted on paper", "#535C6B", "#F6F4EE"],
  ["ink-muted on paper-2", "#535C6B", "#ECE8DD"],
  ["ink-muted on white", "#535C6B", "#FFFFFF"],
  ["green-ink on white", "#15803D", "#FFFFFF"],
  ["danger on error bg", "#B42318", "#FDECEA"],
  ["confirm badge text", "#5C4300", "#FFF3CF"],
];
let fail = 0;
for (const [name, fg, bg] of pairs) {
  const r = ratio(fg, bg); const ok = r >= 4.5; if (!ok) fail++;
  console.log(`${ok ? "PASS" : "FAIL"}  ${r.toFixed(2)}:1  ${name}`);
}
console.log("Not used for text: slate on light (2.8:1), yellow on light (1.4:1), green #22C55E on light (2.1:1).");
process.exit(fail ? 1 : 0);
