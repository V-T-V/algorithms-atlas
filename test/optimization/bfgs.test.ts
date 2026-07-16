import { test } from 'node:test';
import assert from 'node:assert/strict';
import { bfgs, demoFunc, demoGrad } from '../../src/algorithms/optimization/bfgs/impl.ts';

test('bfgs 收敛到 (3,-1)', () => {
  const r = bfgs(demoFunc, demoGrad, [0, 0], { maxIter: 100, tol: 1e-10 });
  assert.ok(r.converged);
  assert.ok(Math.abs(r.params[0]! - 3) < 1e-4, `x=${r.params[0]}`);
  assert.ok(Math.abs(r.params[1]! + 1) < 1e-4, `y=${r.params[1]}`);
});

test('bfgs 目标值趋近 0', () => {
  const r = bfgs(demoFunc, demoGrad, [0, 0], { maxIter: 100, tol: 1e-12 });
  assert.ok(r.value < 1e-10, `value=${r.value}`);
});

test('bfgs 超线性收敛（步数很少）', () => {
  const r = bfgs(demoFunc, demoGrad, [0, 0], { maxIter: 100, tol: 1e-8 });
  assert.ok(r.iterations <= 15, `iterations=${r.iterations}`);
});

test('bfgs 从远处收敛', () => {
  const r = bfgs(demoFunc, demoGrad, [50, -50], { maxIter: 100, tol: 1e-8 });
  assert.ok(Math.abs(r.params[0]! - 3) < 1e-3);
  assert.ok(Math.abs(r.params[1]! + 1) < 1e-3);
});

test('bfgs 钩子被调用', () => {
  let calls = 0;
  bfgs(demoFunc, demoGrad, [0, 0], { maxIter: 50 }, { onIter: () => calls++ });
  assert.ok(calls > 0);
});
