// 决定系数 R² · 实现
export function r2Score(yTrue: number[], yPred: number[]): number {
  if (yTrue.length !== yPred.length) throw new RangeError('长度不匹配');
  const n = yTrue.length;
  if (n === 0) return 0;
  const mean = yTrue.reduce((a, b) => a + b, 0) / n;
  let ssRes = 0,
    ssTot = 0;
  for (let i = 0; i < n; i++) {
    ssRes += (yTrue[i]! - yPred[i]!) ** 2;
    ssTot += (yTrue[i]! - mean) ** 2;
  }
  if (ssTot === 0) return ssRes === 0 ? 1 : 0;
  return 1 - ssRes / ssTot;
}
