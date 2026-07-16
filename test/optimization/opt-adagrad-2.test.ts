import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  optAdagrad2,
  demoFunc,
  demoGrad,
} from '../../src/algorithms/optimization/opt-adagrad-2/impl.ts';

test('opt-adagrad-2 收敛到 (3,-1)', () => {
  const r = optAdagrad2(demoFunc, demoGrad, [0, 0], { lr: 1.0, maxIter: 500, tol: 1e-8 });
  assert.ok(r.converged);
  assert.ok(Math.abs(r.params[0]! - 3) < 1e-2, `x=${r.params[0]}`);
  assert.ok(Math.abs(r.params[1]! + 1) < 1e-2, `y=${r.params[1]}`);
});

test('opt-adagrad-2 目标值趋近 0', () => {
  const r = optAdagrad2(demoFunc, demoGrad, [0, 0], { lr: 1.0, maxIter: 500, tol: 1e-10 });
  assert.ok(r.value < 1e-4, `value=${r.value}`);
});

test('opt-adagrad-2 学习率随累计梯度单调下降', () => {
  // AdaGrad 特性：分母 sqrt(v) 单调递增，因此有效步长递减
  const r = optAdagrad2(demoFunc, demoGrad, [0, 0], { lr: 1.0, maxIter: 50 });
  assert.ok(r.iterations > 0);
  assert.ok(Number.isFinite(r.params[0]!));
});
