import { readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs';
import { join, relative, dirname, sep } from 'node:path';

const SRC = join(process.cwd(), 'src');

const walk = (dir) =>
  readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) return walk(p);
    return p.endsWith('.ts') ? [p] : [];
  });

const re = /(from\s+|import\s*\(\s*|import\s+)(['"])@\/([^'"]+)\2/g;

for (const file of walk(SRC)) {
  const code = readFileSync(file, 'utf8');
  const out = code.replace(re, (_, pre, q, target) => {
    let rel = relative(dirname(file), join(SRC, target)).split(sep).join('/');
    if (!rel.startsWith('.')) rel = './' + rel;
    return `${pre}${q}${rel}${q}`;
  });
  if (out !== code) writeFileSync(file, out);
}