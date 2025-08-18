import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Recreate __dirname for ES Modules, as it's not available by default
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to your function map JSON
const CONFIG_PATH = path.resolve(__dirname, '../src/config/functions-map.json');
// Output directory for generated files
const OUT_DIR = path.resolve(__dirname, '../src/generated');

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

// Reading JSON in ESM requires this pattern
const functionMap = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));

// --- Logic to prevent duplicate module imports ---
const moduleAliases = new Map();
let importCounter = 0;

const getModuleAlias = (modulePath) => {
  if (!moduleAliases.has(modulePath)) {
    moduleAliases.set(modulePath, `m${importCounter++}`);
  }
  return moduleAliases.get(modulePath);
};

// First, determine all unique modules and assign them an alias
for (const funcName in functionMap) {
  const modulePath = functionMap[funcName].path;
  getModuleAlias(modulePath);
}
// --- End of new logic ---


// --- 1. Generate Production Index (functionsIndex.ts) ---
let prodIndexContent = `// This file is auto-generated. Do not edit.\n\n`;
const imports = [];
const exports = ['export const functions = {\n'];

// Generate one import statement per unique module
moduleAliases.forEach((alias, modulePath) => {
  imports.push(`import * as ${alias} from "${modulePath}";\n`);
});

// Generate the exports using the correct alias for each function
for (const funcName in functionMap) {
  const modulePath = functionMap[funcName].path;
  const alias = moduleAliases.get(modulePath);
  exports.push(`  "${funcName}": ${alias},\n`);
}

exports.push('};\n');
prodIndexContent += imports.join('') + '\n' + exports.join('');
fs.writeFileSync(path.join(OUT_DIR, 'functionsIndex.ts'), prodIndexContent);
console.log('Generated production functions index.');


// --- 2. Generate Development Map (devFunctionsMap.ts) ---
let devMapContent = `// This file is auto-generated. Do not edit.\n\n`;
devMapContent += 'export const devFunctionMap: Record<string, () => Promise<any>> = {\n';

for (const funcName in functionMap) {
  const modulePath = functionMap[funcName].path;
  devMapContent += `  '${funcName}': () => import('${modulePath}'),\n`;
}

devMapContent += '};\n';
fs.writeFileSync(path.join(OUT_DIR, 'devFunctionsMap.ts'), devMapContent);
console.log('Generated development functions map.');