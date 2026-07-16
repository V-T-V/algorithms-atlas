// 斯塔克伯格博弈 · 实现
export interface StHooks {
  onLeader?: (q1: number, q2: number, profit1: number, profit2: number) => void;
}
export function stackelberg(
  a: number,
  b: number,
  c: number,
  hooks: StHooks = {},
): { q1: number; q2: number; profit1: number; profit2: number } {
  const q1 = (a - c) / (2 * b);
  const q2 = (a - c) / (4 * b);
  const price = Math.max(0, a - b * (q1 + q2));
  const profit1 = (price - c) * q1;
  const profit2 = (price - c) * q2;
  hooks.onLeader?.(q1, q2, profit1, profit2);
  return { q1, q2, profit1, profit2 };
}
