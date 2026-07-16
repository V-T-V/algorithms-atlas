function spread(v: number): number {
  let x = v & 0xffff;
  x = (x | (x << 8)) & 0x00ff00ff;
  x = (x | (x << 4)) & 0x0f0f0f0f;
  x = (x | (x << 2)) & 0x33333333;
  x = (x | (x << 1)) & 0x55555555;
  return x >>> 0;
}
export interface InterleaveHooks {
  onSpread?: (sx: number, sy: number) => void;
  onResult?: (r: number) => void;
}
export function interleave(x: number, y: number, hooks: InterleaveHooks = {}): number {
  const sx = spread(x);
  const sy = spread(y);
  hooks.onSpread?.(sx, sy);
  const r = (sx | (sy << 1)) >>> 0;
  hooks.onResult?.(r);
  return r;
}
