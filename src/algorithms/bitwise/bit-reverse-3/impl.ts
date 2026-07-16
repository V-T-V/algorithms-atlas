export interface RevNibbleHooks {
  onStep?: (v: number) => void;
  onResult?: (r: number) => void;
}
export function reverseNibble(x: number, hooks: RevNibbleHooks = {}): number {
  let v = x & 0xf;
  v = ((v & 0b0011) << 2) | ((v & 0b1100) >>> 2);
  hooks.onStep?.(v);
  v = ((v & 0b0101) << 1) | ((v & 0b1010) >>> 1);
  hooks.onStep?.(v);
  hooks.onResult?.(v);
  return v;
}
