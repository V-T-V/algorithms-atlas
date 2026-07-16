import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  lagrangeMultiplier,
  demoProblem,
} from '../../src/algorithms/optimization/lagrange-multiplier/impl.ts';
import { buildTrace } from '../../src/algorithms/optimization/lagrange-multiplier/trace.ts';

test('lagrange 求 min x²+y² s.t. x+y=2 → (1,1)', () => {
  const { f, constraints, x0, expect } = demoProblem();
  const r = lagrangeMultiplier(f, constraints, x0, { maxIterations: 100 });
  assert.ok(Math.abs(r.x[0]! - expect[0]!) < 1e-3);
  assert.ok(Math.abs(r.x[1]! - expect[1]!) < 1e-3);
});

test('lagrange 约束被满足', () => {
  const { f, constraints, x0 } = demoProblem();
  const r = lagrangeMultiplier(f, constraints, x0, { maxIterations: 100 });
  for (const g of constraints) {
    assert.ok(Math.abs(g(r.x)) < 1e-4, `约束违反应小, got ${g(r.x)}`);
  }
});

test('lagrange 残差收敛到小值', () => {
  const { f, constraints, x0 } = demoProblem();
  const r = lagrangeMultiplier(f, constraints, x0, { maxIterations: 100, tolerance: 1e-8 });
  assert.ok(r.residual < 1e-3, `residual 小, got ${r.residual}`);
});

test('lagrange 钩子被调用', () => {
  let iters = 0;
  const { f, constraints, x0 } = demoProblem();
  lagrangeMultiplier(f, constraints, x0, { maxIterations: 20 }, { onIteration: () => iters++ });
  assert.ok(iters >= 1);
});

test('lagrange 无约束情形（纯最小化）', () => {
  // min (x−3)² + (y+1)²，无约束 → (3,−1)
  const r = lagrangeMultiplier((x) => (x[0]! - 3) ** 2 + (x[1]! + 1) ** 2, [], [0, 0], {
    maxIterations: 50,
  });
  assert.ok(Math.abs(r.x[0]! - 3) < 1e-2);
  assert.ok(Math.abs(r.x[1]! + 1) < 1e-2);
});

test('lagrange 多约束', () => {
  // min x²+y²+z² s.t. x=1, y=2 → z=0
  const r = lagrangeMultiplier(
    (x) => x[0]! ** 2 + x[1]! ** 2 + x[2]! ** 2,
    [(x) => x[0]! - 1, (x) => x[1]! - 2],
    [0, 0, 0],
    { maxIterations: 100 },
  );
  assert.ok(Math.abs(r.x[0]! - 1) < 1e-2);
  assert.ok(Math.abs(r.x[1]! - 2) < 1e-2);
  assert.ok(Math.abs(r.x[2]!) < 1e-2);
});

test('buildTrace 生成多帧', () => {
  const frames = buildTrace();
  assert.ok(frames.length >= 2);
  const last = frames[frames.length - 1]!;
  assert.ok(last.bars, '末帧应含 bars');
});
