// 加权平均集成 · 实现
export function weightedAverageEnsemble(predictions: number[][], weights: number[]): number[] {
  const sum = weights.reduce((a, b) => a + b, 0);
  if (sum === 0) throw new RangeError('权重和为0');
  const n = predictions[0]?.length ?? 0;
  const out = new Array<number>(n).fill(0);
  for (let i = 0; i < predictions.length; i++)
    for (let j = 0; j < n; j++) out[j]! += (weights[i]! / sum) * predictions[i]![j]!;
  return out;
}
