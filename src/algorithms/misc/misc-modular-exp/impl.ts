// 快速模幂 · 实现
export interface MeHooks {
  onBit?: (bit: number, base: number, result: number) => void;
  onConclude?: (result: number) => void;
}
export function modPow(base: number, exp: number, m: number, hooks: MeHooks = {}): number {
  let r = 1 % m,
    b = base % m,
    e = exp;
  while (e > 0) {
    if (e & 1) r = (r * b) % m;
    hooks.onBit?.(e & 1, b, r);
    b = (b * b) % m;
    e = Math.floor(e / 2);
  }
  hooks.onConclude?.(r);
  return r;
}
