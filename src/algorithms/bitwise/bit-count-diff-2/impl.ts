export interface HammingHooks {
  onXor?: (d: number) => void;
  onResult?: (c: number) => void;
}
export function hamming(a: number, b: number, hooks: HammingHooks = {}): number {
  const d = (a ^ b) >>> 0;
  hooks.onXor?.(d);
  let v = d,
    c = 0;
  while (v) {
    v &= v - 1;
    c++;
  }
  hooks.onResult?.(c);
  return c;
}
