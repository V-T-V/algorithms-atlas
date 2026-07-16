// 精确率与召回率 · 实现
export interface PR {
  precision: number;
  recall: number;
  f1: number;
}
export function precisionRecall(yTrue: number[], yPred: number[], positive = 1): PR {
  let tp = 0,
    fp = 0,
    fn = 0;
  for (let i = 0; i < yTrue.length; i++) {
    if (yPred[i] === positive && yTrue[i] === positive) tp++;
    else if (yPred[i] === positive && yTrue[i] !== positive) fp++;
    else if (yPred[i] !== positive && yTrue[i] === positive) fn++;
  }
  const precision = tp + fp > 0 ? tp / (tp + fp) : 0;
  const recall = tp + fn > 0 ? tp / (tp + fn) : 0;
  const f1 = precision + recall > 0 ? (2 * precision * recall) / (precision + recall) : 0;
  return { precision, recall, f1 };
}
