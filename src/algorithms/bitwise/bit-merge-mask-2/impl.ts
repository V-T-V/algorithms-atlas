export interface MergeHooks {
  onResult?: (r: number) => void;
}
export function mergeMask(a: number, b: number, m: number, hooks: MergeHooks = {}): number {
  const r = (a & m) | (b & ~m) | 0;
  hooks.onResult?.(r >>> 0);
  return r;
}
