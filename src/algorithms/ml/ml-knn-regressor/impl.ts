// KNN 回归 · 实现
export interface Sample {
  x: number[];
  y: number;
}
export function knnRegressor(train: Sample[], query: number[], k = 3): number {
  if (train.length === 0) throw new RangeError('训练集为空');
  const kEff = Math.min(k, train.length);
  const dists = train.map((s, i) => ({ i, d: Math.hypot(...s.x.map((v, j) => v - query[j]!)) }));
  dists.sort((a, b) => a.d - b.d);
  let sum = 0;
  for (let n = 0; n < kEff; n++) sum += train[dists[n]!.i]!.y;
  return sum / kEff;
}
