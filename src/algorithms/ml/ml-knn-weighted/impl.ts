// 加权 KNN 分类 · 实现
export interface Sample {
  x: number[];
  y: number;
}
export function weightedKnn(train: Sample[], query: number[], k = 3, power = 2): number {
  if (train.length === 0) throw new RangeError('训练集为空');
  const kEff = Math.min(k, train.length);
  const dists = train.map((s) => ({ y: s.y, d: Math.hypot(...s.x.map((v, j) => v - query[j]!)) }));
  dists.sort((a, b) => a.d - b.d);
  const votes: Record<number, number> = {};
  for (let n = 0; n < kEff; n++) {
    const w = 1 / Math.pow(dists[n]!.d + 1e-9, power);
    votes[dists[n]!.y] = (votes[dists[n]!.y] ?? 0) + w;
  }
  let best = -1,
    bestW = -Infinity;
  for (const c in votes)
    if (votes[c]! > bestW) {
      bestW = votes[c]!;
      best = Number(c);
    }
  return best;
}
