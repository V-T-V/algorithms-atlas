// 均方误差 · 实现
export function mse(yTrue: number[], yPred: number[]): number {
  if (yTrue.length !== yPred.length) throw new RangeError('长度不匹配');
  if (yTrue.length === 0) return 0;
  let s = 0;
  for (let i = 0; i < yTrue.length; i++) s += (yTrue[i]! - yPred[i]!) ** 2;
  return s / yTrue.length;
}
