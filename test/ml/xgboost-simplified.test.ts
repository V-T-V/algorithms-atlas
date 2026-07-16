import { test } from 'node:test';
import assert from 'node:assert/strict';
import { xgboost, demoData } from '../../src/algorithms/ml/xgboost-simplified/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/ml/xgboost-simplified/trace.ts';

test('xgboost RMSE 随轮数单调下降或持平', () => {
  const { X, y } = demoData();
  const r = xgboost(X, y, { rounds: 10 });
  for (let i = 1; i < r.rmseHistory.length; i++) {
    assert.ok(
      r.rmseHistory[i]! <= r.rmseHistory[i - 1]! + 1e-9,
      `RMSE 应非增：${r.rmseHistory[i - 1]} → ${r.rmseHistory[i]}`,
    );
  }
});

test('xgboost 在无噪声数据上拟合好', () => {
  const { X, y } = demoData();
  const r = xgboost(X, y, { rounds: 30, maxDepth: 4 });
  assert.ok((r.rmseHistory.at(-1) ?? Infinity) < 0.5, `final RMSE 小，got ${r.rmseHistory.at(-1)}`);
});

test('xgboost 树数等于轮数', () => {
  const { X, y } = demoData();
  const r = xgboost(X, y, { rounds: 8 });
  assert.equal(r.trees.length, 8);
  assert.equal(r.leafCounts.length, 8);
});

test('xgboost 每棵树叶子数为正', () => {
  const { X, y } = demoData();
  const r = xgboost(X, y, { rounds: 5 });
  for (const lc of r.leafCounts) assert.ok(lc >= 1);
});

test('xgboost 正则 λ 增大抑制过拟合（叶子权重更小）', () => {
  const { X, y } = demoData();
  const small = xgboost(X, y, { rounds: 5, lambda: 0.1, maxDepth: 3 });
  const large = xgboost(X, y, { rounds: 5, lambda: 100, maxDepth: 3 });
  // 大 λ → 初始 RMSE 接近，但大 λ 的预测值更靠近均值（变化更小）
  const varSmall = Math.max(...small.predictions) - Math.min(...small.predictions);
  const varLarge = Math.max(...large.predictions) - Math.min(...large.predictions);
  assert.ok(varLarge <= varSmall, '大 λ 应使预测值范围更小');
});

test('xgboost 边界：空数据', () => {
  const r = xgboost([], [], { rounds: 3 });
  assert.deepEqual(r.trees, []);
});

test('xgboost 钩子被调用', () => {
  let rounds = 0;
  const { X, y } = demoData();
  xgboost(X, y, { rounds: 5 }, { onRound: () => rounds++ });
  assert.equal(rounds, 5);
});

test('buildTrace 生成多帧', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 3);
  const last = frames[frames.length - 1]!;
  assert.ok(last.bars, '末帧应含 bars');
});
