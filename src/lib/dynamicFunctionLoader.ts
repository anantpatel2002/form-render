import type { FormFunction } from '@/types/formFunctions';
import functionsMapJson from '@/config/functions-map.json';

type FuncMeta = {
  path: string;
  exportName?: string;
  async?: boolean;
  cache?: boolean;
  params?: string[];
  description?: string;
};
const FUNCTIONS_MAP: Record<string, FuncMeta> = (functionsMapJson as any) as Record<string, FuncMeta>;

const moduleCache = new Map<string, Promise<any>>();
const functionCache = new Map<string, any>();
let GENERATED_MAP: Record<string, FormFunction> | null = null;
let triedLoadGenerated = false;

async function loadGeneratedMapIfNeeded() {
  if (triedLoadGenerated) return GENERATED_MAP;
  triedLoadGenerated = true;
  if (process.env.NEXT_PUBLIC_USE_CODEGEN === 'true') {
    try {
      // eager import the generated file. If generated file doesn't exist, this will throw.
      const mod = await import('@/generated/functionsIndex');
      GENERATED_MAP = (mod as any).functionsMap ?? (mod as any).default ?? null;
    } catch (e) {
      console.warn('Generated functionsIndex not found at runtime — falling back to dynamic imports', e);
      GENERATED_MAP = null;
    }
  }
  return GENERATED_MAP;
}

export async function getFunctionByName<T extends FormFunction = FormFunction>(name: string): Promise<T> {
  const meta = FUNCTIONS_MAP[name] as FuncMeta | undefined;
  if (!meta) throw new Error(`Function metadata not found for: ${name}`);

  if (meta.cache && functionCache.has(name)) return functionCache.get(name) as T;

  const gen = await loadGeneratedMapIfNeeded();
  if (gen && gen[name]) {
    const fn = gen[name] as any;
    if (meta.cache) functionCache.set(name, fn);
    return fn as T;
  }

  // Dev / fallback: dynamic import at runtime
  const modulePath = meta.path;
  if (!moduleCache.has(modulePath)) {
    // dynamic import — keep it constrained to known module paths to avoid bundler bloat
    moduleCache.set(modulePath, import(/* webpackChunkName: "formFunctions-[request]" */ modulePath as any));
  }
  const mod = await moduleCache.get(modulePath) as any;
  const fn = (meta.exportName && mod[meta.exportName]) || mod.default || mod[name];
  if (!fn || typeof fn !== 'function') throw new Error(`Function ${name} not found in module ${modulePath}.`);
  if (meta.cache) functionCache.set(name, fn);
  return fn as T;
}

export async function callFormFunction(name:string, args:any[] = [], context:any = {}) {
  const fn = await getFunctionByName(name);
  return fn(...args, context);
}

export function clearFunctionCache(name?: string) {
  if (name) functionCache.delete(name);
  else { functionCache.clear(); moduleCache.clear(); }
}