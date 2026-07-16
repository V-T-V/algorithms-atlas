import { test } from 'node:test';
import assert from 'node:assert/strict';
import { importanceSample } from '../../src/algorithms/randomized/rand-importance/impl.ts';

test('importanceSample 估计 E[x²] 接近 1', () => {
  // x ~ N(0,1), E[x²] = 1
  const r = importanceSample(20000, 0, 1);
  assert.ok(Math.abs(r.estimate - 1) < 0.2, `estimate ${r.estimate} 偏离 1`);
});

test('importanceSample 不同提议仍无偏', () => {
  // 即使从 q=N(2,1) 采样，估计仍应接近 1（无偏性）
  const r = importanceSample(30000, 2, 1);
  assert.ok(Math.abs(r.estimate - 1) < 0.3, `偏移提议下估计 ${r.estimate} 偏差过大`);
});

test('importanceSample 方差非负', () => {
  const r = importanceSample(1000, 0, 1);
  assert.ok(r.variance >= 0);
});

test('importanceSample 确定性', () => {
  const a = importanceSample(500, 0, 1);
  const b = importanceSample(500, 0, 1);
  assert.equal(a.estimate, b.estimate);
});

test('importanceSample 自定义 f', () => {
  // f(x) = 1 → E[1] = 1
  const r = importanceSample(5000, 0, 1, () => 1);
  assert.ok(Math.abs(r.estimate - 1) < 0.05);
});
