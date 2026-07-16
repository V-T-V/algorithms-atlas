// Generator for 45 NEW ml algorithms (geometry 55→100). Uses 'ml-' prefix ids (unique).
// Uses proven metricTrace helper (real newlines, no fragile .replace chains).
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

// 2-frame trace. impLine is the import+setup line (joined by \\n in the generated source).
// expr is evaluated inside buildTrace; its value is shown.
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

// 1. ml-knn-regressor
ALGS.push({
  id: 'ml-knn-regressor',
  m: ['KNN 回归', 'k-Nearest Neighbors Regression', '用 k 个最近邻目标值的均值做回归预测。', 'Predict via average of k nearest neighbors target values.',
    '对查询点找出欧氏距离最近的 k 个训练样本，取其目标值平均作为预测。', 'Find k nearest training samples by Euclidean distance; predict the mean of their targets.', 'O(nd)', 'O(d)', ['ml', 'knn', 'regression']],
  impl: `// KNN 回归 · 实现
export interface Sample { x: number[]; y: number; }
export function knnRegressor(train: Sample[], query: number[], k = 3): number {
  if (train.length === 0) throw new RangeError('训练集为空');
  const kEff = Math.min(k, train.length);
  const dists = train.map((s, i) => ({ i, d: Math.hypot(...s.x.map((v, j) => v - query[j]!)) }));
  dists.sort((a, b) => a.d - b.d);
  let sum = 0;
  for (let n = 0; n < kEff; n++) sum += train[dists[n]!.i]!.y;
  return sum / kEff;
}`,
  trace: metricTrace("import { knnRegressor } from './impl.ts';\nconst train=[{x:[0,0],y:0},{x:[1,0],y:1},{x:[0,1],y:1},{x:[2,2],y:2}]; const q=[1,1];",
    "knnRegressor(train,q,3)", '预测完成', 'prediction done'),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { knnRegressor, type Sample } from '../../src/algorithms/ml/ml-knn-regressor/impl.ts';
test('KNN 回归 线性', () => {
  const train: Sample[] = [{ x: [0], y: 0 }, { x: [1], y: 1 }, { x: [2], y: 2 }];
  const p = knnRegressor(train, [1.5], 2);
  assert.ok(p >= 1 && p <= 2);
});
test('KNN 回归 空集报错', () => { assert.throws(() => knnRegressor([], [0], 1), RangeError); });`,
});

// 2. ml-kmeans-silhouette
ALGS.push({
  id: 'ml-kmeans-silhouette',
  m: ['轮廓系数', 'Silhouette Coefficient', '评估聚类质量：样本内聚度与分离度之差比。', 'Evaluate clustering: silhouette = (b-a)/max(a,b).',
    'a=同簇平均距离，b=最近他簇平均距离，s=(b-a)/max(a,b) ∈ [-1,1]。', 'a=mean intra-cluster distance, b=mean nearest-other-cluster distance; s=(b-a)/max(a,b).', 'O(n^2)', 'O(n)', ['ml', 'clustering', 'evaluation']],
  impl: `// 轮廓系数 · 实现
export interface SilResult { score: number; perSample: number[]; }
export function silhouette(points: number[][], labels: number[]): SilResult {
  const n = points.length;
  if (n === 0) return { score: 0, perSample: [] };
  const perSample: number[] = new Array(n).fill(0);
  let total = 0;
  for (let i = 0; i < n; i++) {
    const li = labels[i]!;
    let aSum = 0, aCnt = 0;
    const bSum: Record<number, { s: number; c: number }> = {};
    for (let j = 0; j < n; j++) {
      if (i === j) continue;
      const d = Math.hypot(...points[i]!.map((v, k) => v - points[j]![k]!));
      if (labels[j] === li) { aSum += d; aCnt++; }
      else { const k = labels[j]!; if (!bSum[k]) bSum[k] = { s: 0, c: 0 }; bSum[k]!.s += d; bSum[k]!.c++; }
    }
    const a = aCnt > 0 ? aSum / aCnt : 0;
    let b = Infinity;
    for (const k in bSum) b = Math.min(b, bSum[k]!.s / bSum[k]!.c);
    const s = aCnt > 0 && b !== Infinity ? (b - a) / Math.max(a, b) : 0;
    perSample[i] = s; total += s;
  }
  return { score: total / n, perSample };
}`,
  trace: metricTrace("import { silhouette } from './impl.ts';\nconst pts=[[0,0],[0.1,0.1],[5,5],[5.1,5.1]]; const labels=[0,0,1,1];",
    "Math.round(silhouette(pts,labels).score*1000)/1000", '聚类评分', 'cluster score'),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { silhouette } from '../../src/algorithms/ml/ml-kmeans-silhouette/impl.ts';
test('轮廓系数 完美聚类接近1', () => {
  assert.ok(silhouette([[0, 0], [0.1, 0.1], [5, 5], [5.1, 5.1]], [0, 0, 1, 1]).score > 0.7);
});
test('轮廓系数 单簇为0', () => {
  assert.ok(Math.abs(silhouette([[0, 0], [1, 1]], [0, 0]).score) < 1e-9);
});`,
});

// 3. ml-ridge-regression-closed
ALGS.push({
  id: 'ml-ridge-regression-closed',
  m: ['岭回归闭式解', 'Ridge Regression (Closed Form)', 'L2 正则化线性回归闭式解 w=(XᵀX+λI)⁻¹Xᵀy。', 'Closed-form ridge: w=(XᵀX+λI)⁻¹Xᵀy.',
    '加入 L2 罚项防止过拟合与共线性。', 'Adds L2 penalty to avoid overfitting/collinearity.', 'O(n³)', 'O(n²)', ['ml', 'regression', 'regularization']],
  impl: `// 岭回归闭式解 · 实现
export interface RidgeResult { w: number[]; b: number; }
function matMul(A: number[][], B: number[][]): number[][] {
  const m = A.length, n = B[0]!.length, p = B.length;
  const C = Array.from({ length: m }, () => new Array<number>(n).fill(0));
  for (let i = 0; i < m; i++) for (let k = 0; k < p; k++) for (let j = 0; j < n; j++) C[i]![j]! += A[i]![k]! * B[k]![j]!;
  return C;
}
function matVec(A: number[][], v: number[]): number[] { return A.map((r) => r.reduce((s, x, j) => s + x * v[j]!, 0)); }
function invert(M: number[][]): number[][] {
  const n = M.length;
  const A = M.map((r, i) => [...r, ...Array.from({ length: n }, (_, j) => (j === i ? 1 : 0))]);
  for (let i = 0; i < n; i++) {
    let p = i; for (let k = i + 1; k < n; k++) if (Math.abs(A[k]![i]!) > Math.abs(A[p]![i]!)) p = k;
    [A[i], A[p]!] = [A[p]!, A[i]!];
    const d = A[i]![i]! || 1;
    for (let j = 0; j < 2 * n; j++) A[i]![j]! /= d;
    for (let k = 0; k < n; k++) if (k !== i) { const f = A[k]![i]!; for (let j = 0; j < 2 * n; j++) A[k]![j]! -= f * A[i]![j]!; }
  }
  return A.map((r) => r.slice(n));
}
export function ridgeRegression(X: number[][], y: number[], lambda = 1): RidgeResult {
  const d = X[0]!.length;
  const Xb = X.map((r) => [1, ...r]);
  const Xt = Xb[0]!.map((_, j) => Xb.map((r) => r[j]!));
  const XtX = matMul(Xt, Xb);
  for (let i = 0; i <= d; i++) XtX[i]![i]! += lambda;
  const w = matVec(invert(XtX), matVec(Xt, y));
  return { w: w.slice(1), b: w[0]! };
}`,
  trace: metricTrace("import { ridgeRegression } from './impl.ts';\nconst X=[[1],[2],[3],[4]]; const y=[2,4,6,8];",
    "Math.round(ridgeRegression(X,y,0.001).w[0]!*100)/100", '拟合完成', 'fit done'),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ridgeRegression } from '../../src/algorithms/ml/ml-ridge-regression-closed/impl.ts';
test('岭回归 线性数据', () => {
  const r = ridgeRegression([[1], [2], [3], [4]], [2, 4, 6, 8], 0.001);
  assert.ok(Math.abs(r.w[0]! - 2) < 0.1);
});`,
});

// 4. ml-gini-index
ALGS.push({
  id: 'ml-gini-index',
  m: ['基尼指数', 'Gini Index', '衡量集合不纯度：1 - Σpᵢ²。', 'Impurity measure: 1 - Σpᵢ².',
    '基尼越小越纯，CART 决策树常用。', 'Smaller Gini = purer; used by CART.', 'O(k)', 'O(k)', ['ml', 'decision-tree', 'impurity']],
  impl: `// 基尼指数 · 实现
export function giniIndex(counts: number[]): number {
  const total = counts.reduce((a, b) => a + b, 0);
  if (total === 0) return 0;
  let s = 0; for (const c of counts) { const p = c / total; s += p * p; }
  return 1 - s;
}`,
  trace: metricTrace("import { giniIndex } from './impl.ts';", "giniIndex([5,5])", '不纯度', 'impurity'),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { giniIndex } from '../../src/algorithms/ml/ml-gini-index/impl.ts';
test('基尼 完全纯=0', () => { assert.equal(giniIndex([10, 0]), 0); });
test('基尼 均分=0.5', () => { assert.ok(Math.abs(giniIndex([5, 5]) - 0.5) < 1e-9); });`,
});

// 5. ml-entropy
ALGS.push({
  id: 'ml-entropy',
  m: ['信息熵', 'Information Entropy', '衡量分布不确定性：-Σpᵢ log₂ pᵢ。', 'Uncertainty measure: -Σpᵢ log₂ pᵢ.',
    '熵越大越混乱，ID3 决策树用它选择信息增益最大的特征。', 'Higher entropy = more uncertainty; ID3 uses it for information gain.', 'O(k)', 'O(k)', ['ml', 'decision-tree', 'impurity']],
  impl: `// 信息熵 · 实现
export function entropy(counts: number[]): number {
  const total = counts.reduce((a, b) => a + b, 0);
  if (total === 0) return 0;
  let h = 0; for (const c of counts) { if (c > 0) { const p = c / total; h -= p * Math.log2(p); } }
  return h;
}`,
  trace: metricTrace("import { entropy } from './impl.ts';", "entropy([5,5])", '不确定性', 'uncertainty'),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { entropy } from '../../src/algorithms/ml/ml-entropy/impl.ts';
test('熵 完全纯=0', () => { assert.equal(entropy([10, 0]), 0); });
test('熵 均分二类=1', () => { assert.ok(Math.abs(entropy([5, 5]) - 1) < 1e-9); });`,
});

// 6. ml-information-gain
ALGS.push({
  id: 'ml-information-gain',
  m: ['信息增益', 'Information Gain', '分裂前后熵的减少量：ID3 选最大增益特征。', 'Entropy reduction after split; ID3 picks the max-gain feature.',
    '信息增益 = 熵(父) - 加权和·熵(子)。', 'Gain = entropy(parent) - weighted sum of child entropies.', 'O(n)', 'O(1)', ['ml', 'decision-tree']],
  impl: `// 信息增益 · 实现
function entropy(counts: number[]): number {
  const total = counts.reduce((a, b) => a + b, 0);
  if (total === 0) return 0;
  let h = 0; for (const c of counts) { if (c > 0) { const p = c / total; h -= p * Math.log2(p); } }
  return h;
}
export function informationGain(parentLabels: number[], splits: number[][]): number {
  const n = parentLabels.length;
  if (n === 0) return 0;
  const classCount = (arr: number[]): number[] => {
    const m: Record<number, number> = {}; for (const v of arr) m[v] = (m[v] ?? 0) + 1; return Object.values(m);
  };
  const hParent = entropy(classCount(parentLabels));
  let weighted = 0;
  for (const sp of splits) weighted += (sp.length / n) * entropy(classCount(sp));
  return hParent - weighted;
}`,
  trace: metricTrace("import { informationGain } from './impl.ts';", "Math.round(informationGain([0,0,1,1],[[0,0],[1,1]])*100)/100", '增益', 'gain'),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { informationGain } from '../../src/algorithms/ml/ml-information-gain/impl.ts';
test('信息增益 完美分裂=1', () => { assert.ok(Math.abs(informationGain([0, 0, 1, 1], [[0, 0], [1, 1]]) - 1) < 1e-9); });
test('信息增益 无分裂=0', () => { assert.ok(Math.abs(informationGain([0, 0, 1, 1], [[0, 0, 1, 1]]) - 0) < 1e-9); });`,
});

// 7. ml-softmax-num-stable
ALGS.push({
  id: 'ml-softmax-num-stable',
  m: ['数值稳定 softmax', 'Numerically Stable Softmax', '减去最大值后再指数化，避免溢出。', 'Subtract max before exponentiating to avoid overflow.',
    'softmax(z)ᵢ = exp(zᵢ-max)/Σexp(zⱼ-max)。', 'softmax(z)ᵢ = exp(zᵢ-max)/Σexp(zⱼ-max).', 'O(k)', 'O(k)', ['ml', 'activation']],
  impl: `// 数值稳定 softmax · 实现
export function softmaxStable(logits: number[]): number[] {
  if (logits.length === 0) return [];
  const m = Math.max(...logits);
  const exps = logits.map((z) => Math.exp(z - m));
  const s = exps.reduce((a, b) => a + b, 0);
  return exps.map((e) => e / s);
}`,
  trace: metricTrace("import { softmaxStable } from './impl.ts';", "Math.round(softmaxStable([1000,1000,1000])[0]!*1000)/1000", '概率', 'probability'),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { softmaxStable } from '../../src/algorithms/ml/ml-softmax-num-stable/impl.ts';
test('softmax 和为1', () => { assert.ok(Math.abs(softmaxStable([1, 2, 3]).reduce((a, b) => a + b, 0) - 1) < 1e-9); });
test('softmax 大值不溢出', () => { assert.ok(softmaxStable([1000, 1000, 1000]).every((v) => v > 0 && v < 2)); });
test('softmax 空数组', () => { assert.deepEqual(softmaxStable([]), []); });`,
});

// 8. ml-cross-entropy
ALGS.push({
  id: 'ml-cross-entropy',
  m: ['交叉熵损失', 'Cross-Entropy Loss', '分类损失：-Σ yᵢ log(pᵢ)。', 'Classification loss: -Σ yᵢ log(pᵢ).',
    '真实分布 y 与预测分布 p 的交叉熵。', 'Cross entropy between true y and predicted p.', 'O(k)', 'O(1)', ['ml', 'loss']],
  impl: `// 交叉熵损失 · 实现
export function crossEntropy(yTrue: number[], yPred: number[], eps = 1e-12): number {
  if (yTrue.length !== yPred.length) throw new RangeError('长度不匹配');
  let loss = 0;
  for (let i = 0; i < yTrue.length; i++) if (yTrue[i]! > 0) loss -= yTrue[i]! * Math.log(Math.max(eps, yPred[i]!));
  return loss;
}`,
  trace: metricTrace("import { crossEntropy } from './impl.ts';", "Math.round(crossEntropy([1,0],[0.9,0.1])*1000)/1000", '损失', 'loss'),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { crossEntropy } from '../../src/algorithms/ml/ml-cross-entropy/impl.ts';
test('交叉熵 完美预测≈0', () => { assert.ok(crossEntropy([1, 0], [1, 0]) < 1e-6); });
test('交叉熵 长度不匹配', () => { assert.throws(() => crossEntropy([1], [1, 0]), RangeError); });`,
});

// 9. ml-mse-loss
ALGS.push({
  id: 'ml-mse-loss',
  m: ['均方误差', 'Mean Squared Error', '回归损失：Σ(y-ŷ)²/n。', 'Regression loss: Σ(y-ŷ)²/n.',
    'MSE 对大误差敏感，常用作回归目标函数。', 'MSE penalizes large errors; standard regression objective.', 'O(n)', 'O(1)', ['ml', 'loss', 'regression']],
  impl: `// 均方误差 · 实现
export function mse(yTrue: number[], yPred: number[]): number {
  if (yTrue.length !== yPred.length) throw new RangeError('长度不匹配');
  if (yTrue.length === 0) return 0;
  let s = 0; for (let i = 0; i < yTrue.length; i++) s += (yTrue[i]! - yPred[i]!) ** 2;
  return s / yTrue.length;
}`,
  trace: metricTrace("import { mse } from './impl.ts';", "mse([1,2,3],[1,2,3])", '误差', 'error'),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mse } from '../../src/algorithms/ml/ml-mse-loss/impl.ts';
test('MSE 完美=0', () => { assert.equal(mse([1, 2, 3], [1, 2, 3]), 0); });
test('MSE 计算', () => { assert.equal(mse([1, 2], [2, 3]), 1); });`,
});

// 10. ml-r2-score
ALGS.push({
  id: 'ml-r2-score',
  m: ['决定系数 R²', 'R-squared Score', '回归拟合优度：1 - SS_res/SS_tot。', 'Goodness of fit: 1 - SS_res/SS_tot.',
    'R²=1 完美，=0 等于均值，<0 比均值差。', 'R²=1 perfect, =0 equals mean, <0 worse than mean.', 'O(n)', 'O(1)', ['ml', 'evaluation', 'regression']],
  impl: `// 决定系数 R² · 实现
export function r2Score(yTrue: number[], yPred: number[]): number {
  if (yTrue.length !== yPred.length) throw new RangeError('长度不匹配');
  const n = yTrue.length; if (n === 0) return 0;
  const mean = yTrue.reduce((a, b) => a + b, 0) / n;
  let ssRes = 0, ssTot = 0;
  for (let i = 0; i < n; i++) { ssRes += (yTrue[i]! - yPred[i]!) ** 2; ssTot += (yTrue[i]! - mean) ** 2; }
  if (ssTot === 0) return ssRes === 0 ? 1 : 0;
  return 1 - ssRes / ssTot;
}`,
  trace: metricTrace("import { r2Score } from './impl.ts';", "r2Score([1,2,3],[1,2,3])", '拟合优度', 'goodness'),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { r2Score } from '../../src/algorithms/ml/ml-r2-score/impl.ts';
test('R² 完美=1', () => { assert.equal(r2Score([1, 2, 3], [1, 2, 3]), 1); });`,
});

// 11. ml-accuracy-score
ALGS.push({
  id: 'ml-accuracy-score',
  m: ['准确率', 'Accuracy Score', '分类正确预测比例。', 'Fraction of correctly classified samples.',
    'accuracy = 正确数 / 总数。', 'accuracy = #correct / #total.', 'O(n)', 'O(1)', ['ml', 'evaluation', 'classification']],
  impl: `// 准确率 · 实现
export function accuracy(yTrue: number[], yPred: number[]): number {
  if (yTrue.length !== yPred.length) throw new RangeError('长度不匹配');
  if (yTrue.length === 0) return 0;
  let correct = 0;
  for (let i = 0; i < yTrue.length; i++) if (yTrue[i] === yPred[i]) correct++;
  return correct / yTrue.length;
}`,
  trace: metricTrace("import { accuracy } from './impl.ts';", "accuracy([0,1,1,0],[0,1,0,0])", '准确率', 'accuracy'),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { accuracy } from '../../src/algorithms/ml/ml-accuracy-score/impl.ts';
test('准确率 全对=1', () => { assert.equal(accuracy([0, 1], [0, 1]), 1); });
test('准确率 半对=0.5', () => { assert.equal(accuracy([0, 1], [1, 1]), 0.5); });`,
});

// 12. ml-precision-recall
ALGS.push({
  id: 'ml-precision-recall',
  m: ['精确率与召回率', 'Precision and Recall', '二分类的精确率与召回率。', 'Precision and recall for binary classification.',
    'Precision=TP/(TP+FP)，Recall=TP/(TP+FN)。', 'Precision=TP/(TP+FP), Recall=TP/(TP+FN).', 'O(n)', 'O(1)', ['ml', 'evaluation']],
  impl: `// 精确率与召回率 · 实现
export interface PR { precision: number; recall: number; f1: number; }
export function precisionRecall(yTrue: number[], yPred: number[], positive = 1): PR {
  let tp = 0, fp = 0, fn = 0;
  for (let i = 0; i < yTrue.length; i++) {
    if (yPred[i] === positive && yTrue[i] === positive) tp++;
    else if (yPred[i] === positive && yTrue[i] !== positive) fp++;
    else if (yPred[i] !== positive && yTrue[i] === positive) fn++;
  }
  const precision = tp + fp > 0 ? tp / (tp + fp) : 0;
  const recall = tp + fn > 0 ? tp / (tp + fn) : 0;
  const f1 = precision + recall > 0 ? (2 * precision * recall) / (precision + recall) : 0;
  return { precision, recall, f1 };
}`,
  trace: metricTrace("import { precisionRecall } from './impl.ts';", "precisionRecall([1,1,0,0],[1,0,0,0]).precision", '指标', 'metrics'),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { precisionRecall } from '../../src/algorithms/ml/ml-precision-recall/impl.ts';
test('PR 计算', () => {
  const r = precisionRecall([1, 1, 0, 0], [1, 0, 0, 0]);
  assert.equal(r.precision, 1);
  assert.equal(r.recall, 0.5);
});`,
});

// 13. ml-confusion-matrix
ALGS.push({
  id: 'ml-confusion-matrix',
  m: ['混淆矩阵', 'Confusion Matrix', '统计预测 vs 真实标签的方阵。', 'Square matrix of predicted vs true labels.',
    'C[i][j] = 真实 i 被预测为 j 的样本数。', 'C[i][j] = count of true i predicted as j.', 'O(n)', 'O(k^2)', ['ml', 'evaluation']],
  impl: `// 混淆矩阵 · 实现
export function confusionMatrix(yTrue: number[], yPred: number[], k: number): number[][] {
  const m = Array.from({ length: k }, () => new Array<number>(k).fill(0));
  for (let i = 0; i < yTrue.length; i++) if (yTrue[i]! >= 0 && yTrue[i]! < k && yPred[i]! >= 0 && yPred[i]! < k) m[yTrue[i]!]![yPred[i]!]!++;
  return m;
}`,
  trace: metricTrace("import { confusionMatrix } from './impl.ts';", "confusionMatrix([0,1,1],[0,1,0],2)[0]![0]!", '统计完成', 'done'),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { confusionMatrix } from '../../src/algorithms/ml/ml-confusion-matrix/impl.ts';
test('混淆矩阵', () => {
  assert.deepEqual(confusionMatrix([0, 1, 1, 0], [0, 1, 0, 0], 2), [[2, 0], [1, 1]]);
});`,
});

// 14. ml-sigmoid-activation
ALGS.push({
  id: 'ml-sigmoid-activation',
  m: ['Sigmoid 激活', 'Sigmoid Activation', '将任意实数压缩到 (0,1)。', 'Squash any real to (0,1).',
    'σ(x)=1/(1+e⁻ˣ)，二分类输出层常用。', 'σ(x)=1/(1+e⁻ˣ); common in binary output layers.', 'O(1)', 'O(1)', ['ml', 'activation']],
  impl: `// Sigmoid 激活 · 实现
export function sigmoid(x: number): number {
  if (x >= 0) { const e = Math.exp(-x); return 1 / (1 + e); }
  const e = Math.exp(x); return e / (1 + e);
}`,
  trace: metricTrace("import { sigmoid } from './impl.ts';", "sigmoid(0)", '激活值', 'activation'),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sigmoid } from '../../src/algorithms/ml/ml-sigmoid-activation/impl.ts';
test('sigmoid(0)=0.5', () => { assert.ok(Math.abs(sigmoid(0) - 0.5) < 1e-9); });
test('sigmoid 大正数≈1', () => { assert.ok(sigmoid(100) > 0.99); });`,
});

// 15. ml-relu-activation
ALGS.push({
  id: 'ml-relu-activation',
  m: ['ReLU 激活', 'ReLU Activation', '修正线性单元 max(0, x)。', 'Rectified Linear Unit max(0, x).',
    'ReLU(x)=max(0,x)，深度网络隐藏层主力。', 'ReLU(x)=max(0,x); dominant in deep nets.', 'O(1)', 'O(1)', ['ml', 'activation']],
  impl: `// ReLU 激活 · 实现
export function relu(x: number): number { return x > 0 ? x : 0; }
export function reluArray(xs: number[]): number[] { return xs.map(relu); }`,
  trace: metricTrace("import { relu } from './impl.ts';", "relu(-5)", '激活值', 'activation'),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { relu, reluArray } from '../../src/algorithms/ml/ml-relu-activation/impl.ts';
test('ReLU 负数为0', () => { assert.equal(relu(-5), 0); });
test('ReLU 数组', () => { assert.deepEqual(reluArray([-1, 0, 2]), [0, 0, 2]); });`,
});

// 16. ml-tanh-activation
ALGS.push({
  id: 'ml-tanh-activation',
  m: ['Tanh 激活', 'Tanh Activation', '双曲正切，输出 (-1,1)。', 'Hyperbolic tangent, output in (-1,1).',
    'tanh(x)=(eˣ-e⁻ˣ)/(eˣ+e⁻ˣ)，零中心化，RNN 常用。', 'tanh(x)=(eˣ-e⁻ˣ)/(eˣ+e⁻ˣ); common in RNNs.', 'O(1)', 'O(1)', ['ml', 'activation']],
  impl: `// Tanh 激活 · 实现
export function tanh(x: number): number { return Math.tanh(x); }`,
  trace: metricTrace("import { tanh } from './impl.ts';", "Math.round(tanh(0)*1000)/1000", '激活值', 'activation'),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { tanh } from '../../src/algorithms/ml/ml-tanh-activation/impl.ts';
test('tanh(0)=0', () => { assert.ok(Math.abs(tanh(0)) < 1e-9); });`,
});

// 17. ml-leaky-relu
ALGS.push({
  id: 'ml-leaky-relu',
  m: ['Leaky ReLU', 'Leaky ReLU Activation', '负半轴带微小斜率的 ReLU。', 'ReLU with small slope on the negative side.',
    'LeakyReLU(x)=x>0?x:αx，缓解神经元死亡。', 'LeakyReLU(x)=x>0?x:αx (α≈0.01); mitigates dead neurons.', 'O(1)', 'O(1)', ['ml', 'activation']],
  impl: `// Leaky ReLU · 实现
export function leakyRelu(x: number, alpha = 0.01): number { return x > 0 ? x : alpha * x; }`,
  trace: metricTrace("import { leakyRelu } from './impl.ts';", "leakyRelu(-5)", '激活值', 'activation'),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { leakyRelu } from '../../src/algorithms/ml/ml-leaky-relu/impl.ts';
test('LeakyReLU 正数不变', () => { assert.equal(leakyRelu(3), 3); });
test('LeakyReLU 负数缩放', () => { assert.ok(Math.abs(leakyRelu(-4, 0.01) - (-0.04)) < 1e-9); });`,
});

// 18. ml-one-hot-encode
ALGS.push({
  id: 'ml-one-hot-encode',
  m: ['独热编码', 'One-Hot Encoding', '把类别标签转为独热向量。', 'Convert categorical labels to one-hot vectors.',
    '对 k 类，标签 i → 长度 k、第 i 位为 1 其余为 0。', 'For k classes, label i → length-k vector with 1 at position i.', 'O(n)', 'O(nk)', ['ml', 'preprocessing']],
  impl: `// 独热编码 · 实现
export function oneHot(labels: number[], k: number): number[][] {
  return labels.map((l) => { const v = new Array<number>(k).fill(0); if (l >= 0 && l < k) v[l] = 1; return v; });
}`,
  trace: metricTrace("import { oneHot } from './impl.ts';", "oneHot([0,2],3).length", '编码完成', 'encoded'),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { oneHot } from '../../src/algorithms/ml/ml-one-hot-encode/impl.ts';
test('独热编码', () => { assert.deepEqual(oneHot([0, 2], 3), [[1, 0, 0], [0, 0, 1]]); });`,
});

// 19. ml-min-max-scale
ALGS.push({
  id: 'ml-min-max-scale',
  m: ['Min-Max 归一化', 'Min-Max Scaling', '把特征缩放到 [0,1]。', 'Scale features to [0,1].',
    'x′=(x-min)/(max-min)。', 'x′=(x-min)/(max-min).', 'O(n)', 'O(1)', ['ml', 'preprocessing']],
  impl: `// Min-Max 归一化 · 实现
export function minMaxScale(values: number[], lo = 0, hi = 1): number[] {
  const mn = Math.min(...values), mx = Math.max(...values);
  if (mn === mx) return values.map(() => (lo + hi) / 2);
  return values.map((v) => lo + ((v - mn) / (mx - mn)) * (hi - lo));
}`,
  trace: metricTrace("import { minMaxScale } from './impl.ts';", "Math.round(minMaxScale([0,5,10])[0]!*1000)/1000", '缩放完成', 'scaled'),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { minMaxScale } from '../../src/algorithms/ml/ml-min-max-scale/impl.ts';
test('Min-Max [0,10]→[0,1]', () => { assert.deepEqual(minMaxScale([0, 5, 10]), [0, 0.5, 1]); });`,
});

// 20. ml-z-score-scale
ALGS.push({
  id: 'ml-z-score-scale',
  m: ['Z-Score 标准化', 'Z-Score Standardization', '把特征化为均值 0、方差 1。', 'Standardize features to mean 0, variance 1.',
    'z=(x-μ)/σ。', 'z=(x-μ)/σ.', 'O(n)', 'O(1)', ['ml', 'preprocessing']],
  impl: `// Z-Score 标准化 · 实现
export function zScoreScale(values: number[]): number[] {
  const n = values.length; if (n === 0) return [];
  const mean = values.reduce((a, b) => a + b, 0) / n;
  const variance = values.reduce((s, v) => s + (v - mean) ** 2, 0) / n;
  const sd = Math.sqrt(variance);
  if (sd === 0) return values.map(() => 0);
  return values.map((v) => (v - mean) / sd);
}`,
  trace: metricTrace("import { zScoreScale } from './impl.ts';", "zScoreScale([1,2,3,4]).length", '标准化完成', 'standardized'),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { zScoreScale } from '../../src/algorithms/ml/ml-z-score-scale/impl.ts';
test('Z-Score 均值≈0', () => {
  assert.ok(Math.abs(zScoreScale([1, 2, 3, 4]).reduce((a, b) => a + b, 0)) < 1e-9);
});`,
});

// 21. ml-euclidean-dist-matrix
ALGS.push({
  id: 'ml-euclidean-dist-matrix',
  m: ['欧氏距离矩阵', 'Euclidean Distance Matrix', '计算样本两两欧氏距离。', 'Pairwise Euclidean distances between samples.',
    'D[i][j] = ||xᵢ - xⱼ||₂。', 'D[i][j] = ||xᵢ - xⱼ||₂.', 'O(n^2 d)', 'O(n^2)', ['ml', 'distance']],
  impl: `// 欧氏距离矩阵 · 实现
export function distanceMatrix(X: number[][]): number[][] {
  const n = X.length;
  const D = Array.from({ length: n }, () => new Array<number>(n).fill(0));
  for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) {
    const d = Math.hypot(...X[i]!.map((v, k) => v - X[j]![k]!));
    D[i]![j]! = d; D[j]![i]! = d;
  }
  return D;
}`,
  trace: metricTrace("import { distanceMatrix } from './impl.ts';", "distanceMatrix([[0,0],[3,4]])[0]![1]!", '计算完成', 'done'),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { distanceMatrix } from '../../src/algorithms/ml/ml-euclidean-dist-matrix/impl.ts';
test('距离矩阵', () => {
  const D = distanceMatrix([[0, 0], [3, 4]]);
  assert.equal(D[0]![1]!, 5);
  assert.equal(D[1]![0]!, 5);
});`,
});

// 22. ml-cosine-sim
ALGS.push({
  id: 'ml-cosine-sim',
  m: ['余弦相似度', 'Cosine Similarity', '用夹角余弦衡量向量方向相似性。', 'Cosine of angle between vectors measures directional similarity.',
    'cos(a,b)=(a·b)/(|a||b|) ∈ [-1,1]。', 'cos(a,b)=(a·b)/(|a||b|), in [-1,1].', 'O(d)', 'O(1)', ['ml', 'distance']],
  impl: `// 余弦相似度 · 实现
export function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0, na = 0, nb = 0;
  for (let i = 0; i < a.length; i++) { dot += a[i]! * b[i]!; na += a[i]! ** 2; nb += b[i]! ** 2; }
  if (na === 0 || nb === 0) return 0;
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}`,
  trace: metricTrace("import { cosineSimilarity } from './impl.ts';", "Math.round(cosineSimilarity([1,0],[0,1])*1000)/1000", '相似度', 'similarity'),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cosineSimilarity } from '../../src/algorithms/ml/ml-cosine-sim/impl.ts';
test('余弦 相同方向=1', () => { assert.ok(Math.abs(cosineSimilarity([1, 2], [2, 4]) - 1) < 1e-9); });
test('余弦 垂直=0', () => { assert.ok(Math.abs(cosineSimilarity([1, 0], [0, 1])) < 1e-9); });`,
});

// 23. ml-gradient-descent-linear
ALGS.push({
  id: 'ml-gradient-descent-linear',
  m: ['线性回归梯度下降', 'Linear Regression via Gradient Descent', '用批量梯度下降拟合线性回归。', 'Fit linear regression by batch gradient descent.',
    '迭代 w ← w - η·∇L，L 为 MSE 损失。', 'Iterate w ← w - η·∇L with MSE loss.', 'O(epochs*n*d)', 'O(d)', ['ml', 'regression', 'optimization']],
  impl: `// 线性回归梯度下降 · 实现
export interface GDResult { w: number[]; b: number; history: number[]; }
export interface GDHooks { onEpoch?: (e: number, loss: number) => void; }
export function gradientDescentLinear(X: number[][], y: number[], lr = 0.01, epochs = 100, hooks: GDHooks = {}): GDResult {
  const n = X.length, d = X[0]?.length ?? 0;
  const w = new Array<number>(d).fill(0); let b = 0;
  const history: number[] = [];
  for (let e = 0; e < epochs; e++) {
    const gw = new Array<number>(d).fill(0); let gb = 0, loss = 0;
    for (let i = 0; i < n; i++) {
      let pred = b; for (let k = 0; k < d; k++) pred += w[k]! * X[i]![k]!;
      const err = pred - y[i]!; loss += err * err;
      for (let k = 0; k < d; k++) gw[k]! += err * X[i]![k]!; gb += err;
    }
    for (let k = 0; k < d; k++) w[k]! -= (lr * gw[k]!) / n;
    b -= (lr * gb) / n; loss /= n; history.push(loss);
    hooks.onEpoch?.(e + 1, loss);
  }
  return { w, b, history };
}`,
  trace: `// 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { gradientDescentLinear } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '梯度下降', en: 'gradient descent' }).commit();
  const X = [[1], [2], [3], [4]], y = [2, 4, 6, 8];
  const r = gradientDescentLinear(X, y, 0.1, 50, {
    onEpoch: (e, loss) => rec.begin({ zh: '第 ' + e + ' 轮 loss ' + loss.toFixed(4), en: 'epoch ' + e + ' loss ' + loss.toFixed(4) }).setAux([{ label: 'loss', value: loss.toFixed(4), role: 'compare' as BarRole }]).commit(),
  });
  rec.begin({ zh: '完成', en: 'done' }).setAux([{ label: 'w', value: r.w[0]!.toFixed(3), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { gradientDescentLinear } from '../../src/algorithms/ml/ml-gradient-descent-linear/impl.ts';
test('GD 拟合 y=2x', () => {
  const r = gradientDescentLinear([[1], [2], [3], [4]], [2, 4, 6, 8], 0.1, 500);
  assert.ok(Math.abs(r.w[0]! - 2) < 0.2);
});
test('GD loss 递减', () => {
  const r = gradientDescentLinear([[0], [1]], [0, 1], 0.1, 50);
  assert.ok(r.history[r.history.length - 1]! <= r.history[0]!);
});`,
});

// 24. ml-kmeans-init-pp
ALGS.push({
  id: 'ml-kmeans-init-pp',
  m: ['K-Means++ 初始化', 'K-Means++ Initialization', '按距离平方概率选取初始中心。', 'Pick initial centers with D² probability weighting.',
    '第一个中心随机，后续按 D(x)²/ΣD² 概率选取。', 'First center random; later centers picked with probability D(x)²/ΣD².', 'O(nkd)', 'O(kd)', ['ml', 'clustering']],
  impl: `// K-Means++ 初始化 · 实现
export function kmeansPlusPlusInit(points: number[][], k: number, seed = 1): number[][] {
  const n = points.length;
  if (n === 0 || k <= 0) return [];
  let s = seed >>> 0;
  const rand = (): number => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
  const centers: number[][] = [points[Math.floor(rand() * n)]!.slice()];
  while (centers.length < k && centers.length < n) {
    const dists = points.map((p) => Math.min(...centers.map((c) => c.reduce((s, _, i) => s + (c[i]! - p[i]!) ** 2, 0))));
    const total = dists.reduce((a, b) => a + b, 0);
    if (total === 0) { centers.push(points[centers.length]!.slice()); continue; }
    let r = rand() * total, acc = 0;
    for (let i = 0; i < n; i++) { acc += dists[i]!; if (acc >= r) { centers.push(points[i]!.slice()); break; } }
  }
  return centers;
}`,
  trace: metricTrace("import { kmeansPlusPlusInit } from './impl.ts';", "kmeansPlusPlusInit([[0,0],[1,1],[5,5]],2).length", '初始化完成', 'initialized'),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { kmeansPlusPlusInit } from '../../src/algorithms/ml/ml-kmeans-init-pp/impl.ts';
test('K-Means++ 选 k 个中心', () => {
  assert.equal(kmeansPlusPlusInit([[0, 0], [1, 1], [5, 5], [6, 6]], 2, 42).length, 2);
});
test('K-Means++ 可复现', () => {
  assert.deepEqual(kmeansPlusPlusInit([[0], [1], [2]], 2, 7), kmeansPlusPlusInit([[0], [1], [2]], 2, 7));
});`,
});

// 25. ml-hinge-loss
ALGS.push({
  id: 'ml-hinge-loss',
  m: ['合页损失', 'Hinge Loss', 'SVM 的合页损失 max(0, 1 - y·ŷ)。', 'SVM hinge loss max(0, 1 - y·ŷ).',
    '当 y·ŷ ≥ 1 时损失为 0，否则 1 - y·ŷ。', 'Zero when y·ŷ ≥ 1, else 1 - y·ŷ.', 'O(1)', 'O(1)', ['ml', 'loss', 'svm']],
  impl: `// 合页损失 · 实现
export function hingeLoss(yTrue: number, yPredScore: number): number { return Math.max(0, 1 - yTrue * yPredScore); }
export function avgHingeLoss(yTrue: number[], scores: number[]): number {
  if (yTrue.length === 0) return 0;
  let s = 0; for (let i = 0; i < yTrue.length; i++) s += hingeLoss(yTrue[i]!, scores[i]!);
  return s / yTrue.length;
}`,
  trace: metricTrace("import { hingeLoss } from './impl.ts';", "hingeLoss(1,0.5)", '损失', 'loss'),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { hingeLoss } from '../../src/algorithms/ml/ml-hinge-loss/impl.ts';
test('hinge 满足间隔=0', () => { assert.equal(hingeLoss(1, 2), 0); });
test('hinge 不满足=0.5', () => { assert.equal(hingeLoss(1, 0.5), 0.5); });`,
});

// 26. ml-l2-regularize
ALGS.push({
  id: 'ml-l2-regularize',
  m: ['L2 正则化项', 'L2 Regularization Term', '权重 L2 范数平方的一半。', 'Half the squared L2 norm of weights.',
    'R(w)=½||w||²，加入损失项以约束权重大小。', 'R(w)=½||w||² added to loss to shrink weights.', 'O(d)', 'O(1)', ['ml', 'regularization']],
  impl: `// L2 正则化项 · 实现
export function l2Regularization(w: number[], lambda = 1): number {
  let s = 0; for (const v of w) s += v * v;
  return 0.5 * lambda * s;
}`,
  trace: metricTrace("import { l2Regularization } from './impl.ts';", "l2Regularization([3,4])", '罚项', 'penalty'),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { l2Regularization } from '../../src/algorithms/ml/ml-l2-regularize/impl.ts';
test('L2 (3,4) λ=1 = 12.5', () => { assert.equal(l2Regularization([3, 4], 1), 12.5); });`,
});

// 27. ml-l1-regularize
ALGS.push({
  id: 'ml-l1-regularize',
  m: ['L1 正则化项', 'L1 Regularization Term', '权重绝对值之和，促稀疏。', 'Sum of absolute weights; promotes sparsity.',
    'R(w)=λΣ|wᵢ|，实现特征选择。', 'R(w)=λΣ|wᵢ| drives weights to zero for feature selection.', 'O(d)', 'O(1)', ['ml', 'regularization']],
  impl: `// L1 正则化项 · 实现
export function l1Regularization(w: number[], lambda = 1): number {
  let s = 0; for (const v of w) s += Math.abs(v);
  return lambda * s;
}`,
  trace: metricTrace("import { l1Regularization } from './impl.ts';", "l1Regularization([3,-4])", '罚项', 'penalty'),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { l1Regularization } from '../../src/algorithms/ml/ml-l1-regularize/impl.ts';
test('L1 (3,-4) λ=1 = 7', () => { assert.equal(l1Regularization([3, -4], 1), 7); });`,
});

// 28. ml-mean-vector
ALGS.push({
  id: 'ml-mean-vector',
  m: ['均值向量', 'Mean Vector', '计算样本矩阵每列均值。', 'Per-column mean of a sample matrix.',
    'μⱼ=(1/n)Σxᵢⱼ。', 'μⱼ=(1/n)Σxᵢⱼ.', 'O(nd)', 'O(d)', ['ml', 'statistics']],
  impl: `// 均值向量 · 实现
export function meanVector(X: number[][]): number[] {
  const n = X.length; if (n === 0) return [];
  const d = X[0]!.length; const m = new Array<number>(d).fill(0);
  for (let i = 0; i < n; i++) for (let j = 0; j < d; j++) m[j]! += X[i]![j]!;
  for (let j = 0; j < d; j++) m[j]! /= n;
  return m;
}`,
  trace: metricTrace("import { meanVector } from './impl.ts';", "meanVector([[1,2],[3,4]])[0]", '均值', 'mean'),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { meanVector } from '../../src/algorithms/ml/ml-mean-vector/impl.ts';
test('均值向量', () => { assert.deepEqual(meanVector([[1, 2], [3, 4]]), [2, 3]); });
test('空矩阵', () => { assert.deepEqual(meanVector([]), []); });`,
});

// 29. ml-covariance-matrix
ALGS.push({
  id: 'ml-covariance-matrix',
  m: ['协方差矩阵', 'Covariance Matrix', '计算样本协方差矩阵。', 'Compute the sample covariance matrix.',
    'Σ=(1/(n-1))Σ(xᵢ-μ)(xᵢ-μ)ᵀ。', 'Σ=(1/(n-1))Σ(xᵢ-μ)(xᵢ-μ)ᵀ.', 'O(nd^2)', 'O(d^2)', ['ml', 'statistics']],
  impl: `// 协方差矩阵 · 实现
export function covarianceMatrix(X: number[][]): number[][] {
  const n = X.length; if (n < 2) throw new RangeError('需至少 2 个样本');
  const d = X[0]!.length;
  const mean = new Array<number>(d).fill(0);
  for (let i = 0; i < n; i++) for (let j = 0; j < d; j++) mean[j]! += X[i]![j]!;
  for (let j = 0; j < d; j++) mean[j]! /= n;
  const cov = Array.from({ length: d }, () => new Array<number>(d).fill(0));
  for (let i = 0; i < n; i++) for (let a = 0; a < d; a++) for (let b = 0; b < d; b++) cov[a]![b]! += (X[i]![a]! - mean[a]!) * (X[i]![b]! - mean[b]!);
  for (let a = 0; a < d; a++) for (let b = 0; b < d; b++) cov[a]![b]! /= n - 1;
  return cov;
}`,
  trace: metricTrace("import { covarianceMatrix } from './impl.ts';", "Math.round(covarianceMatrix([[1,2],[3,4],[5,6]])[0]![0]!*100)/100", '协方差', 'covariance'),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { covarianceMatrix } from '../../src/algorithms/ml/ml-covariance-matrix/impl.ts';
test('协方差对称', () => {
  const c = covarianceMatrix([[1, 2], [3, 4], [5, 6]]);
  assert.equal(c[0]![1]!, c[1]![0]!);
});`,
});

// 30. ml-train-test-split
ALGS.push({
  id: 'ml-train-test-split',
  m: ['训练/测试集划分', 'Train-Test Split', '随机划分数据为训练集与测试集。', 'Randomly split data into train and test sets.',
    '按 testRatio 打乱后切分，可复现（seed）。', 'Shuffle by seed then split by testRatio.', 'O(n)', 'O(n)', ['ml', 'preprocessing']],
  impl: `// 训练/测试集划分 · 实现
export function trainTestSplit<T>(data: T[], testRatio = 0.2, seed = 1): { train: T[]; test: T[] } {
  let s = seed >>> 0;
  const rand = (): number => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
  const arr = data.slice();
  for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [arr[i], arr[j]] = [arr[j]!, arr[i]!]; }
  const cut = Math.floor(arr.length * testRatio);
  return { test: arr.slice(0, cut), train: arr.slice(cut) };
}`,
  trace: metricTrace("import { trainTestSplit } from './impl.ts';", "trainTestSplit([1,2,3,4,5],0.4,1).train.length", '划分完成', 'split done'),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { trainTestSplit } from '../../src/algorithms/ml/ml-train-test-split/impl.ts';
test('划分 总数守恒', () => {
  const { train, test } = trainTestSplit([1, 2, 3, 4, 5], 0.4, 1);
  assert.equal(train.length + test.length, 5);
});
test('划分 可复现', () => { assert.deepEqual(trainTestSplit([1, 2, 3], 0.3, 9), trainTestSplit([1, 2, 3], 0.3, 9)); });`,
});

// 31. ml-dot-product
ALGS.push({
  id: 'ml-dot-product',
  m: ['向量点积', 'Dot Product', '两向量点积 Σ aᵢbᵢ。', 'Dot product Σ aᵢbᵢ.',
    '点积是度量、投影、神经网络的基础运算。', 'Foundation of metrics, projections, dense layers.', 'O(d)', 'O(1)', ['ml', 'linear-algebra']],
  impl: `// 向量点积 · 实现
export function dot(a: number[], b: number[]): number {
  if (a.length !== b.length) throw new RangeError('长度不匹配');
  let s = 0; for (let i = 0; i < a.length; i++) s += a[i]! * b[i]!;
  return s;
}`,
  trace: metricTrace("import { dot } from './impl.ts';", "dot([1,2,3],[4,5,6])", '结果', 'result'),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { dot } from '../../src/algorithms/ml/ml-dot-product/impl.ts';
test('点积', () => { assert.equal(dot([1, 2, 3], [4, 5, 6]), 32); });
test('点积 长度不匹配', () => { assert.throws(() => dot([1], [1, 2]), RangeError); });`,
});

// 32. ml-kfold-cv
ALGS.push({
  id: 'ml-kfold-cv',
  m: ['K 折交叉验证索引', 'K-Fold CV Indices', '生成 K 折交叉验证的训练/测试索引。', 'Generate train/test index splits for K-fold CV.',
    '把 n 个样本分成 K 折，每次取一折为测试。', 'Split n samples into K folds; each fold serves as test once.', 'O(n)', 'O(n)', ['ml', 'evaluation']],
  impl: `// K 折交叉验证索引 · 实现
export interface Fold { trainIdx: number[]; testIdx: number[]; }
export function kFoldIndices(n: number, k: number): Fold[] {
  if (k <= 0 || n <= 0) throw new RangeError('n,k 必须为正');
  const idx = Array.from({ length: n }, (_, i) => i);
  const folds: Fold[] = [];
  const size = Math.floor(n / k);
  for (let f = 0; f < k; f++) {
    const start = f * size, end = f === k - 1 ? n : start + size;
    const test = idx.slice(start, end);
    const train = idx.filter((i) => i < start || i >= end);
    folds.push({ trainIdx: train, testIdx: test });
  }
  return folds;
}`,
  trace: metricTrace("import { kFoldIndices } from './impl.ts';", "kFoldIndices(10,5).length", '索引生成', 'indices'),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { kFoldIndices } from '../../src/algorithms/ml/ml-kfold-cv/impl.ts';
test('K-Fold k=5', () => {
  const folds = kFoldIndices(10, 5);
  assert.equal(folds.length, 5);
  for (const f of folds) assert.equal(f.trainIdx.length + f.testIdx.length, 10);
});`,
});

// 33. ml-polynomial-features
ALGS.push({
  id: 'ml-polynomial-features',
  m: ['多项式特征扩展', 'Polynomial Features', '把特征扩展为多项式项以拟合非线性关系。', 'Expand features into polynomial terms for non-linear fitting.',
    '对一维 x 与阶数 d 生成 [1, x, x², ..., xᵈ]。', 'For 1D x and degree d produce [1, x, x², ..., xᵈ].', 'O(d)', 'O(d)', ['ml', 'preprocessing']],
  impl: `// 多项式特征扩展 · 实现
export function polynomialFeatures(x: number, degree: number): number[] {
  if (degree < 0) throw new RangeError('阶数必须非负');
  const out: number[] = [1];
  for (let d = 1; d <= degree; d++) out.push(out[out.length - 1]! * x);
  return out;
}`,
  trace: metricTrace("import { polynomialFeatures } from './impl.ts';", "polynomialFeatures(2,3).length", '扩展完成', 'expanded'),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { polynomialFeatures } from '../../src/algorithms/ml/ml-polynomial-features/impl.ts';
test('多项式 2^0..2^3', () => { assert.deepEqual(polynomialFeatures(2, 3), [1, 2, 4, 8]); });`,
});

// 34. ml-mode-impute
ALGS.push({
  id: 'ml-mode-impute',
  m: ['众数填充缺失值', 'Mode Imputation', '用众数填充缺失值。', 'Fill missing values with the mode.',
    '对分类特征用出现次数最多的值填充 null。', 'For categorical features, fill null with the most frequent value.', 'O(n)', 'O(k)', ['ml', 'preprocessing']],
  impl: `// 众数填充缺失值 · 实现
export function modeImpute(values: (number | null)[]): number[] {
  const valid = values.filter((v): v is number => v !== null);
  if (valid.length === 0) return values.map(() => 0);
  const cnt: Record<number, number> = {};
  for (const v of valid) cnt[v] = (cnt[v] ?? 0) + 1;
  let mode = valid[0]!, best = -1;
  for (const k in cnt) if (cnt[k]! > best) { best = cnt[k]!; mode = Number(k); }
  return values.map((v) => (v === null ? mode : v));
}`,
  trace: metricTrace("import { modeImpute } from './impl.ts';", "modeImpute([1,null,1,null]).join(',')", '填充完成', 'imputed'),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { modeImpute } from '../../src/algorithms/ml/ml-mode-impute/impl.ts';
test('众数填充', () => { assert.deepEqual(modeImpute([1, null, 1, null]), [1, 1, 1, 1]); });`,
});

// 35. ml-median-impute
ALGS.push({
  id: 'ml-median-impute',
  m: ['中位数填充缺失值', 'Median Imputation', '用中位数填充缺失值。', 'Fill missing values with the median.',
    '对数值特征用中位数填充 null，对离群值鲁棒。', 'For numeric features, fill null with median; robust to outliers.', 'O(n log n)', 'O(n)', ['ml', 'preprocessing']],
  impl: `// 中位数填充缺失值 · 实现
export function medianImpute(values: (number | null)[]): number[] {
  const valid = values.filter((v): v is number => v !== null).sort((a, b) => a - b);
  if (valid.length === 0) return values.map(() => 0);
  const med = valid.length % 2 === 1 ? valid[(valid.length - 1) / 2]! : (valid[valid.length / 2 - 1]! + valid[valid.length / 2]!) / 2;
  return values.map((v) => (v === null ? med : v));
}`,
  trace: metricTrace("import { medianImpute } from './impl.ts';", "medianImpute([1,null,3]).join(',')", '填充完成', 'imputed'),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { medianImpute } from '../../src/algorithms/ml/ml-median-impute/impl.ts';
test('中位数填充', () => { assert.deepEqual(medianImpute([1, null, 3]), [1, 2, 3]); });`,
});

// 36. ml-minkowski-dist
ALGS.push({
  id: 'ml-minkowski-dist',
  m: ['明可夫斯基距离', 'Minkowski Distance', '欧氏/曼哈顿距离的推广 L_p。', 'Generalization of Euclidean/Manhattan: L_p.',
    'L_p(a,b)=(Σ|aᵢ-bᵢ|ᵖ)^(1/p)。p=1 曼哈顿，p=2 欧氏。', 'L_p=(Σ|aᵢ-bᵢ|ᵖ)^(1/p); p=1 Manhattan, p=2 Euclidean.', 'O(d)', 'O(1)', ['ml', 'distance']],
  impl: `// 明可夫斯基距离 · 实现
export function minkowskiDistance(a: number[], b: number[], p: number): number {
  if (a.length !== b.length) throw new RangeError('长度不匹配');
  if (p === Infinity) { let m = 0; for (let i = 0; i < a.length; i++) m = Math.max(m, Math.abs(a[i]! - b[i]!)); return m; }
  let s = 0; for (let i = 0; i < a.length; i++) s += Math.abs(a[i]! - b[i]!) ** p;
  return s ** (1 / p);
}`,
  trace: metricTrace("import { minkowskiDistance } from './impl.ts';", "minkowskiDistance([0,0],[3,4],2)", '距离', 'distance'),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { minkowskiDistance } from '../../src/algorithms/ml/ml-minkowski-dist/impl.ts';
test('L2 欧氏', () => { assert.equal(minkowskiDistance([0, 0], [3, 4], 2), 5); });
test('L1 曼哈顿', () => { assert.equal(minkowskiDistance([0, 0], [3, 4], 1), 7); });
test('Linf 切比雪夫', () => { assert.equal(minkowskiDistance([0, 0], [3, 4], Infinity), 4); });`,
});

// 37. ml-weighted-average
ALGS.push({
  id: 'ml-weighted-average',
  m: ['加权平均集成', 'Weighted Average Ensemble', '按权重组合多个模型预测。', 'Combine model predictions by weights.',
    '最终预测 = Σwᵢ ŷᵢ，权重归一化。', 'Final = Σwᵢ ŷᵢ with normalized weights.', 'O(m)', 'O(1)', ['ml', 'ensemble']],
  impl: `// 加权平均集成 · 实现
export function weightedAverageEnsemble(predictions: number[][], weights: number[]): number[] {
  const sum = weights.reduce((a, b) => a + b, 0);
  if (sum === 0) throw new RangeError('权重和为0');
  const n = predictions[0]?.length ?? 0;
  const out = new Array<number>(n).fill(0);
  for (let i = 0; i < predictions.length; i++) for (let j = 0; j < n; j++) out[j]! += (weights[i]! / sum) * predictions[i]![j]!;
  return out;
}`,
  trace: metricTrace("import { weightedAverageEnsemble } from './impl.ts';", "weightedAverageEnsemble([[1,2],[3,4]],[1,1]).join(',')", '集成完成', 'ensembled'),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { weightedAverageEnsemble } from '../../src/algorithms/ml/ml-weighted-average/impl.ts';
test('等权平均', () => { assert.deepEqual(weightedAverageEnsemble([[1, 2], [3, 4]], [1, 1]), [2, 3]); });`,
});

// 38. ml-majority-vote
ALGS.push({
  id: 'ml-majority-vote',
  m: ['多数投票集成', 'Majority Voting Ensemble', '分类预测按多数投票集成。', 'Ensemble classifier via majority voting.',
    '对每个样本取所有模型预测中出现次数最多的类别。', 'For each sample, pick the most frequent class across models.', 'O(mn)', 'O(k)', ['ml', 'ensemble']],
  impl: `// 多数投票集成 · 实现
export function majorityVote(predictions: number[][]): number[] {
  const n = predictions[0]?.length ?? 0;
  const out: number[] = [];
  for (let j = 0; j < n; j++) {
    const cnt: Record<number, number> = {};
    for (let i = 0; i < predictions.length; i++) { const v = predictions[i]![j]!; cnt[v] = (cnt[v] ?? 0) + 1; }
    let best = predictions[0]![j]!, max = -1;
    for (const k in cnt) if (cnt[k]! > max) { max = cnt[k]!; best = Number(k); }
    out.push(best);
  }
  return out;
}`,
  trace: metricTrace("import { majorityVote } from './impl.ts';", "majorityVote([[0,1],[0,1],[1,1]]).join(',')", '投票完成', 'voted'),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { majorityVote } from '../../src/algorithms/ml/ml-majority-vote/impl.ts';
test('多数投票', () => { assert.deepEqual(majorityVote([[0, 1], [0, 1], [1, 1]]), [0, 1]); });`,
});

// 39. ml-bin-discretize
ALGS.push({
  id: 'ml-bin-discretize',
  m: ['等宽分箱', 'Equal-Width Binning', '把连续值划分为等宽区间。', 'Discretize continuous values into equal-width bins.',
    '把 [min,max] 等分为 k 个区间，每个值映射到箱号。', 'Split [min,max] into k equal bins; map each value to its bin index.', 'O(n)', 'O(n)', ['ml', 'preprocessing']],
  impl: `// 等宽分箱 · 实现
export function equalWidthBinning(values: number[], k: number): number[] {
  if (k <= 0) throw new RangeError('箱数必须为正');
  const mn = Math.min(...values), mx = Math.max(...values);
  const w = (mx - mn) / k || 1;
  return values.map((v) => { let b = Math.floor((v - mn) / w); if (b >= k) b = k - 1; return b; });
}`,
  trace: metricTrace("import { equalWidthBinning } from './impl.ts';", "equalWidthBinning([0,1,2,3,4],2).join(',')", '分箱完成', 'binned'),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { equalWidthBinning } from '../../src/algorithms/ml/ml-bin-discretize/impl.ts';
test('等宽分箱 k=2', () => { assert.deepEqual(equalWidthBinning([0, 1, 2, 3, 4], 2), [0, 0, 1, 1, 1]); });`,
});

// 40. ml-outlier-zscore
ALGS.push({
  id: 'ml-outlier-zscore',
  m: ['Z-Score 离群点检测', 'Z-Score Outlier Detection', '用 Z-Score 阈值检测离群点。', 'Detect outliers via Z-score threshold.',
    '当 |z| > threshold 时视为离群点。', 'Flag as outlier when |z| > threshold.', 'O(n)', 'O(n)', ['ml', 'anomaly-detection']],
  impl: `// Z-Score 离群点检测 · 实现
export function zScoreOutliers(values: number[], threshold = 3): boolean[] {
  const n = values.length; if (n === 0) return [];
  const mean = values.reduce((a, b) => a + b, 0) / n;
  const variance = values.reduce((s, v) => s + (v - mean) ** 2, 0) / n;
  const sd = Math.sqrt(variance) || 1;
  return values.map((v) => Math.abs((v - mean) / sd) > threshold);
}`,
  trace: metricTrace("import { zScoreOutliers } from './impl.ts';", "zScoreOutliers([1,2,3,4,5,50]).filter(Boolean).length", '检测完成', 'detected'),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { zScoreOutliers } from '../../src/algorithms/ml/ml-outlier-zscore/impl.ts';
test('检测离群点', () => {
  const flags = zScoreOutliers([1, 2, 3, 4, 5, 50], 2);
  assert.equal(flags[5], true);
  assert.equal(flags[0], false);
});`,
});

// 41. ml-iqr-outlier
ALGS.push({
  id: 'ml-iqr-outlier',
  m: ['IQR 离群点检测', 'IQR Outlier Detection', '用四分位距检测离群点。', 'Detect outliers via interquartile range.',
    '[Q1-1.5·IQR, Q3+1.5·IQR] 之外为离群点。', 'Values outside [Q1-1.5·IQR, Q3+1.5·IQR] are outliers.', 'O(n log n)', 'O(n)', ['ml', 'anomaly-detection']],
  impl: `// IQR 离群点检测 · 实现
function quantile(sorted: number[], q: number): number {
  const pos = (sorted.length - 1) * q;
  const base = Math.floor(pos), rest = pos - base;
  return sorted[base + 1] !== undefined ? sorted[base]! + rest * (sorted[base + 1]! - sorted[base]!) : sorted[base]!;
}
export function iqrOutliers(values: number[]): boolean[] {
  if (values.length === 0) return [];
  const sorted = [...values].sort((a, b) => a - b);
  const q1 = quantile(sorted, 0.25), q3 = quantile(sorted, 0.75);
  const iqr = q3 - q1;
  const lo = q1 - 1.5 * iqr, hi = q3 + 1.5 * iqr;
  return values.map((v) => v < lo || v > hi);
}`,
  trace: metricTrace("import { iqrOutliers } from './impl.ts';", "iqrOutliers([1,2,3,4,100]).filter(Boolean).length", '检测完成', 'detected'),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { iqrOutliers } from '../../src/algorithms/ml/ml-iqr-outlier/impl.ts';
test('IQR 检测离群', () => { assert.equal(iqrOutliers([1, 2, 3, 4, 100])[4], true); });`,
});

// 42. ml-shuffle-data
ALGS.push({
  id: 'ml-shuffle-data',
  m: ['数据打乱', 'Data Shuffling', '用种子可复现地打乱数据顺序。', 'Reproducibly shuffle data with a seed.',
    'Fisher-Yates 配合线性同余 RNG。', 'Fisher-Yates with a seeded LCG for reproducibility.', 'O(n)', 'O(n)', ['ml', 'preprocessing']],
  impl: `// 数据打乱 · 实现
export function shuffleData<T>(data: T[], seed = 1): T[] {
  let s = seed >>> 0;
  const rand = (): number => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
  const arr = data.slice();
  for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [arr[i], arr[j]] = [arr[j]!, arr[i]!]; }
  return arr;
}`,
  trace: metricTrace("import { shuffleData } from './impl.ts';", "shuffleData([1,2,3,4,5],1).join(',')", '打乱完成', 'shuffled'),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { shuffleData } from '../../src/algorithms/ml/ml-shuffle-data/impl.ts';
test('打乱 元素不变', () => { assert.deepEqual(shuffleData([1, 2, 3, 4, 5], 1).sort(), [1, 2, 3, 4, 5]); });
test('打乱 可复现', () => { assert.deepEqual(shuffleData([1, 2, 3], 7), shuffleData([1, 2, 3], 7)); });`,
});

// 43. ml-batch-iter
ALGS.push({
  id: 'ml-batch-iter',
  m: ['Mini-Batch 迭代器', 'Mini-Batch Iterator', '把数据切分为小批量供 SGD 训练。', 'Slice data into mini-batches for SGD.',
    '每次返回大小为 batchSize 的子集。', 'Each iteration yields a subset of size batchSize; last may be smaller.', 'O(n)', 'O(batch)', ['ml', 'optimization']],
  impl: `// Mini-Batch 迭代器 · 实现
export function* miniBatchIter<T>(data: T[], batchSize: number): Generator<T[]> {
  if (batchSize <= 0) throw new RangeError('batch 必须 > 0');
  for (let i = 0; i < data.length; i += batchSize) yield data.slice(i, i + batchSize);
}`,
  trace: metricTrace("import { miniBatchIter } from './impl.ts';", "Array.from(miniBatchIter([1,2,3,4,5],2)).length", '迭代器', 'iterator'),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { miniBatchIter } from '../../src/algorithms/ml/ml-batch-iter/impl.ts';
test('Mini-Batch 切分', () => {
  const batches = Array.from(miniBatchIter([1, 2, 3, 4, 5], 2));
  assert.equal(batches.length, 3);
  assert.deepEqual(batches[2], [5]);
});
test('batch<=0 报错', () => { assert.throws(() => Array.from(miniBatchIter([1], 0)), RangeError); });`,
});

// 44. ml-argmax
ALGS.push({
  id: 'ml-argmax',
  m: ['Argmax', 'Argmax', '返回数组最大值的索引。', 'Return the index of the maximum value.',
    'softmax 输出转类别预测的常用步骤。', 'Common step to convert softmax output to a class prediction.', 'O(n)', 'O(1)', ['ml', 'inference']],
  impl: `// Argmax · 实现
export function argmax(values: number[]): number {
  if (values.length === 0) throw new RangeError('数组为空');
  let bi = 0; for (let i = 1; i < values.length; i++) if (values[i]! > values[bi]!) bi = i;
  return bi;
}
export function argmin(values: number[]): number {
  if (values.length === 0) throw new RangeError('数组为空');
  let bi = 0; for (let i = 1; i < values.length; i++) if (values[i]! < values[bi]!) bi = i;
  return bi;
}`,
  trace: metricTrace("import { argmax } from './impl.ts';", "argmax([1,5,3])", '索引', 'index'),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { argmax, argmin } from '../../src/algorithms/ml/ml-argmax/impl.ts';
test('argmax', () => { assert.equal(argmax([1, 5, 3]), 1); });
test('argmin', () => { assert.equal(argmin([1, 5, 3]), 0); });
test('空数组报错', () => { assert.throws(() => argmax([]), RangeError); });`,
});

// 45. ml-he-init
ALGS.push({
  id: 'ml-he-init',
  m: ['He 权重初始化', 'He Weight Initialization', 'ReLU 网络的方差保持初始化。', 'Variance-preserving init for ReLU networks.',
    '权重 ~ N(0, 2/fan_in)，避免梯度爆炸或消失。', 'Weights ~ N(0, 2/fan_in) to stabilize gradients.', 'O(n)', 'O(n)', ['ml', 'initialization']],
  impl: `// He 权重初始化 · 实现
export function heInit(fanIn: number, n: number, seed = 1): number[] {
  if (fanIn <= 0) throw new RangeError('fan_in 必须 > 0');
  let s = seed >>> 0;
  const rand = (): number => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
  const std = Math.sqrt(2 / fanIn);
  const out: number[] = [];
  for (let i = 0; i < n; i++) {
    const u1 = Math.max(rand(), 1e-10), u2 = rand();
    out.push(std * Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2));
  }
  return out;
}`,
  trace: metricTrace("import { heInit } from './impl.ts';", "heInit(10,5,1).length", '初始化完成', 'initialized'),
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { heInit } from '../../src/algorithms/ml/ml-he-init/impl.ts';
test('He 初始化 数量', () => { assert.equal(heInit(5, 10, 1).length, 10); });
test('He 初始化 可复现', () => { assert.deepEqual(heInit(5, 3, 1), heInit(5, 3, 1)); });`,
});

for (const a of ALGS) {
  writeAlg(a.id, meta(a.id, ...a.m), a.impl, a.trace, a.test);
}
console.log('ml: wrote ' + ALGS.length + ' new algorithms');
