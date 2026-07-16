// 集合覆盖 LP 舍入 (简化: 直接贪心按性价比) · 实现
export interface SlpHooks {
  onPick?: (setIdx: number, newCovered: number, costRatio: number) => void;
  onConclude?: (chosen: number[], cost: number) => void;
}
export function setCoverLpRounding(
  sets: ReadonlyArray<readonly number[]>,
  weights: readonly number[],
  universe: number,
  hooks: SlpHooks = {},
): { chosen: number[]; cost: number } {
  const covered = new Set<number>();
  const chosen: number[] = [];
  let cost = 0;
  while (covered.size < universe) {
    let best = -1,
      bestRatio = Infinity,
      bestNew = 0;
    for (let i = 0; i < sets.length; i++) {
      if (chosen.includes(i)) continue;
      const nw = sets[i]!.filter((e) => !covered.has(e));
      if (nw.length === 0) continue;
      const ratio = weights[i]! / nw.length;
      if (ratio < bestRatio) {
        bestRatio = ratio;
        best = i;
        bestNew = nw.length;
      }
    }
    if (best < 0) break;
    chosen.push(best);
    cost += weights[best]!;
    for (const e of sets[best]!) covered.add(e);
    hooks.onPick?.(best, bestNew, bestRatio);
  }
  hooks.onConclude?.(chosen, cost);
  return { chosen, cost };
}
