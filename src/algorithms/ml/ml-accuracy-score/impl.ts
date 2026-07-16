// 准确率 · 实现
export function accuracy(yTrue: number[], yPred: number[]): number {
  if (yTrue.length !== yPred.length) throw new RangeError('长度不匹配');
  if (yTrue.length === 0) return 0;
  let correct = 0;
  for (let i = 0; i < yTrue.length; i++) if (yTrue[i] === yPred[i]) correct++;
  return correct / yTrue.length;
}
