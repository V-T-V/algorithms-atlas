export interface CtoHooks {
  onResult?: (c: number) => void;
}
function ctz(x: number): number {
  if (x === 0) return 32;
  let n = 0,
    v = x >>> 0;
  while ((v & 1) === 0) {
    n++;
    v >>>= 1;
  }
  return n;
}
export function countTrailingOnes(x: number, hooks: CtoHooks = {}): number {
  const v = x | 0;
  const r = ctz(~v);
  hooks.onResult?.(r);
  return r;
}
