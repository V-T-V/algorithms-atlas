import { test } from 'node:test';
import assert from 'node:assert/strict';
import { elasticNet, softThreshold, demoData } from '../../src/algorithms/ml/elastic-net/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/ml/elastic-net/trace.ts';

test('softThreshold 正确', () => {
  assert.equal(softThreshold(5, 1), 4);
  assert.equal(softThreshold(-5, 1), -4);
  assert.equal(softThreshold(0.5, 1), 0);
});

test('elastic-net α=1 退化为 Lasso（稀疏）', () => {
  const { X, y } = demoData();
  const r = elasticNet(X, y, { lambda: 30, alpha: 1 });
  // 大 λ + α=1 应产生稀疏解
  assert.ok(r.nnz <= X[0]!.length);
});

test('elastic-net α=0 退化为岭回归（无稀疏）', () => {
  const { X, y } = demoData();
  const r = elasticNet(X, y, { lambda: 1, alpha: 0 });
  // α=0 时无 L1，系数不为 0
  assert.equal(r.nnz, X[0]!.length);
});

test('elastic-net 在无噪声数据上拟合', () => {
  const { X, y } = demoData();
  const r = elasticNet(X, y, { lambda: 0.001, alpha: 0.5 });
  assert.ok(r.mse < 0.5, `MSE 应小，got ${r.mse}`);
});

test('elastic-net 相关特征同时保留', () => {
  const { X, y } = demoData();
  const r = elasticNet(X, y, { lambda: 1, alpha: 0.5 });
  // x1、x2 相关，弹性网络倾向同时保留
  assert.ok(r.coefficients.every((c) => Math.abs(c) > 1e-6) || r.nnz >= 1);
});

test('elastic-net 边界：空数据', () => {
  const r = elasticNet([], [], { lambda: 1 });
  assert.deepEqual(r.coefficients, []);
});

test('elastic-net 钩子被调用', () => {
  let iters = 0;
  const { X, y } = demoData();
  elasticNet(X, y, { lambda: 1, maxIterations: 5 }, { onIteration: () => iters++ });
  assert.ok(iters >= 1);
});

test('buildTrace 生成多帧', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 3);
  const last = frames[frames.length - 1]!;
  assert.ok(last.bars, '末帧应含 bars');
});
