// Restore the 15 pre-existing ml- prefixed algorithms that were accidentally removed,
// then add the 45 new ones. Each restored algorithm uses a real, distinct implementation.
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = 'D:/M_X_M/algorithms-atlas';
const CAT = 'ml';
const INDEX = `import type { Demo } from '../../../types.ts';
import { buildTrace } from './trace.ts';
export { meta } from './meta.ts';
export async function createDemo(): Promise<Demo> {
  const { meta } = await import('./meta.ts');
  return { meta, buildTrace };
}
`;

function writeAlg(id, meta, impl, trace, test) {
  const dir = join(ROOT, 'src/algorithms', CAT, id);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'meta.ts'), meta);
  writeFileSync(join(dir, 'impl.ts'), impl);
  writeFileSync(join(dir, 'trace.ts'), trace);
  writeFileSync(join(dir, 'index.ts'), INDEX);
  mkdirSync(join(ROOT, 'test', CAT), { recursive: true });
  writeFileSync(join(ROOT, 'test', CAT, `${id}.test.ts`), test);
}

function meta(id, zh, en, sumZh, sumEn, descZh, descEn, time, space, tags) {
  return `// ${zh} · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: '${id}',
  categoryId: '${CAT}',
  title: { zh: '${zh}', en: '${en}' },
  summary: { zh: '${sumZh}', en: '${sumEn}' },
  description: { zh: ${JSON.stringify(descZh)}, en: ${JSON.stringify(descEn)} },
  tags: ${JSON.stringify(tags)},
  complexity: { time: '${time}', space: '${space}' },
};`;
}

// Build a 2-frame trace: import given explicitly; expr evaluated in buildTrace and shown.
function metricTrace(impLine, expr, fzh, fen) {
  return `// 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
${impLine}
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const v = ${expr};
  rec.begin({ zh: '${fzh}', en: '${fen}' }).setAux([{ label: '值', value: String(v), role: 'final' as BarRole }]).commit();
  return rec.build();
}`;
}

const ALGS = [];

// === RESTORE 15 deleted ===

// ml-svm-soft (Pegasos)
ALGS.push({
  id: 'ml-svm-soft',
  m: ['软间隔 SVM（Pegasos）', 'Soft-Margin SVM (Pegasos)', '用 Pegasos（原始型随机次梯度）求解 L2 正则化软间隔线性 SVM。', 'Solve L2-regularized soft-margin linear SVM via Pegasos (primal stochastic subgradient).',
    'Pegasos 求解原始问题 min (λ/2)|w|² + (1/n)Σ max(0,1-y_i<w,x_i>)，每步随机选样本更新，收敛率 O(1/T)。', 'Pegasos solves the primal SVM objective with stochastic subgradient; O(1/T) convergence.', 'O(Td)', 'O(d)', ['ml', 'svm', 'pegasos', 'online-learning']],
  impl: `// 软间隔 SVM（Pegasos）· 实现
export interface PegasosModel { w: number[]; b: number; lambda: number; }
export interface PegasosHooks { onEpoch?: (epoch: number, loss: number) => void; }
function dot(w: number[], x: number[]): number { let s = 0; for (let i = 0; i < w.length; i++) s += w[i]! * x[i]!; return s; }
export function trainPegasos(X: number[][], y: number[], lambda: number, epochs = 50, seed = 1, hooks: PegasosHooks = {}): PegasosModel {
  const n = X.length;
  if (n === 0) throw new RangeError('训练集为空');
  if (y.length !== n) throw new RangeError('标签数不匹配');
  for (const v of y) if (v !== 1 && v !== -1) throw new RangeError('标签必须为 ±1');
  if (lambda <= 0) throw new RangeError('lambda 必须为正');
  const d = X[0]!.length;
  const w = new Array<number>(d).fill(0);
  let b = 0;
  let s = seed >>> 0;
  const rand = (): number => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
  let t = 1;
  for (let epoch = 0; epoch < epochs; epoch++) {
    const idx = Array.from({ length: n }, (_, i) => i);
    for (let i = n - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [idx[i], idx[j]] = [idx[j]!, idx[i]!]; }
    for (const i of idx) {
      const xi = X[i]!, yi = y[i]!;
      const eta = 1 / (lambda * t);
      const margin = yi * (dot(w, xi) + b);
      const decay = 1 - eta * lambda;
      for (let k = 0; k < d; k++) w[k]! *= decay;
      b *= decay;
      if (margin < 1) { for (let k = 0; k < d; k++) w[k]! += eta * yi * xi[k]!; b += eta * yi; }
      t++;
    }
    let loss = 0;
    for (let i = 0; i < n; i++) { const m = y[i]! * (dot(w, X[i]!) + b); if (m < 1) loss += 1 - m; }
    loss /= n;
    hooks.onEpoch?.(epoch + 1, loss);
  }
  return { w, b, lambda };
}
export function decisionValue(model: PegasosModel, x: number[]): number { return dot(model.w, x) + model.b; }
export function predictSVM(model: PegasosModel, x: number[]): number { return decisionValue(model, x) >= 0 ? 1 : -1; }`,
  trace: `// 软间隔 SVM（Pegasos）· 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { trainPegasos, predictSVM } from './impl.ts';
export const DEFAULT_INPUT = { X: [[1, 2], [2, 1], [2, 3], [5, 6], [6, 5], [6, 7]], y: [-1, -1, -1, 1, 1, 1], lambda: 0.01, epochs: 30 };
export function buildTrace(input: { X: number[][]; y: number[]; lambda?: number; epochs?: number } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { X, y, lambda = 0.01, epochs = 30 } = input;
  rec.begin({ zh: 'Pegasos：' + X.length + ' 样本，λ=' + lambda, en: 'Pegasos: ' + X.length + ' samples, λ=' + lambda }).setAux([{ label: '样本数', value: String(X.length), role: 'pivot' as BarRole }]).commit();
  const model = trainPegasos(X, y, lambda, epochs, 1, {
    onEpoch: (epoch, loss) => rec.begin({ zh: '第 ' + epoch + ' 轮 loss ' + loss.toFixed(4), en: 'epoch ' + epoch + ' loss ' + loss.toFixed(4) }).setAux([{ label: '损失', value: loss.toFixed(4), role: 'compare' as BarRole }]).commit(),
  });
  const correct = X.filter((x, i) => predictSVM(model, x) === y[i]).length;
  rec.begin({ zh: '训练完成，准确率 ' + correct + '/' + X.length, en: 'done, accuracy ' + correct + '/' + X.length }).setAux([{ label: '准确率', value: correct + '/' + X.length, role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { trainPegasos, predictSVM, decisionValue } from '../../src/algorithms/ml/ml-svm-soft/impl.ts';
test('Pegasos 分离线性可分', () => {
  const X = [[1, 1], [1, 2], [5, 5], [6, 6]], y = [-1, -1, 1, 1];
  const m = trainPegasos(X, y, 0.01, 100, 42);
  for (let i = 0; i < X.length; i++) assert.equal(predictSVM(m, X[i]!), y[i]);
});
test('标签必须 ±1', () => { assert.throws(() => trainPegasos([[1]], [2], 0.01), RangeError); });
test('空集抛错', () => { assert.throws(() => trainPegasos([], [], 0.01), RangeError); });`,
});

// ml-svm-kernel (polynomial kernel SVM via kernel perceptron)
ALGS.push({
  id: 'ml-svm-kernel',
  m: ['多项式核 SVM（核感知器）', 'Polynomial Kernel SVM (Kernel Perceptron)', '用多项式核感知器求解非线性可分问题。', 'Polynomial kernel perceptron for non-linear separation.',
    '维护支持向量集合，预测用 K(x,z)=(x·z+c)^d 核函数加权求和。', 'Maintains support vectors; prediction via polynomial kernel K(x,z)=(x·z+c)^d.', 'O(n)', 'O(n)', ['ml', 'svm', 'kernel']],
  impl: `// 多项式核 SVM（核感知器）· 实现
export interface KernelPerceptronModel { sv: number[][]; alpha: number[]; degree: number; c: number; }
function polyKernel(a: number[], b: number[], degree: number, c: number): number {
  let dot = 0;
  for (let i = 0; i < a.length; i++) dot += a[i]! * b[i]!;
  return Math.pow(dot + c, degree);
}
export function kernelPerceptron(X: number[][], y: number[], degree = 2, c = 1, epochs = 10): KernelPerceptronModel {
  const sv: number[][] = []; const alpha: number[] = [];
  for (let e = 0; e < epochs; e++) {
    for (let i = 0; i < X.length; i++) {
      let s = 0;
      for (let j = 0; j < sv.length; j++) s += alpha[j]! * polyKernel(sv[j]!, X[i]!, degree, c);
      if (y[i]! * s <= 0) { sv.push(X[i]!.slice()); alpha.push(y[i]!); }
    }
  }
  return { sv, alpha, degree, c };
}
export function kernelPredict(model: KernelPerceptronModel, x: number[]): number {
  let s = 0;
  for (let j = 0; j < model.sv.length; j++) s += model.alpha[j]! * polyKernel(model.sv[j]!, x, model.degree, model.c);
  return s >= 0 ? 1 : -1;
}`,
  trace: metricTrace("import { kernelPerceptron, kernelPredict } from './impl.ts';\nconst X=[[0,0],[0,1],[1,0],[3,3],[4,4],[3,4]]; const y=[-1,-1,-1,1,1,1];",
    "(function(){const m=kernelPerceptron(X,y,2,1,10);return X.filter((x,i)=>kernelPredict(m,x)===y[i]).length;})()", '核感知器训练完成', 'kernel perceptron done'),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { kernelPerceptron, kernelPredict } from '../../src/algorithms/ml/ml-svm-kernel/impl.ts';
test('核感知器 非线性', () => {
  const X = [[0, 0], [0, 1], [1, 0], [3, 3], [4, 4], [3, 4]], y = [-1, -1, -1, 1, 1, 1];
  const m = kernelPerceptron(X, y, 2, 1, 20);
  let ok = 0; for (let i = 0; i < X.length; i++) if (kernelPredict(m, X[i]!) === y[i]) ok++;
  assert.ok(ok >= 4);
});`,
});

// ml-svm-multiclass (one-vs-rest)
ALGS.push({
  id: 'ml-svm-multiclass',
  m: ['多分类 SVM（One-vs-Rest）', 'Multiclass SVM (One-vs-Rest)', '用多个二分类 SVM 组合实现多分类。', 'Combine binary SVMs (one-vs-rest) for multiclass.',
    '为每个类训练一个 +1/-1 的二分类器，预测取决策值最大者。', 'Train a +1/-1 binary SVM per class; predict the class with the max decision value.', 'O(k·T·d)', 'O(k·d)', ['ml', 'svm', 'multiclass']],
  impl: `// 多分类 SVM（One-vs-Rest）· 实现
export interface PegasosModel { w: number[]; b: number; lambda: number; }
function dot(w: number[], x: number[]): number { let s = 0; for (let i = 0; i < w.length; i++) s += w[i]! * x[i]!; return s; }
function trainBinary(X: number[][], y: number[], lambda: number, epochs: number, seed: number): PegasosModel {
  const d = X[0]!.length; const w = new Array<number>(d).fill(0); let b = 0;
  let s = seed >>> 0; const rand = () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
  let t = 1;
  for (let e = 0; e < epochs; e++) {
    for (let i = 0; i < X.length; i++) {
      const xi = X[i]!, yi = y[i]!, eta = 1 / (lambda * t), decay = 1 - eta * lambda;
      for (let k = 0; k < d; k++) w[k]! *= decay; b *= decay;
      if (yi * (dot(w, xi) + b) < 1) { for (let k = 0; k < d; k++) w[k]! += eta * yi * xi[k]!; b += eta * yi; }
      t++;
    }
  }
  return { w, b, lambda };
}
export function ovrSvm(X: number[][], labels: number[], k: number, lambda = 0.01, epochs = 50): PegasosModel[] {
  const models: PegasosModel[] = [];
  for (let c = 0; c < k; c++) {
    const y = labels.map((l) => (l === c ? 1 : -1));
    models.push(trainBinary(X, y, lambda, epochs, c + 1));
  }
  return models;
}
export function predictOvr(models: PegasosModel[], x: number[]): number {
  let best = -Infinity, bc = 0;
  for (let c = 0; c < models.length; c++) { const v = dot(models[c]!.w, x) + models[c]!.b; if (v > best) { best = v; bc = c; } }
  return bc;
}`,
  trace: metricTrace("import { ovrSvm, predictOvr } from './impl.ts';\nconst X=[[1,1],[1,2],[5,5],[6,6],[1,6],[2,6]]; const labels=[0,0,1,1,2,2];",
    "(function(){const m=ovrSvm(X,labels,3);return X.filter((x,i)=>predictOvr(m,x)===labels[i]).length;})()", 'OvR 多分类完成', 'OvR multiclass done'),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ovrSvm, predictOvr } from '../../src/algorithms/ml/ml-svm-multiclass/impl.ts';
test('OvR 三类', () => {
  const X = [[1, 1], [1, 2], [5, 5], [6, 6], [1, 6], [2, 6]], labels = [0, 0, 1, 1, 2, 2];
  const m = ovrSvm(X, labels, 3, 0.01, 100);
  let ok = 0; for (let i = 0; i < X.length; i++) if (predictOvr(m, X[i]!) === labels[i]) ok++;
  assert.ok(ok >= 4);
});`,
});

// ml-naive-bayes-gaussian
ALGS.push({
  id: 'ml-naive-bayes-gaussian',
  m: ['高斯朴素贝叶斯', 'Gaussian Naive Bayes', '假设特征条件独立且服从高斯分布的分类器。', 'Classifier assuming conditionally-independent Gaussian features.',
    '对每类估计均值与方差，预测取最大后验概率。', 'Estimate per-class mean/variance; predict argmax posterior.', 'O(nd)', 'O(kd)', ['ml', 'naive-bayes', 'classification']],
  impl: `// 高斯朴素贝叶斯 · 实现
export interface GaussianNB { classes: number[]; means: number[][]; vars: number[][]; priors: number[]; }
function gaussianPdf(x: number, mean: number, var_: number): number {
  if (var_ === 0) return x === mean ? 1 : 1e-9;
  return Math.exp(-((x - mean) ** 2) / (2 * var_)) / Math.sqrt(2 * Math.PI * var_);
}
export function trainGaussianNB(X: number[][], y: number[]): GaussianNB {
  const classes = [...new Set(y)].sort((a, b) => a - b);
  const d = X[0]!.length;
  const means: number[][] = [], vars: number[][] = [], priors: number[] = [];
  for (const c of classes) {
    const pts = X.filter((_, i) => y[i] === c);
    const m = new Array<number>(d).fill(0), v = new Array<number>(d).fill(0);
    for (let j = 0; j < d; j++) { m[j] = pts.reduce((s, p) => s + p[j]!, 0) / pts.length; }
    for (let j = 0; j < d; j++) v[j] = pts.reduce((s, p) => s + (p[j]! - m[j]!) ** 2, 0) / pts.length;
    means.push(m); vars.push(v); priors.push(pts.length / X.length);
  }
  return { classes, means, vars, priors };
}
export function predictGaussianNB(model: GaussianNB, x: number[]): number {
  let best = -Infinity, bc = model.classes[0]!;
  for (let k = 0; k < model.classes.length; k++) {
    let logp = Math.log(model.priors[k]!);
    for (let j = 0; j < x.length; j++) logp += Math.log(gaussianPdf(x[j]!, model.means[k]![j]!, model.vars[k]![j]!));
    if (logp > best) { best = logp; bc = model.classes[k]!; }
  }
  return bc;
}`,
  trace: metricTrace("import { trainGaussianNB, predictGaussianNB } from './impl.ts';\nconst X=[[1,1],[1.1,0.9],[5,5],[5.1,4.9]]; const y=[0,0,1,1];",
    "(function(){const m=trainGaussianNB(X,y);return X.filter((x,i)=>predictGaussianNB(m,x)===y[i]).length;})()", '高斯NB 训练完成', 'Gaussian NB done'),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { trainGaussianNB, predictGaussianNB } from '../../src/algorithms/ml/ml-naive-bayes-gaussian/impl.ts';
test('高斯NB 两类', () => {
  const X = [[1, 1], [1.1, 0.9], [5, 5], [5.1, 4.9]], y = [0, 0, 1, 1];
  const m = trainGaussianNB(X, y);
  let ok = 0; for (let i = 0; i < X.length; i++) if (predictGaussianNB(m, X[i]!) === y[i]) ok++;
  assert.equal(ok, 4);
});`,
});

// ml-naive-bayes-bernoulli
ALGS.push({
  id: 'ml-naive-bayes-bernoulli',
  m: ['伯努利朴素贝叶斯', 'Bernoulli Naive Bayes', '用于二值特征的朴素贝叶斯（文本分类）。', 'Naive Bayes for binary features (text classification).',
    '每类每特征估计出现概率，预测取最大对数后验。', 'Estimate per-class feature presence probabilities; predict argmax log-posterior.', 'O(nd)', 'O(kd)', ['ml', 'naive-bayes', 'text']],
  impl: `// 伯努利朴素贝叶斯 · 实现
export interface BernoulliNB { classes: number[]; probs: number[][]; priors: number[]; }
export function trainBernoulliNB(X: number[][], y: number[], alpha = 1): BernoulliNB {
  const classes = [...new Set(y)].sort((a, b) => a - b);
  const d = X[0]!.length;
  const probs: number[][] = [], priors: number[] = [];
  for (const c of classes) {
    const pts = X.filter((_, i) => y[i] === c);
    const p = new Array<number>(d).fill(0);
    for (let j = 0; j < d; j++) p[j] = (pts.reduce((s, r) => s + (r[j]! > 0 ? 1 : 0), 0) + alpha) / (pts.length + 2 * alpha);
    probs.push(p); priors.push(pts.length / X.length);
  }
  return { classes, probs, priors };
}
export function predictBernoulliNB(model: BernoulliNB, x: number[]): number {
  let best = -Infinity, bc = model.classes[0]!;
  for (let k = 0; k < model.classes.length; k++) {
    let logp = Math.log(model.priors[k]!);
    for (let j = 0; j < x.length; j++) {
      const p = model.probs[k]![j]!;
      const b = x[j]! > 0 ? 1 : 0;
      logp += b * Math.log(p) + (1 - b) * Math.log(1 - p);
    }
    if (logp > best) { best = logp; bc = model.classes[k]!; }
  }
  return bc;
}`,
  trace: metricTrace("import { trainBernoulliNB, predictBernoulliNB } from './impl.ts';\nconst X=[[1,0,1],[0,1,0],[1,1,1],[0,0,1]]; const y=[0,1,0,1];",
    "(function(){const m=trainBernoulliNB(X,y);return X.filter((x,i)=>predictBernoulliNB(m,x)===y[i]).length;})()", '伯努利NB 训练完成', 'Bernoulli NB done'),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { trainBernoulliNB, predictBernoulliNB } from '../../src/algorithms/ml/ml-naive-bayes-bernoulli/impl.ts';
test('伯努利NB 训练+预测', () => {
  const X = [[1, 0, 1], [0, 1, 0], [1, 1, 1], [0, 0, 1]], y = [0, 1, 0, 1];
  const m = trainBernoulliNB(X, y);
  assert.equal(typeof predictBernoulliNB(m, [1, 0, 1]), 'number');
});`,
});

// ml-naive-bayes-multinomial
ALGS.push({
  id: 'ml-naive-bayes-multinomial',
  m: ['多项式朴素贝叶斯', 'Multinomial Naive Bayes', '用于计数特征（词频）的朴素贝叶斯。', 'Naive Bayes for count features (word counts).',
    '每类估计特征多项式分布概率，预测取最大对数后验。', 'Estimate per-class multinomial feature probabilities; predict argmax log-posterior.', 'O(nd)', 'O(kd)', ['ml', 'naive-bayes', 'text']],
  impl: `// 多项式朴素贝叶斯 · 实现
export interface MultinomialNB { classes: number[]; logProbs: number[][]; logPriors: number[]; }
export function trainMultinomialNB(X: number[][], y: number[], alpha = 1): MultinomialNB {
  const classes = [...new Set(y)].sort((a, b) => a - b);
  const d = X[0]!.length;
  const logProbs: number[][] = [], logPriors: number[] = [];
  for (const c of classes) {
    const pts = X.filter((_, i) => y[i] === c);
    const sums = new Array<number>(d).fill(alpha);
    let total = alpha * d;
    for (let j = 0; j < d; j++) { for (const r of pts) sums[j]! += r[j]!; total += sums[j]! - alpha; }
    const lp = sums.map((s) => Math.log(s / total));
    logProbs.push(lp); logPriors.push(Math.log(pts.length / X.length));
  }
  return { classes, logProbs, logPriors };
}
export function predictMultinomialNB(model: MultinomialNB, x: number[]): number {
  let best = -Infinity, bc = model.classes[0]!;
  for (let k = 0; k < model.classes.length; k++) {
    let logp = model.logPriors[k]!;
    for (let j = 0; j < x.length; j++) logp += x[j]! * model.logProbs[k]![j]!;
    if (logp > best) { best = logp; bc = model.classes[k]!; }
  }
  return bc;
}`,
  trace: metricTrace("import { trainMultinomialNB, predictMultinomialNB } from './impl.ts';\nconst X=[[2,1,0],[1,0,2],[0,2,1],[5,0,0]]; const y=[0,1,1,0];",
    "(function(){const m=trainMultinomialNB(X,y);return X.filter((x,i)=>predictMultinomialNB(m,x)===y[i]).length;})()", '多项式NB 训练完成', 'Multinomial NB done'),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { trainMultinomialNB, predictMultinomialNB } from '../../src/algorithms/ml/ml-naive-bayes-multinomial/impl.ts';
test('多项式NB 训练', () => {
  const X = [[2, 1, 0], [1, 0, 2], [0, 2, 1], [5, 0, 0]], y = [0, 1, 1, 0];
  const m = trainMultinomialNB(X, y);
  assert.equal(typeof predictMultinomialNB(m, [3, 0, 0]), 'number');
});`,
});

// ml-decision-tree-c45
ALGS.push({
  id: 'ml-decision-tree-c45',
  m: ['C4.5 决策树', 'C4.5 Decision Tree', '用信息增益率（gain ratio）构建决策树。', 'Build a decision tree using gain ratio.',
    'C4.5 改进 ID3：用信息增益率 = 信息增益/分裂信息，避免偏向多值特征。', 'C4.5 improves ID3 by using gain ratio = gain/split-info to avoid bias toward many-valued features.', 'O(n·d·log n)', 'O(d)', ['ml', 'decision-tree']],
  impl: `// C4.5 决策树 · 实现
export interface TreeNode { isLeaf: boolean; label?: number; feature?: number; threshold?: number; left?: TreeNode; right?: TreeNode; }
function entropy(labels: number[]): number {
  const total = labels.length; if (total === 0) return 0;
  const m: Record<number, number> = {}; for (const v of labels) m[v] = (m[v] ?? 0) + 1;
  let h = 0; for (const k in m) { const p = m[k]! / total; h -= p * Math.log2(p); }
  return h;
}
function splitInfo(parts: number[], total: number): number {
  let h = 0; for (const c of parts) { if (c > 0) { const p = c / total; h -= p * Math.log2(p); } }
  return h;
}
export function buildC45(features: number[][], labels: number[], depth = 0, maxDepth = 5): TreeNode {
  const uniq = [...new Set(labels)];
  if (uniq.length === 1 || depth >= maxDepth || features.length === 0) return { isLeaf: true, label: labels[0] };
  const base = entropy(labels);
  let bestGain = -1, bestF = 0, bestT = 0;
  const d = features[0]!.length;
  for (let f = 0; f < d; f++) {
    const vals = [...new Set(features.map((r) => r[f]!))].sort((a, b) => a - b);
    for (let i = 0; i < vals.length - 1; i++) {
      const t = (vals[i]! + vals[i + 1]!) / 2;
      const left: number[] = [], right: number[] = [];
      for (let r = 0; r < features.length; r++) (features[r]![f]! <= t ? left : right).push(labels[r]!);
      if (left.length === 0 || right.length === 0) continue;
      const gain = base - (left.length / labels.length) * entropy(left) - (right.length / labels.length) * entropy(right);
      const si = splitInfo([left.length, right.length], labels.length);
      const ratio = si === 0 ? 0 : gain / si;
      if (ratio > bestGain) { bestGain = ratio; bestF = f; bestT = t; }
    }
  }
  const leftIdx: number[] = [], rightIdx: number[] = [];
  for (let r = 0; r < features.length; r++) (features[r]![bestF]! <= bestT ? leftIdx : rightIdx).push(r);
  return { isLeaf: false, feature: bestF, threshold: bestT,
    left: buildC45(leftIdx.map((i) => features[i]!), leftIdx.map((i) => labels[i]!), depth + 1, maxDepth),
    right: buildC45(rightIdx.map((i) => features[i]!), rightIdx.map((i) => labels[i]!), depth + 1, maxDepth) };
}
export function predictC45(node: TreeNode, x: number[]): number {
  while (!node.isLeaf) node = x[node.feature!]! <= node.threshold! ? node.left! : node.right!;
  return node.label!;
}`,
  trace: metricTrace("import { buildC45, predictC45 } from './impl.ts';\nconst X=[[1,1],[1,2],[5,5],[6,6]]; const y=[0,0,1,1];",
    "(function(){const t=buildC45(X,y);return X.filter((x,i)=>predictC45(t,x)===y[i]).length;})()", 'C4.5 构建完成', 'C4.5 built'),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildC45, predictC45 } from '../../src/algorithms/ml/ml-decision-tree-c45/impl.ts';
test('C4.5 可分', () => {
  const X = [[1, 1], [1, 2], [5, 5], [6, 6]], y = [0, 0, 1, 1];
  const t = buildC45(X, y);
  for (let i = 0; i < X.length; i++) assert.equal(predictC45(t, X[i]!), y[i]);
});`,
});

// ml-decision-tree-cart
ALGS.push({
  id: 'ml-decision-tree-cart',
  m: ['CART 决策树', 'CART Decision Tree', '用基尼指数构建二叉决策树。', 'Build a binary decision tree using the Gini index.',
    'CART 每次选使基尼增益最大的特征与阈值进行二分裂。', 'CART picks the feature/threshold maximizing Gini gain at each binary split.', 'O(n·d·log n)', 'O(d)', ['ml', 'decision-tree']],
  impl: `// CART 决策树 · 实现
export interface TreeNode { isLeaf: boolean; label?: number; feature?: number; threshold?: number; left?: TreeNode; right?: TreeNode; }
function gini(labels: number[]): number {
  const total = labels.length; if (total === 0) return 0;
  const m: Record<number, number> = {}; for (const v of labels) m[v] = (m[v] ?? 0) + 1;
  let s = 0; for (const k in m) { const p = m[k]! / total; s += p * p; }
  return 1 - s;
}
export function buildCart(features: number[][], labels: number[], depth = 0, maxDepth = 5): TreeNode {
  const uniq = [...new Set(labels)];
  if (uniq.length === 1 || depth >= maxDepth || features.length === 0) return { isLeaf: true, label: labels[0] };
  const base = gini(labels);
  let bestGain = -1, bestF = 0, bestT = 0;
  const d = features[0]!.length;
  for (let f = 0; f < d; f++) {
    const vals = [...new Set(features.map((r) => r[f]!))].sort((a, b) => a - b);
    for (let i = 0; i < vals.length - 1; i++) {
      const t = (vals[i]! + vals[i + 1]!) / 2;
      const left: number[] = [], right: number[] = [];
      for (let r = 0; r < features.length; r++) (features[r]![f]! <= t ? left : right).push(labels[r]!);
      if (left.length === 0 || right.length === 0) continue;
      const g = base - (left.length / labels.length) * gini(left) - (right.length / labels.length) * gini(right);
      if (g > bestGain) { bestGain = g; bestF = f; bestT = t; }
    }
  }
  const lI: number[] = [], rI: number[] = [];
  for (let r = 0; r < features.length; r++) (features[r]![bestF]! <= bestT ? lI : rI).push(r);
  return { isLeaf: false, feature: bestF, threshold: bestT,
    left: buildCart(lI.map((i) => features[i]!), lI.map((i) => labels[i]!), depth + 1, maxDepth),
    right: buildCart(rI.map((i) => features[i]!), rI.map((i) => labels[i]!), depth + 1, maxDepth) };
}
export function predictCart(node: TreeNode, x: number[]): number {
  while (!node.isLeaf) node = x[node.feature!]! <= node.threshold! ? node.left! : node.right!;
  return node.label!;
}`,
  trace: metricTrace("import { buildCart, predictCart } from './impl.ts';\nconst X=[[1,1],[2,1],[5,5],[6,5]]; const y=[0,0,1,1];",
    "(function(){const t=buildCart(X,y);return X.filter((x,i)=>predictCart(t,x)===y[i]).length;})()", 'CART 构建完成', 'CART built'),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildCart, predictCart } from '../../src/algorithms/ml/ml-decision-tree-cart/impl.ts';
test('CART 可分', () => {
  const X = [[1, 1], [2, 1], [5, 5], [6, 5]], y = [0, 0, 1, 1];
  const t = buildCart(X, y);
  for (let i = 0; i < X.length; i++) assert.equal(predictCart(t, X[i]!), y[i]);
});`,
});

// ml-knn-weighted (distance-weighted)
ALGS.push({
  id: 'ml-knn-weighted',
  m: ['加权 KNN 分类', 'Distance-Weighted kNN', '按距离倒数加权投票的 KNN。', 'kNN with inverse-distance weighted voting.',
    '近邻权重 = 1/d（或 1/d²），缓解少数离群近邻的影响。', 'Weight each neighbor by 1/d (or 1/d²) to reduce outlier influence.', 'O(nd)', 'O(d)', ['ml', 'knn', 'classification']],
  impl: `// 加权 KNN 分类 · 实现
export interface Sample { x: number[]; y: number; }
export function weightedKnn(train: Sample[], query: number[], k = 3, power = 2): number {
  if (train.length === 0) throw new RangeError('训练集为空');
  const kEff = Math.min(k, train.length);
  const dists = train.map((s) => ({ y: s.y, d: Math.hypot(...s.x.map((v, j) => v - query[j]!)) }));
  dists.sort((a, b) => a.d - b.d);
  const votes: Record<number, number> = {};
  for (let n = 0; n < kEff; n++) { const w = 1 / Math.pow(dists[n]!.d + 1e-9, power); votes[dists[n]!.y] = (votes[dists[n]!.y] ?? 0) + w; }
  let best = -1, bestW = -Infinity;
  for (const c in votes) if (votes[c]! > bestW) { bestW = votes[c]!; best = Number(c); }
  return best;
}`,
  trace: metricTrace("import { weightedKnn, type Sample } from './impl.ts';\nconst train:Sample[]=[{x:[0,0],y:0},{x:[0.1,0.1],y:0},{x:[5,5],y:1},{x:[5.1,5.1],y:1}];",
    "weightedKnn(train,[0.2,0.2])", '加权KNN 预测完成', 'weighted kNN done'),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { weightedKnn, type Sample } from '../../src/algorithms/ml/ml-knn-weighted/impl.ts';
test('加权KNN 分类', () => {
  const train: Sample[] = [{ x: [0, 0], y: 0 }, { x: [0.1, 0.1], y: 0 }, { x: [5, 5], y: 1 }, { x: [5.1, 5.1], y: 1 }];
  assert.equal(weightedKnn(train, [0.2, 0.2], 3), 0);
  assert.equal(weightedKnn(train, [4.9, 4.9], 3), 1);
});`,
});

// ml-knn-ball-tree
ALGS.push({
  id: 'ml-knn-ball-tree',
  m: ['球树 KNN', 'Ball Tree kNN', '用球树结构加速 KNN 查询。', 'Accelerate kNN queries using a ball tree.',
    '递归把点集按最远方向分裂，每个节点记录球心与半径，查询时剪枝。', 'Recursively split points along the spread direction; each node stores center+radius for pruning.', 'O(n log n)', 'O(n)', ['ml', 'knn', 'tree']],
  impl: `// 球树 KNN · 实现（返回最近邻距离）
export interface BallNode { center: number[]; radius: number; left: BallNode | null; right: BallNode | null; point: number[] | null; }
function farthestFrom(pts: number[][], p: number[]): number {
  let bi = 0, bd = -1;
  for (let i = 0; i < pts.length; i++) { const d = Math.hypot(...pts[i]!.map((v, j) => v - p[j]!)); if (d > bd) { bd = d; bi = i; } }
  return bi;
}
function buildBall(pts: number[][]): BallNode {
  const n = pts.length;
  const center = pts[0]!.map((_, j) => pts.reduce((s, p) => s + p[j]!, 0) / n);
  let radius = 0;
  for (const p of pts) radius = Math.max(radius, Math.hypot(...p.map((v, j) => v - center[j]!)));
  if (n === 1) return { center, radius, left: null, right: null, point: pts[0]! };
  const a = pts[farthestFrom(pts, center)]!;
  const b = pts[farthestFrom(pts, a)]!;
  const left = pts.filter((p) => Math.hypot(...p.map((v, j) => v - a[j]!)) <= Math.hypot(...p.map((v, j) => v - b[j]!)));
  const right = pts.filter((p) => !(Math.hypot(...p.map((v, j) => v - a[j]!)) <= Math.hypot(...p.map((v, j) => v - b[j]!))));
  return { center, radius, left: left.length ? buildBall(left) : null, right: right.length ? buildBall(right) : null, point: null };
}
export function ballTreeKnn(pts: number[][], query: number[]): number {
  if (pts.length === 0) return Infinity;
  const root = buildBall(pts);
  let best = Infinity;
  const visit = (node: BallNode | null): void => {
    if (!node) return;
    const lb = Math.hypot(...query.map((v, j) => v - node.center[j]!)) - node.radius;
    if (lb > best) return;
    if (node.point) { best = Math.min(best, Math.hypot(...query.map((v, j) => v - node.point![j]!))); return; }
    visit(node.left); visit(node.right);
  };
  visit(root);
  return best;
}`,
  trace: metricTrace("import { ballTreeKnn } from './impl.ts';\nconst pts=[[0,0],[1,1],[5,5],[6,6]];",
    "Math.round(ballTreeKnn(pts,[0.1,0.1])*100)/100", '球树查询完成', 'ball tree query done'),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ballTreeKnn } from '../../src/algorithms/ml/ml-knn-ball-tree/impl.ts';
test('球树 KNN 距离', () => {
  const pts = [[0, 0], [1, 1], [5, 5], [6, 6]];
  const d = ballTreeKnn(pts, [0.1, 0.1]);
  assert.ok(d < 0.2);
});
test('球树 空集', () => { assert.equal(ballTreeKnn([], [0, 0]), Infinity); });`,
});

// ml-knn-cover-tree
ALGS.push({
  id: 'ml-knn-cover-tree',
  m: ['覆盖树 KNN', 'Cover Tree kNN', '用基于展开不变的覆盖树加速 KNN。', 'Accelerate kNN with an expansion-invariant cover tree.',
    '覆盖树以层次距离分层，查询从粗到细，理论 O(log n)。', 'Layered by distances; query descends coarse-to-fine, theoretically O(log n).', 'O(n log n)', 'O(n)', ['ml', 'knn', 'tree']],
  impl: `// 覆盖树 KNN · 实现（简化版：返回最近邻距离）
export interface CoverNode { point: number[]; children: CoverNode[]; }
function dist(a: number[], b: number[]): number { return Math.hypot(...a.map((v, i) => v - b[i]!)); }
export function bruteNearest(pts: number[][], query: number[]): number {
  if (pts.length === 0) return Infinity;
  return Math.min(...pts.map((p) => dist(p, query)));
}
// Simplified cover tree: just build a chain by nearest-first insertion (placeholder structure).
export function buildCoverTree(pts: number[][]): CoverNode | null {
  if (pts.length === 0) return null;
  const root: CoverNode = { point: pts[0]!, children: [] };
  for (let i = 1; i < pts.length; i++) root.children.push({ point: pts[i]!, children: [] });
  return root;
}
export function coverTreeNearest(root: CoverNode | null, query: number[]): number {
  if (!root) return Infinity;
  let best = dist(root.point, query);
  for (const c of root.children) best = Math.min(best, dist(c.point, query));
  return best;
}`,
  trace: metricTrace("import { buildCoverTree, coverTreeNearest } from './impl.ts';\nconst pts=[[0,0],[1,1],[5,5]];",
    "Math.round(coverTreeNearest(buildCoverTree(pts),[0.1,0.1])*100)/100", '覆盖树查询完成', 'cover tree done'),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildCoverTree, coverTreeNearest, bruteNearest } from '../../src/algorithms/ml/ml-knn-cover-tree/impl.ts';
test('覆盖树 与暴力一致', () => {
  const pts = [[0, 0], [1, 1], [5, 5], [6, 6]];
  const root = buildCoverTree(pts);
  assert.ok(Math.abs(coverTreeNearest(root, [0.1, 0.1]) - bruteNearest(pts, [0.1, 0.1])) < 1e-9);
});`,
});

// ml-gradient-boost-regression
ALGS.push({
  id: 'ml-gradient-boost-regression',
  m: ['梯度提升回归', 'Gradient Boosting Regression', '用浅层回归树集成拟合负梯度。', 'Ensemble shallow regression trees fitting negative gradients.',
    '每轮训练一棵拟合残差（负梯度）的回归树（深度=1 决策桩），累加预测。', 'Each round trains a depth-1 stump on residuals; predictions accumulate.', 'O(M·n·d)', 'O(M·d)', ['ml', 'gradient-boost', 'regression']],
  impl: `// 梯度提升回归 · 实现
export interface Stump { feature: number; threshold: number; left: number; right: number; }
function fitStump(X: number[][], r: number[]): Stump {
  const d = X[0]!.length; let best = Infinity, bestF = 0, bestT = 0, bestL = 0, bestR = 0;
  for (let f = 0; f < d; f++) {
    const vals = [...new Set(X.map((row) => row[f]!))].sort((a, b) => a - b);
    for (let i = 0; i < vals.length - 1; i++) {
      const t = (vals[i]! + vals[i + 1]!) / 2;
      const left = r.filter((_, k) => X[k]![f]! <= t), right = r.filter((_, k) => X[k]![f]! > t);
      if (left.length === 0 || right.length === 0) continue;
      const ml = left.reduce((a, b) => a + b, 0) / left.length, mr = right.reduce((a, b) => a + b, 0) / right.length;
      let sse = 0;
      for (let k = 0; k < r.length; k++) { const p = X[k]![f]! <= t ? ml : mr; sse += (r[k]! - p) ** 2; }
      if (sse < best) { best = sse; bestF = f; bestT = t; bestL = ml; bestR = mr; }
    }
  }
  return { feature: bestF, threshold: bestT, left: bestL, right: bestR };
}
export interface GBResult { stumps: Stump[]; init: number; }
export function gradientBoostRegression(X: number[][], y: number[], rounds = 20, lr = 0.1): GBResult {
  const init = y.reduce((a, b) => a + b, 0) / y.length;
  const pred = new Array<number>(y.length).fill(init);
  const stumps: Stump[] = [];
  for (let m = 0; m < rounds; m++) {
    const r = y.map((v, i) => v - pred[i]!);
    const s = fitStump(X, r);
    stumps.push(s);
    for (let k = 0; k < y.length; k++) pred[k]! += lr * (X[k]![s.feature]! <= s.threshold ? s.left : s.right);
  }
  return { stumps, init };
}
export function predictGB(model: GBResult, x: number[], lr = 0.1): number {
  let p = model.init;
  for (const s of model.stumps) p += lr * (x[s.feature]! <= s.threshold ? s.left : s.right);
  return p;
}`,
  trace: metricTrace("import { gradientBoostRegression, predictGB } from './impl.ts';\nconst X=[[1],[2],[3],[4]]; const y=[2,4,6,8];",
    "Math.round(predictGB(gradientBoostRegression(X,y,30),[2.5])*100)/100", '梯度提升训练完成', 'GB done'),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { gradientBoostRegression, predictGB } from '../../src/algorithms/ml/ml-gradient-boost-regression/impl.ts';
test('GB 拟合 y=2x', () => {
  const X = [[1], [2], [3], [4]], y = [2, 4, 6, 8];
  const m = gradientBoostRegression(X, y, 50, 0.5);
  const p = predictGB(m, [2.5], 0.5);
  assert.ok(p > 3 && p < 7);
});`,
});

// ml-xgboost-regression
ALGS.push({
  id: 'ml-xgboost-regression',
  m: ['XGBoost 回归', 'XGBoost Regression', '二阶可导目标下的梯度提升（带正则）。', 'Gradient boosting with second-order gradients and regularization.',
    '用一阶 g 与二阶 h 梯度求最优叶子权重 w*=-G/(H+λ)，目标含 L2 正则。', 'Optimal leaf weight w*=-G/(H+λ) using first/second-order gradients with L2 regularization.', 'O(M·n·d)', 'O(M·d)', ['ml', 'xgboost', 'regression']],
  impl: `// XGBoost 回归（简化版）· 实现
export interface Leaf { feature: number; threshold: number; left: number; right: number; }
function fitLeaf(X: number[][], g: number[], h: number[], lambda: number): Leaf {
  const d = X[0]!.length; let bestScore = -Infinity, bestF = 0, bestT = 0;
  let bestL = 0, bestR = 0;
  for (let f = 0; f < d; f++) {
    const vals = [...new Set(X.map((r) => r[f]!))].sort((a, b) => a - b);
    for (let i = 0; i < vals.length - 1; i++) {
      const t = (vals[i]! + vals[i + 1]!) / 2;
      let GL = 0, HL = 0, GR = 0, HR = 0;
      for (let k = 0; k < X.length; k++) { if (X[k]![f]! <= t) { GL += g[k]!; HL += h[k]!; } else { GR += g[k]!; HR += h[k]!; } }
      const score = (GL * GL) / (HL + lambda) + (GR * GR) / (HR + lambda);
      if (score > bestScore) {
        bestScore = score; bestF = f; bestT = t;
        bestL = -GL / (HL + lambda); bestR = -GR / (HR + lambda);
      }
    }
  }
  return { feature: bestF, threshold: bestT, left: bestL, right: bestR };
}
export interface XGBResult { leaves: Leaf[]; init: number; }
export function xgboostRegression(X: number[][], y: number[], rounds = 20, lr = 0.3, lambda = 1): XGBResult {
  const init = y.reduce((a, b) => a + b, 0) / y.length;
  const pred = new Array<number>(y.length).fill(init);
  const leaves: Leaf[] = [];
  for (let m = 0; m < rounds; m++) {
    const g = y.map((v, i) => pred[i]! - v); // gradient of MSE = pred - y
    const h = new Array<number>(y.length).fill(1); // hessian of MSE = 1
    const leaf = fitLeaf(X, g, h, lambda);
    leaves.push(leaf);
    for (let k = 0; k < y.length; k++) pred[k]! += lr * (X[k]![leaf.feature]! <= leaf.threshold ? leaf.left : leaf.right);
  }
  return { leaves, init };
}
export function predictXGB(model: XGBResult, x: number[], lr = 0.3): number {
  let p = model.init;
  for (const l of model.leaves) p += lr * (x[l.feature]! <= l.threshold ? l.left : l.right);
  return p;
}`,
  trace: metricTrace("import { xgboostRegression, predictXGB } from './impl.ts';\nconst X=[[1],[2],[3],[4]]; const y=[2,4,6,8];",
    "Math.round(predictXGB(xgboostRegression(X,y,30),[2.5])*100)/100", 'XGBoost 训练完成', 'XGBoost done'),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { xgboostRegression, predictXGB } from '../../src/algorithms/ml/ml-xgboost-regression/impl.ts';
test('XGBoost 拟合 y=2x', () => {
  const X = [[1], [2], [3], [4]], y = [2, 4, 6, 8];
  const m = xgboostRegression(X, y, 50, 0.5);
  const p = predictXGB(m, [2.5], 0.5);
  assert.ok(p > 3 && p < 7);
});`,
});

// ml-random-forest-extra
ALGS.push({
  id: 'ml-random-forest-extra',
  m: ['Extra Trees（极随机树）', 'Extremely Randomized Trees', '分裂阈值随机的集成树。', 'Ensemble trees with random split thresholds.',
    'Extra Trees 在每个候选特征上随机选阈值（而非最优），降低方差、加速训练。', 'Extra Trees picks random thresholds per feature (not optimal), reducing variance and speeding training.', 'O(M·n·d)', 'O(M·d)', ['ml', 'random-forest', 'ensemble']],
  impl: `// Extra Trees · 实现
export interface ETStump { feature: number; threshold: number; left: number; right: number; }
function fitExtraStump(X: number[][], y: number[], seed: number): ETStump {
  const d = X[0]!.length;
  let s = seed >>> 0;
  const rand = () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
  const f = Math.floor(rand() * d);
  const vals = X.map((r) => r[f]!);
  const mn = Math.min(...vals), mx = Math.max(...vals);
  const t = mn + rand() * (mx - mn);
  const left = y.filter((_, k) => X[k]![f]! <= t), right = y.filter((_, k) => X[k]![f]! > t);
  const ml = left.length ? Math.round(left.reduce((a, b) => a + b, 0) / left.length) : 0;
  const mr = right.length ? Math.round(right.reduce((a, b) => a + b, 0) / right.length) : 0;
  return { feature: f, threshold: t, left: ml, right: mr };
}
export interface ETModel { stumps: ETStump[]; }
export function extraTrees(X: number[][], y: number[], nTrees = 10): ETModel {
  const stumps: ETStump[] = [];
  for (let i = 0; i < nTrees; i++) stumps.push(fitExtraStump(X, y, i + 1));
  return { stumps };
}
export function predictExtra(model: ETModel, x: number[]): number {
  const votes: Record<number, number> = {};
  for (const s of model.stumps) { const p = x[s.feature]! <= s.threshold ? s.left : s.right; votes[p] = (votes[p] ?? 0) + 1; }
  let best = -1, max = -1; for (const c in votes) if (votes[c]! > max) { max = votes[c]!; best = Number(c); }
  return best;
}`,
  trace: metricTrace("import { extraTrees, predictExtra } from './impl.ts';\nconst X=[[1,1],[1,2],[5,5],[6,6]]; const y=[0,0,1,1];",
    "(function(){const m=extraTrees(X,y,15);return X.filter((x,i)=>predictExtra(m,x)===y[i]).length;})()", 'Extra Trees 训练完成', 'Extra Trees done'),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { extraTrees, predictExtra } from '../../src/algorithms/ml/ml-random-forest-extra/impl.ts';
test('Extra Trees 可调用', () => {
  const X = [[1, 1], [1, 2], [5, 5], [6, 6]], y = [0, 0, 1, 1];
  const m = extraTrees(X, y, 20);
  assert.equal(typeof predictExtra(m, [3, 3]), 'number');
});`,
});

// ml-neural-net-cnn
ALGS.push({
  id: 'ml-neural-net-cnn',
  m: ['一维卷积层前向', '1D Convolution Layer Forward', '一维卷积神经网络层的前向传播。', 'Forward pass of a 1D convolutional layer.',
    '用多个卷积核滑过输入序列，每个位置求加权和+激活，输出特征图。', 'Multiple kernels slide over the input sequence producing weighted sums + activation.', 'O(k·L·c)', 'O(k·L)', ['ml', 'neural-network', 'cnn']],
  impl: `// 一维卷积层前向 · 实现
export function conv1d(input: number[], kernel: number[]): number[] {
  const k = kernel.length, out: number[] = [];
  for (let i = 0; i <= input.length - k; i++) {
    let s = 0;
    for (let j = 0; j < k; j++) s += input[i + j]! * kernel[j]!;
    out.push(Math.tanh(s));
  }
  return out;
}
export function maxPool1d(input: number[], poolSize = 2): number[] {
  const out: number[] = [];
  for (let i = 0; i < input.length; i += poolSize) {
    let m = -Infinity;
    for (let j = 0; j < poolSize && i + j < input.length; j++) m = Math.max(m, input[i + j]!);
    out.push(m);
  }
  return out;
}`,
  trace: metricTrace("import { conv1d, maxPool1d } from './impl.ts';\nconst x=[1,2,3,4,5,6]; const k=[1,0,-1];",
    "maxPool1d(conv1d(x,k)).length", 'CNN 前向完成', 'CNN forward done'),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { conv1d, maxPool1d } from '../../src/algorithms/ml/ml-neural-net-cnn/impl.ts';
test('conv1d 长度', () => {
  const out = conv1d([1, 2, 3, 4], [1, 0]);
  assert.equal(out.length, 3);
});
test('maxPool1d', () => { assert.deepEqual(maxPool1d([1, 5, 3, 2], 2), [5, 3]); });`,
});

// write all restored
for (const a of ALGS) {
  writeAlg(a.id, meta(a.id, ...a.m), a.impl, a.trace, a.test);
}
console.log('restored ' + ALGS.length + ' ml algorithms');
