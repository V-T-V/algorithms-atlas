import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fitGMM, assignLabels } from '../../src/algorithms/ml/gmm-em-iteration/impl.ts';

const close = (a: number, b: number, eps = 0.3): boolean => Math.abs(a - b) < eps;

// 两组数据：均值 ~2 与 ~8
const DATA_A = [1.5, 1.8, 2.1, 1.9, 2.3, 1.7, 2.0, 2.2];
const DATA_B = [7.8, 8.1, 8.3, 7.9, 8.2, 8.0, 7.7, 8.4];

test('fitGMM: 两高斯均值接近 2 与 8', () => {
  const r = fitGMM([...DATA_A, ...DATA_B], 2, [1.5, 8], 100, 1e-6);
  const means = r.components.map((c) => c.mean).sort((a, b) => a - b);
  assert.ok(close(means[0]!, 2, 0.5), `lower mean=${means[0]}`);
  assert.ok(close(means[1]!, 8, 0.5), `upper mean=${means[1]}`);
});

test('fitGMM: 权重和为 1', () => {
  const r = fitGMM([...DATA_A, ...DATA_B], 2, [1.5, 8]);
  const w = r.components.reduce((s, c) => s + c.weight, 0);
  assert.ok(Math.abs(w - 1) < 1e-6);
});

test('fitGMM: 方差为正', () => {
  const r = fitGMM([...DATA_A, ...DATA_B], 2, [1.5, 8]);
  for (const c of r.components) assert.ok(c.variance > 0);
});

test('fitGMM: 责任度每行和为 1', () => {
  const r = fitGMM([...DATA_A, ...DATA_B], 2, [1.5, 8]);
  for (const row of r.responsibilities) {
    const s = row.reduce((acc, v) => acc + v, 0);
    assert.ok(Math.abs(s - 1) < 1e-6);
  }
});

test('fitGMM: 标签把两组分开', () => {
  const r = fitGMM([...DATA_A, ...DATA_B], 2, [1.5, 8]);
  const labels = assignLabels(r.responsibilities);
  // DATA_A 的标签应全部相同
  assert.ok(labels.slice(0, DATA_A.length).every((l) => l === labels[0]));
  // DATA_B 的标签应全部相同
  assert.ok(labels.slice(DATA_A.length).every((l) => l === labels[DATA_A.length]));
  // 两组标签不同
  assert.notEqual(labels[0], labels[DATA_A.length]);
});

test('fitGMM: K=1 → 全部分到分量 0', () => {
  const r = fitGMM([...DATA_A, ...DATA_B], 1, [5], 50);
  const labels = assignLabels(r.responsibilities);
  assert.ok(labels.every((l) => l === 0));
});

test('fitGMM: 对数似然为有限数', () => {
  const r = fitGMM([...DATA_A, ...DATA_B], 2, [1.5, 8]);
  assert.ok(Number.isFinite(r.logLikelihood));
});

test('fitGMM: hooks 正确回调', () => {
  let eSteps = 0;
  let mSteps = 0;
  let done: unknown = null;
  fitGMM([...DATA_A, ...DATA_B], 2, [1.5, 8], 30, 1e-6, {
    onEStep: () => eSteps++,
    onMStep: () => mSteps++,
    onDone: (r) => (done = r),
  });
  assert.ok(eSteps > 0);
  assert.ok(mSteps > 0);
  assert.ok(done !== null);
});

test('fitGMM: 非法入参抛错', () => {
  assert.throws(() => fitGMM([...DATA_A], 0), RangeError);
  assert.throws(() => fitGMM([...DATA_A], 100), RangeError);
});

test('fitGMM: 空数据', () => {
  const r = fitGMM([], 2);
  assert.deepEqual(r.components, []);
});
