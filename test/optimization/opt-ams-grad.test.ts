import { test } from 'node:test';
import assert from 'node:assert/strict';
import { amsGrad, demoFunc } from '../../src/algorithms/optimization/opt-ams-grad/impl.ts';

test('amsGrad 收敛到 (3,-1)', () => {
  const r = amsGrad([0, 0], 0.1, 0.9, 0.999, 1e-8, 300, 1e-8);
  assert.ok(Math.abs(r.params[0]! - 3) < 0.05, `x=${r.params[0]}`);
  assert.ok(Math.abs(r.params[1]! + 1) < 0.05, `y=${r.params[1]}`);
});

test('demoFunc 在最优点为 0', () => {
  assert.equal(demoFunc([3, -1]), 0);
});

test('amsGrad 钩子', () => {
  let iters = 0;
  amsGrad([0, 0], 0.1, 0.9, 0.999, 1e-8, 5, 1e-12, { onIter: () => iters++ });
  assert.ok(iters >= 1);
});
