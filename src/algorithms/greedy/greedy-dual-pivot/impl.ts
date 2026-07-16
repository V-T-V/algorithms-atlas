// 贪心双枢轴选择 · 实现
export interface GdpHooks {
  onPick?: (p1: number, p2: number, variance: number) => void;
  onConclude?: (best: [number, number]) => void;
}
export function greedyDualPivot(
  arr: readonly number[],
  samples: readonly number[],
  hooks: GdpHooks = {},
): [number, number] {
  let best: [number, number] = [samples[0] ?? 0, samples[samples.length - 1] ?? 1];
  let bestVar = Infinity;
  for (let i = 0; i < samples.length; i++)
    for (let j = i + 1; j < samples.length; j++) {
      const p1 = Math.min(samples[i]!, samples[j]!),
        p2 = Math.max(samples[i]!, samples[j]!);
      if (p1 === p2) continue;
      let lo = 0,
        mid = 0,
        hi = 0;
      for (const x of arr) {
        if (x < p1) lo++;
        else if (x > p2) hi++;
        else mid++;
      }
      const mean = (lo + mid + hi) / 3;
      const variance = ((lo - mean) ** 2 + (mid - mean) ** 2 + (hi - mean) ** 2) / 3;
      hooks.onPick?.(p1, p2, variance);
      if (variance < bestVar) {
        bestVar = variance;
        best = [p1, p2];
      }
    }
  hooks.onConclude?.(best);
  return best;
}
