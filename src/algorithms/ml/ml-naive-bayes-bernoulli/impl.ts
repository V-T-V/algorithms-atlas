// 伯努利朴素贝叶斯 · 实现
export interface BernoulliNB {
  classes: number[];
  probs: number[][];
  priors: number[];
}
export function trainBernoulliNB(X: number[][], y: number[], alpha = 1): BernoulliNB {
  const classes = [...new Set(y)].sort((a, b) => a - b);
  const d = X[0]!.length;
  const probs: number[][] = [],
    priors: number[] = [];
  for (const c of classes) {
    const pts = X.filter((_, i) => y[i] === c);
    const p = new Array<number>(d).fill(0);
    for (let j = 0; j < d; j++)
      p[j] = (pts.reduce((s, r) => s + (r[j]! > 0 ? 1 : 0), 0) + alpha) / (pts.length + 2 * alpha);
    probs.push(p);
    priors.push(pts.length / X.length);
  }
  return { classes, probs, priors };
}
export function predictBernoulliNB(model: BernoulliNB, x: number[]): number {
  let best = -Infinity,
    bc = model.classes[0]!;
  for (let k = 0; k < model.classes.length; k++) {
    let logp = Math.log(model.priors[k]!);
    for (let j = 0; j < x.length; j++) {
      const p = model.probs[k]![j]!;
      const b = x[j]! > 0 ? 1 : 0;
      logp += b * Math.log(p) + (1 - b) * Math.log(1 - p);
    }
    if (logp > best) {
      best = logp;
      bc = model.classes[k]!;
    }
  }
  return bc;
}
