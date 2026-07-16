// 高斯朴素贝叶斯 · 实现
export interface GaussianNB {
  classes: number[];
  means: number[][];
  vars: number[][];
  priors: number[];
}
function gaussianPdf(x: number, mean: number, var_: number): number {
  if (var_ === 0) return x === mean ? 1 : 1e-9;
  return Math.exp(-((x - mean) ** 2) / (2 * var_)) / Math.sqrt(2 * Math.PI * var_);
}
export function trainGaussianNB(X: number[][], y: number[]): GaussianNB {
  const classes = [...new Set(y)].sort((a, b) => a - b);
  const d = X[0]!.length;
  const means: number[][] = [],
    vars: number[][] = [],
    priors: number[] = [];
  for (const c of classes) {
    const pts = X.filter((_, i) => y[i] === c);
    const m = new Array<number>(d).fill(0),
      v = new Array<number>(d).fill(0);
    for (let j = 0; j < d; j++) {
      m[j] = pts.reduce((s, p) => s + p[j]!, 0) / pts.length;
    }
    for (let j = 0; j < d; j++)
      v[j] = pts.reduce((s, p) => s + (p[j]! - m[j]!) ** 2, 0) / pts.length;
    means.push(m);
    vars.push(v);
    priors.push(pts.length / X.length);
  }
  return { classes, means, vars, priors };
}
export function predictGaussianNB(model: GaussianNB, x: number[]): number {
  let best = -Infinity,
    bc = model.classes[0]!;
  for (let k = 0; k < model.classes.length; k++) {
    let logp = Math.log(model.priors[k]!);
    for (let j = 0; j < x.length; j++)
      logp += Math.log(gaussianPdf(x[j]!, model.means[k]![j]!, model.vars[k]![j]!));
    if (logp > best) {
      best = logp;
      bc = model.classes[k]!;
    }
  }
  return bc;
}
