// 完美幂判定 · 实现
export interface PpHooks {
  onProbe?: (b: number, a: number, val: number) => void;
  onConclude?: (isPerfect: boolean, base: number, exp: number) => void;
}
export function perfectPower(
  n: number,
  hooks: PpHooks = {},
): { isPerfect: boolean; base: number; exp: number } {
  if (n < 4) return { isPerfect: false, base: 0, exp: 0 };
  const maxB = Math.floor(Math.log2(n));
  for (let b = 2; b <= maxB; b++) {
    let lo = 2,
      hi = Math.floor(Math.pow(2, Math.ceil(Math.log2(n) / b))) + 1;
    while (lo <= hi) {
      const a = Math.floor((lo + hi) / 2);
      const val = Math.pow(a, b);
      hooks.onProbe?.(b, a, val);
      if (val === n) {
        hooks.onConclude?.(true, a, b);
        return { isPerfect: true, base: a, exp: b };
      }
      if (val < n) lo = a + 1;
      else hi = a - 1;
    }
  }
  hooks.onConclude?.(false, 0, 0);
  return { isPerfect: false, base: 0, exp: 0 };
}
