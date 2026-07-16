import { test } from 'node:test';
import assert from 'node:assert/strict';
import { lda, demoData } from '../../src/algorithms/ml/lda/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/ml/lda/trace.ts';

test('lda 权重维度等于特征维度', () => {
  const { X, y } = demoData();
  const r = lda(X, y);
  assert.equal(r.weights.length, X[0]!.length);
});

test('lda 权重单位长度', () => {
  const { X, y } = demoData();
  const r = lda(X, y);
  const norm = Math.sqrt(r.weights.reduce((s, w) => s + w * w, 0));
  assert.ok(Math.abs(norm - 1) < 1e-6);
});

test('lda 在可分数据上准确率高', () => {
  const { X, y } = demoData();
  const r = lda(X, y);
  assert.ok(r.accuracy >= 1 - 1e-6, `accuracy≈1, got ${r.accuracy}`);
});

test('lda 投影后两类分离', () => {
  const { X, y } = demoData();
  const r = lda(X, y);
  const p0 = r.projections.filter((_, i) => y[i] === 0);
  const p1 = r.projections.filter((_, i) => y[i] === 1);
  const mean0 = p0.reduce((s, v) => s + v, 0) / p0.length;
  const mean1 = p1.reduce((s, v) => s + v, 0) / p1.length;
  // 阈值应介于两类投影均值之间
  assert.ok(r.threshold > Math.min(mean0, mean1));
  assert.ok(r.threshold < Math.max(mean0, mean1));
});

test('lda 钩子被调用', () => {
  let means = 0;
  let weights = 0;
  const { X, y } = demoData();
  lda(
    X,
    y,
    {},
    {
      onMean: () => means++,
      onWeights: () => weights++,
    },
  );
  assert.equal(means, 1);
  assert.equal(weights, 1);
});

test('lda 正则化防奇异', () => {
  // 完全共线数据：S_W 奇异，正则化应保证不抛
  const X = [
    [1, 2],
    [2, 4],
    [5, 10],
    [6, 12],
  ];
  const y = [0, 0, 1, 1];
  const r = lda(X, y, { regularization: 1e-2 });
  assert.equal(r.weights.length, 2);
});

test('lda 边界：需两个非空类', () => {
  const X = [[1], [2], [3]];
  assert.throws(() => lda(X, [0, 0, 0], {}), /两个非空类/);
});

test('buildTrace 生成多帧', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 3);
  const last = frames[frames.length - 1]!;
  assert.ok(last.bars || last.aux, '末帧应有内容');
});
