// 合页损失 · 实现
export function hingeLoss(yTrue: number, yPredScore: number): number {
  return Math.max(0, 1 - yTrue * yPredScore);
}
export function avgHingeLoss(yTrue: number[], scores: number[]): number {
  if (yTrue.length === 0) return 0;
  let s = 0;
  for (let i = 0; i < yTrue.length; i++) s += hingeLoss(yTrue[i]!, scores[i]!);
  return s / yTrue.length;
}
