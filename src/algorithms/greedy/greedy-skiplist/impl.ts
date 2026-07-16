// 跳表贪心分层 · 实现
export interface SlHooks {
  onLevel?: (node: number, level: number) => void;
  onConclude?: (maxLevel: number, avgLevel: number) => void;
}
export function skiplistGreedy(
  n: number,
  p: number,
  rng: () => number,
  hooks: SlHooks = {},
): { levels: number[]; maxLevel: number } {
  const levels = new Array<number>(n).fill(0);
  for (let i = 0; i < n; i++) {
    let lv = 0;
    while (rng() < p) lv++;
    levels[i] = lv;
    hooks.onLevel?.(i, lv);
  }
  const maxLevel = Math.max(...levels);
  const avgLevel = levels.reduce((a, b) => a + b, 0) / n;
  hooks.onConclude?.(maxLevel, avgLevel);
  return { levels, maxLevel };
}
