import functionsMapJson from '@/config/functions-map.json';

export const getFunctionByName = async (name: string): Promise<Function> => {
  // Production / Codegen Path
  if (process.env.NEXT_PUBLIC_USE_CODEGEN === 'true') {
    const mod = await import('@/generated/functionsIndex');
    const funcData = (mod.functions as any)[name];
    const meta = functionsMapJson[name as keyof typeof functionsMapJson];
    if (!funcData) throw new Error(`Function module for ${name} not found in codegen index.`);
    const fn = (meta.exportName && funcData[meta.exportName]) || funcData[name];
    if (typeof fn !== 'function') throw new Error(`Exported member ${name} is not a function.`);
    return fn;
  }

  // --- Development / Fallback Path (Now 100% Robust) ---
  const meta = functionsMapJson[name as keyof typeof functionsMapJson];
  if (!meta) throw new Error(`Function ${name} not found in functions-map.json.`);

  // Import our new, auto-generated development map
  const { devFunctionMap } = await import('@/generated/devFunctionsMap');

  // Find the correct importer function in the map
  const importer = devFunctionMap[name];
  if (!importer) {
    throw new Error(`Importer for function ${name} not found in dev map.`);
  }

  // Call the importer() to trigger the dynamic import
  const mod = await importer();

  // Get the specific exported function from the loaded module
  const fn = (meta.exportName && mod[meta.exportName]) || mod.default || mod[name];
  if (!fn || typeof fn !== 'function') {
    throw new Error(`Function ${name} not found or not a function in module ${meta.path}.`);
  }

  return fn;
};