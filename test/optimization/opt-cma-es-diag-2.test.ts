import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  optCmaEsDiag2,
  demoFunc,
  demoGrad,
} from '../../src/algorithms/optimization/opt-cma-es-diag-2/impl.ts';

test('opt-cma-es-diag-2 收敛到 (3,-1)', () => {
  const r = optCmaEsDiag2(demoFunc, demoGrad, [0, 0], { sigma: 2.0, maxIter: 300, tol: 1e-8 });
  assert.ok(Math.abs(r.params[0]! - 3) < 0.2, `x=${r.params[0]}`);
  assert.ok(Math.abs(r.params[1]! + 1) < 0.2, `y=${r.params[1]}`);
});

test('opt-cma-es-diag-2 目标值较小', () => {
  const r = optCmaEsDiag2(demoFunc, demoGrad, [0, 0], { sigma: 2.0, maxIter: 300, tol: 1e-10 });
  assert.ok(r.value < 1.0, `value=${r.value}`);
});
