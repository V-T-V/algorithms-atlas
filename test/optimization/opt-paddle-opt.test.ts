import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  optPaddleOpt,
  demoFunc,
  demoGrad,
} from '../../src/algorithms/optimization/opt-paddle-opt/impl.ts';

test('opt-paddle-opt 收敛到 (3,-1)', () => {
  const r = optPaddleOpt(demoFunc, demoGrad, [0, 0], { lr: 0.1, maxIter: 500, tol: 1e-8 });
  assert.ok(r.converged);
  assert.ok(Math.abs(r.params[0]! - 3) < 1e-2, `x=${r.params[0]}`);
  assert.ok(Math.abs(r.params[1]! + 1) < 1e-2, `y=${r.params[1]}`);
});

test('opt-paddle-opt 目标值趋近 0', () => {
  const r = optPaddleOpt(demoFunc, demoGrad, [0, 0], { lr: 0.1, maxIter: 500, tol: 1e-10 });
  assert.ok(r.value < 1e-4, `value=${r.value}`);
});
