// 多臂老虎机 UCB1 · 实现
export interface BanditHooks {
  onSelect?: (t: number, arm: number, ucb: number[]) => void;
  onReward?: (arm: number, reward: number) => void;
}
export function banditUcb(
  rewards: ReadonlyArray<readonly number[]>,
  hooks: BanditHooks = {},
): number[] {
  const k = rewards.length;
  const counts = new Array<number>(k).fill(0);
  const sums = new Array<number>(k).fill(0);
  const sel: number[] = [];
  // 初始化：每臂试一次
  for (let a = 0; a < k; a++) {
    const r = rewards[a]![0]!;
    counts[a] = 1;
    sums[a] = r;
    hooks.onReward?.(a, r);
    sel.push(a);
  }
  const T = rewards[0]!.length;
  for (let t = k; t < T; t++) {
    const ln = Math.log(t + 1);
    const ucb = counts.map((c, a) => (c === 0 ? Infinity : sums[a]! / c + Math.sqrt((2 * ln) / c)));
    let best = 0,
      bv = -Infinity;
    for (let a = 0; a < k; a++)
      if (ucb[a]! > bv) {
        bv = ucb[a]!;
        best = a;
      }
    hooks.onSelect?.(t, best, ucb);
    const r = rewards[best]![t]!;
    counts[best]!++;
    sums[best]! += r;
    hooks.onReward?.(best, r);
    sel.push(best);
  }
  return sel;
}
