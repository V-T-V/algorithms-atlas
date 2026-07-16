// 古诺寡头 · 实现
export interface CournotHooks {
  onQuantities?: (q1: number, q2: number, profit1: number, profit2: number) => void;
  onEquilibrium?: (q1: number, q2: number) => void;
}
export function cournotDuopoly(
  a: number,
  b: number,
  c1: number,
  c2: number,
  hooks: CournotHooks = {},
): { q1: number; q2: number; profit1: number; profit2: number } {
  const q1 = (a + c2 - 2 * c1) / (3 * b);
  const q2 = (a + c1 - 2 * c2) / (3 * b);
  const price = Math.max(0, a - b * (q1 + q2));
  const profit1 = (price - c1) * q1;
  const profit2 = (price - c2) * q2;
  hooks.onQuantities?.(q1, q2, profit1, profit2);
  hooks.onEquilibrium?.(q1, q2);
  return { q1, q2, profit1, profit2 };
}
