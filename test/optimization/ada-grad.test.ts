import { test } from 'node:test';
import assert from 'node:assert/strict';
import { adaGrad, demoFunc, demoGrad } from '../../src/algorithms/optimization/ada-grad/impl.ts';

test('ada-grad 收敛到 (3,-1)', () => {
  const r = adaGrad(demoFunc, demoGrad, [0, 0], { lr: 1.0, maxIter: 500, tol: 1e-10 });
  assert.ok(r.converged);
  assert.ok(Math.abs(r.params[0]! - 3) < 1e-3, `x=${r.params[0]}`);
  assert.ok(Math.abs(r.params[1]! + 1) < 1e-3, `y=${r.params[1]}`);
});

test('ada-grad 目标值趋近 0', () => {
  const r = adaGrad(demoFunc, demoGrad, [0, 0], { lr: 1.0, maxIter: 500, tol: 1e-12 });
  assert.ok(r.value < 1e-6, `value=${r.value}`);
});

test('ada-grad 无需手调学习率（lr=0.5 与 2.0 都收敛）', () => {
  for (const lr of [0.3, 0.5, 1.0, 2.0, 5.0]) {
    const r = adaGrad(demoFunc, demoGrad, [0, 0], { lr, maxIter: 1000, tol: 1e-8 });
    assert.ok(Math.abs(r.params[0]! - 3) < 1e-2, `lr=${lr} x=${r.params[0]}`);
  }
});

test('ada-grad 钩子被调用', () => {
  let calls = 0;
  adaGrad(demoFunc, demoGrad, [0, 0], { maxIter: 50 }, { onIter: () => calls++ });
  assert.ok(calls > 0 && calls <= 50);
});
