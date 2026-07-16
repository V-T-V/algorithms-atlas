// 集合覆盖 · 贪心近似
export interface SetCoverHooks {
  onPick?: (setIdx: number, newCovered: number) => void;
  onConclude?: (picked: number[], totalCovered: number) => void;
}
export interface SetCoverResult {
  picked: number[];
  totalCovered: number;
}
export function greedySetCover2(
  universe: ReadonlyArray<number>,
  sets: ReadonlyArray<ReadonlyArray<number>>,
  hooks: SetCoverHooks = {},
): SetCoverResult {
  const remaining = new Set(universe);
  const picked: number[] = [];
  let totalCovered = 0;
  while (remaining.size > 0) {
    let bestIdx = -1;
    let bestGain = 0;
    for (let i = 0; i < sets.length; i++) {
      if (picked.includes(i)) continue;
      let gain = 0;
      for (const e of sets[i]!) if (remaining.has(e)) gain++;
      if (gain > bestGain) {
        bestGain = gain;
        bestIdx = i;
      }
    }
    if (bestIdx === -1) break;
    picked.push(bestIdx);
    for (const e of sets[bestIdx]!) if (remaining.delete(e)) totalCovered++;
    hooks.onPick?.(bestIdx, bestGain);
  }
  hooks.onConclude?.(picked, totalCovered);
  return { picked, totalCovered };
}
