const fs = require('fs');
const path = require('path');

const CONFIG_PATH = path.resolve(__dirname, '../src/config/functions-map.json');
const OUT_DIR = path.resolve(__dirname, '../src/generated');
const OUT_FILE = path.join(OUT_DIR, 'functionsIndex.ts');

if (!fs.existsSync(CONFIG_PATH)) {
  console.error('functions-map.json not found at', CONFIG_PATH);
  process.exit(1);
}

const mapping = require(CONFIG_PATH);

const imports = [];
const entries = [];
const seen = new Map();
let idx = 0;
function varName(i){ return `m${i}`; }

for (const [fnName, meta] of Object.entries(mapping)) {
  // support 2 shapes in functions-map.json: either a string path or an object { path, exportName }
  let modulePath; let exportName;
  if (typeof meta === 'string') {
    modulePath = meta;
    exportName = undefined;
  } else {
    modulePath = meta.path;
    exportName = meta.exportName;
  }
  if (!modulePath) { console.warn(`Skipping ${fnName} — no module path`); continue; }

  let v = seen.get(modulePath);
  if (!v) { v = varName(idx++); seen.set(modulePath, v); imports.push(`import * as ${v} from "${modulePath}";\n`); }
  const exp = exportName ?? fnName;
  entries.push(`\n\t"${fnName}": ${v}.${exp},`);
}

const out = `/* AUTO-GENERATED - DO NOT EDIT */
import type { FormFunction } from '@/types/formFunctions';
${imports.join('')}
export const functionsMap: Record<string, FormFunction> = {${entries.join('')}
};
`;

fs.mkdirSync(OUT_DIR, { recursive: true });
fs.writeFileSync(OUT_FILE, out, 'utf8');
console.log('Wrote', OUT_FILE);
