export interface Log2Hooks {
  onClz?: (clz: number) => void;
  onResult?: (r: number) => void;
}
export function clz32(x: number): number {
  if (x === 0) return 32;
  let n = 0,
    v = x >>> 0;
  if ((v & 0xffff0000) === 0) {
    n += 16;
    v <<= 16;
  }
  if ((v & 0xff000000) === 0) {
    n += 8;
    v <<= 8;
  }
  if ((v & 0xf0000000) === 0) {
    n += 4;
    v <<= 4;
  }
  if ((v & 0xc0000000) === 0) {
    n += 2;
    v <<= 2;
  }
  if ((v & 0x80000000) === 0) {
    n += 1;
  }
  return n;
}
export function floorLog2(x: number, hooks: Log2Hooks = {}): number {
  if (x <= 0) return -1;
  const c = clz32(x >>> 0);
  hooks.onClz?.(c);
  const r = 31 - c;
  hooks.onResult?.(r);
  return r;
}
