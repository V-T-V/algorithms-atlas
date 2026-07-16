import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  nesterovAcceleratedGradient,
  demoFunc,
  demoGrad,
} from '../../src/algorithms/optimization/opt-momentum-nesterov/impl.ts';

test('nesterovAcceleratedGradient 收敛到 (3,-1)', () => {
  const r = nesterovAcceleratedGradient([0, 0], 0.1, 0.9, 200, 1e-8);
  assert.ok(Math.abs(r.params[0]! - 3) < 0.01, `x=${r.params[0]}`);
  assert.ok(Math.abs(r.params[1]! + 1) < 0.01, `y=${r.params[1]}`);
});

test('demoFunc/demoGrad 正确', () => {
  assert.equal(demoFunc([3, -1]), 0);
  assert.deepEqual(demoGrad([3, -1]), [0, 0]);
});

test('nesterovAcceleratedGradient 钩子', () => {
  let iters = 0;
  nesterovAcceleratedGradient([0, 0], 0.1, 0.9, 5, 1e-12, { onIter: () => iters++ });
  assert.ok(iters >= 1);
});
