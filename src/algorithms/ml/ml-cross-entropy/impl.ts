// 交叉熵损失 · 实现
export function crossEntropy(yTrue: number[], yPred: number[], eps = 1e-12): number {
  if (yTrue.length !== yPred.length) throw new RangeError('长度不匹配');
  let loss = 0;
  for (let i = 0; i < yTrue.length; i++)
    if (yTrue[i]! > 0) loss -= yTrue[i]! * Math.log(Math.max(eps, yPred[i]!));
  return loss;
}
