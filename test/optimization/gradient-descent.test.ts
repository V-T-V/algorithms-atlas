import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  gradientDescent,
  demoFunc,
  demoGrad,
} from '../../src/algorithms/optimization/gradient-descent/impl.ts';

test('梯度下降收敛到 (3,-1)', () => {
  const r = gradientDescent(demoFunc, demoGrad, [0, 0], 0.1, 1000, 1e-8);
  assert.ok(r.converged);
  assert.ok(Math.abs(r.params[0]! - 3) < 1e-3, `x=${r.params[0]}`);
  assert.ok(Math.abs(r.params[1]! + 1) < 1e-3, `y=${r.params[1]}`);
});

test('梯度下降目标值趋近 0', () => {
  const r = gradientDescent(demoFunc, demoGrad, [0, 0], 0.1, 1000, 1e-8);
  assert.ok(r.value < 1e-6);
});

test('大学习率仍收敛（凸函数）', () => {
  const r = gradientDescent(demoFunc, demoGrad, [0, 0], 0.4, 1000, 1e-8);
  assert.ok(Math.abs(r.params[0]! - 3) < 1e-2);
});

test('钩子被调用', () => {
  let iters = 0;
  gradientDescent(demoFunc, demoGrad, [0, 0], 0.1, 50, 1e-8, { onIter: () => iters++ });
  assert.ok(iters > 0 && iters <= 50);
});
