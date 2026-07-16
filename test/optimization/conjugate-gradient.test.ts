import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  conjugateGradient,
  demoFunc,
  demoGrad,
} from '../../src/algorithms/optimization/conjugate-gradient/impl.ts';

test('conjugate-gradient 收敛到 (3,-1)', () => {
  const r = conjugateGradient(demoFunc, demoGrad, [0, 0], { maxIter: 100, tol: 1e-10 });
  assert.ok(r.converged);
  assert.ok(Math.abs(r.params[0]! - 3) < 1e-4, `x=${r.params[0]}`);
  assert.ok(Math.abs(r.params[1]! + 1) < 1e-4, `y=${r.params[1]}`);
});

test('conjugate-gradient 目标值趋近 0', () => {
  const r = conjugateGradient(demoFunc, demoGrad, [0, 0], { maxIter: 200, tol: 1e-12 });
  assert.ok(r.value < 1e-10, `value=${r.value}`);
});

test('conjugate-gradient 二次问题步数很少', () => {
  const r = conjugateGradient(demoFunc, demoGrad, [0, 0], { maxIter: 50, tol: 1e-8 });
  assert.ok(r.iterations <= 20, `iterations=${r.iterations} 应很少`);
});

test('conjugate-gradient 钩子被调用', () => {
  let calls = 0;
  conjugateGradient(demoFunc, demoGrad, [0, 0], { maxIter: 50 }, { onIter: () => calls++ });
  assert.ok(calls > 0);
});
