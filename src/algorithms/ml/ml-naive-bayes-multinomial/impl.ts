// 多项式朴素贝叶斯 · 实现
export interface MultinomialNB {
  classes: number[];
  logProbs: number[][];
  logPriors: number[];
}
export function trainMultinomialNB(X: number[][], y: number[], alpha = 1): MultinomialNB {
  const classes = [...new Set(y)].sort((a, b) => a - b);
  const d = X[0]!.length;
  const logProbs: number[][] = [],
    logPriors: number[] = [];
  for (const c of classes) {
    const pts = X.filter((_, i) => y[i] === c);
    const sums = new Array<number>(d).fill(alpha);
    let total = alpha * d;
    for (let j = 0; j < d; j++) {
      for (const r of pts) sums[j]! += r[j]!;
      total += sums[j]! - alpha;
    }
    const lp = sums.map((s) => Math.log(s / total));
    logProbs.push(lp);
    logPriors.push(Math.log(pts.length / X.length));
  }
  return { classes, logProbs, logPriors };
}
export function predictMultinomialNB(model: MultinomialNB, x: number[]): number {
  let best = -Infinity,
    bc = model.classes[0]!;
  for (let k = 0; k < model.classes.length; k++) {
    let logp = model.logPriors[k]!;
    for (let j = 0; j < x.length; j++) logp += x[j]! * model.logProbs[k]![j]!;
    if (logp > best) {
      best = logp;
      bc = model.classes[k]!;
    }
  }
  return bc;
}
