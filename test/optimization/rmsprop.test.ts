import { test } from 'node:test';
import assert from 'node:assert/strict';
import { rmsprop, demoFunc, demoGrad } from '../../src/algorithms/optimization/rmsprop/impl.ts';

test('rmsprop 收敛到 (3,-1)', () => {
  const r = rmsprop(demoFunc, demoGrad, [0, 0], { lr: 0.05, rho: 0.9, maxIter: 1000, tol: 1e-10 });
  assert.ok(r.converged);
  assert.ok(Math.abs(r.params[0]! - 3) < 1e-3, `x=${r.params[0]}`);
  assert.ok(Math.abs(r.params[1]! + 1) < 1e-3, `y=${r.params[1]}`);
});

test('rmsprop 目标值趋近 0', () => {
  const r = rmsprop(demoFunc, demoGrad, [0, 0], { lr: 0.05, maxIter: 1000, tol: 1e-12 });
  assert.ok(r.value < 1e-6, `value=${r.value}`);
});

test('rmsprop 小学习率收敛', () => {
  // RMSProp 在二次极小值附近有与 lr 成比例的稳态震荡，故需较小 lr
  for (const lr of [0.01, 0.03, 0.05]) {
    const r = rmsprop(demoFunc, demoGrad, [0, 0], { lr, maxIter: 1000, tol: 1e-8 });
    assert.ok(Math.abs(r.params[0]! - 3) < 1e-2, `lr=${lr} x=${r.params[0]}`);
    assert.ok(Math.abs(r.params[1]! + 1) < 1e-2, `lr=${lr} y=${r.params[1]}`);
  }
});

test('rmsprop 钩子被调用', () => {
  let calls = 0;
  rmsprop(demoFunc, demoGrad, [0, 0], { maxIter: 50 }, { onIter: () => calls++ });
  assert.ok(calls > 0 && calls <= 50);
});
