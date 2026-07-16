// 混淆矩阵 · 实现
export function confusionMatrix(yTrue: number[], yPred: number[], k: number): number[][] {
  const m = Array.from({ length: k }, () => new Array<number>(k).fill(0));
  for (let i = 0; i < yTrue.length; i++)
    if (yTrue[i]! >= 0 && yTrue[i]! < k && yPred[i]! >= 0 && yPred[i]! < k)
      m[yTrue[i]!]![yPred[i]!]!++;
  return m;
}
