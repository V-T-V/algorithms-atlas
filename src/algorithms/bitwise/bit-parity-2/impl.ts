const PT: number[] = [0, 1, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 1, 1, 0];
export interface ParityHooks2 {
  onFold?: (v: number) => void;
  onResult?: (p: number) => void;
}
export function parityLookup(x: number, hooks: ParityHooks2 = {}): number {
  let v = x >>> 0;
  v ^= v >>> 16;
  hooks.onFold?.(v);
  v ^= v >>> 8;
  hooks.onFold?.(v);
  v ^= v >>> 4;
  hooks.onFold?.(v);
  const r = PT[v & 0xf]!;
  hooks.onResult?.(r);
  return r;
}
