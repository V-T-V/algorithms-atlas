import { test } from 'node:test';
import assert from 'node:assert/strict';
import { nelderMead, demoFunc } from '../../src/algorithms/optimization/nelder-mead/impl.ts';

test('nelder-mead 收敛到 (3,-1)', () => {
  const r = nelderMead(demoFunc, [0, 0], { maxIter: 500, tol: 1e-12 });
  assert.ok(r.converged);
  assert.ok(Math.abs(r.params[0]! - 3) < 1e-4, `x=${r.params[0]}`);
  assert.ok(Math.abs(r.params[1]! + 1) < 1e-4, `y=${r.params[1]}`);
});

test('nelder-mead 目标值趋近 0', () => {
  const r = nelderMead(demoFunc, [0, 0], { maxIter: 500, tol: 1e-14 });
  assert.ok(r.value < 1e-10, `value=${r.value}`);
});

test('nelder-mead 从远处收敛', () => {
  const r = nelderMead(demoFunc, [20, -20], { maxIter: 500, tol: 1e-10 });
  assert.ok(Math.abs(r.params[0]! - 3) < 1e-3);
  assert.ok(Math.abs(r.params[1]! + 1) < 1e-3);
});

test('nelder-mead 钩子被调用', () => {
  let calls = 0;
  nelderMead(demoFunc, [0, 0], { maxIter: 100, tol: 1e-14 }, { onIter: () => calls++ });
  assert.ok(calls > 0);
});
