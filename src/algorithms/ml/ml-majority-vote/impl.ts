// 多数投票集成 · 实现
export function majorityVote(predictions: number[][]): number[] {
  const n = predictions[0]?.length ?? 0;
  const out: number[] = [];
  for (let j = 0; j < n; j++) {
    const cnt: Record<number, number> = {};
    for (let i = 0; i < predictions.length; i++) {
      const v = predictions[i]![j]!;
      cnt[v] = (cnt[v] ?? 0) + 1;
    }
    let best = predictions[0]![j]!,
      max = -1;
    for (const k in cnt)
      if (cnt[k]! > max) {
        max = cnt[k]!;
        best = Number(k);
      }
    out.push(best);
  }
  return out;
}
