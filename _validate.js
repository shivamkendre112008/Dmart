/* Quick static validation for the DMart Latur demo site */
const fs = require('fs');
const path = require('path');
const root = __dirname;

const pages = ['index.html','categories.html','products.html','offers.html','store.html','about.html','contact.html'];
let errors = 0;

for (const p of pages) {
  const file = path.join(root, p);
  if (!fs.existsSync(file)) { console.log(`MISSING PAGE: ${p}`); errors++; continue; }
  const html = fs.readFileSync(file, 'utf8');

  /* div balance */
  const open = (html.match(/<div\b/g) || []).length;
  const close = (html.match(/<\/div>/g) || []).length;
  if (open !== close) { console.log(`${p}: <div> ${open} open vs ${close} close MISMATCH`); errors++; }

  /* section balance */
  const so = (html.match(/<section\b/g) || []).length;
  const sc = (html.match(/<\/section>/g) || []).length;
  if (so !== sc) { console.log(`${p}: <section> ${so} vs ${sc} MISMATCH`); errors++; }

  /* duplicate ids */
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map(m => m[1]);
  const dupes = ids.filter((v, i) => ids.indexOf(v) !== i);
  if (dupes.length) { console.log(`${p}: duplicate ids: ${[...new Set(dupes)].join(', ')}`); errors++; }

  /* local assets exist */
  [...html.matchAll(/(?:href|src)="((?!https?:|data:|#|mailto:)[^"]+)"/g)].map(m => m[1])
    .forEach(ref => {
      const clean = ref.split('#')[0].split('?')[0];
      if (!clean) return;
      if (!fs.existsSync(path.join(root, clean))) { console.log(`${p}: missing asset ${clean}`); errors++; }
    });

  /* required blocks */
  ['id="nav"', 'id="curtain"', 'id="search"', 'id="mobileMenu"', 'js/main.js', 'js/data.js'].forEach(req => {
    if (!html.includes(req)) { console.log(`${p}: missing ${req}`); errors++; }
  });
}

/* CSS brace balance */
for (const c of ['css/base.css','css/components.css','css/sections.css']) {
  const css = fs.readFileSync(path.join(root, c), 'utf8');
  const o = (css.match(/{/g) || []).length;
  const cl = (css.match(/}/g) || []).length;
  if (o !== cl) { console.log(`${c}: braces ${o} vs ${cl} MISMATCH`); errors++; }
}

/* every image URL in data.js + pages should be a verified id */
const verified = new Set(
  fs.readFileSync(path.join(root, '_verified_images.txt'), 'utf8')
    .split(/[\s,]+/).filter(Boolean)
);
const files = pages.map(p => fs.readFileSync(path.join(root, p), 'utf8')).join('\n')
  + fs.readFileSync(path.join(root, 'js/data.js'), 'utf8');
const found = [...files.matchAll(/photo-([0-9]{10,}-[a-z0-9]+)/gi)].map(m => m[1]);
const bad = [...new Set(found)].filter(id => !verified.has(id));
if (bad.length) { console.log('UNVERIFIED image ids:', bad.join(', ')); errors++; }

console.log(errors ? `\n${errors} problem(s) found.` : '\nAll static checks passed.');
