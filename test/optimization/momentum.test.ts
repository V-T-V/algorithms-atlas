import { test } from 'node:test';
import assert from 'node:assert/strict';
import { momentum, demoFunc, demoGrad } from '../../src/algorithms/optimization/momentum/impl.ts';

test('momentum 收敛到 (3,-1)', () => {
  const r = momentum(demoFunc, demoGrad, [0, 0], { lr: 0.1, beta: 0.9, maxIter: 500, tol: 1e-10 });
  assert.ok(r.converged);
  assert.ok(Math.abs(r.params[0]! - 3) < 1e-3, `x=${r.params[0]}`);
  assert.ok(Math.abs(r.params[1]! + 1) < 1e-3, `y=${r.params[1]}`);
});

test('momentum 目标值趋近 0', () => {
  const r = momentum(demoFunc, demoGrad, [0, 0], { lr: 0.1, beta: 0.9, maxIter: 500, tol: 1e-12 });
  assert.ok(r.value < 1e-6, `value=${r.value}`);
});

test('momentum beta=0 等价于普通 SGD', () => {
  // beta=0 时 v=grad，params -= lr*grad
  const r = momentum(demoFunc, demoGrad, [0, 0], { lr: 0.1, beta: 0, maxIter: 1, tol: 0 });
  // 一步：x = 0 - 0.1*2*(0-3) = 0.6
  assert.ok(Math.abs(r.params[0]! - 0.6) < 1e-9);
});

test('momentum 钩子被调用', () => {
  let calls = 0;
  momentum(demoFunc, demoGrad, [0, 0], { maxIter: 50 }, { onIter: () => calls++ });
  assert.ok(calls > 0 && calls <= 50);
});
