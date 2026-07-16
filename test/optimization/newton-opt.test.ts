import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  newtonOpt,
  demoFunc,
  demoGrad,
  demoHess,
} from '../../src/algorithms/optimization/newton-opt/impl.ts';

test('newton-opt 二次函数一步收敛到 (3,-1)', () => {
  const r = newtonOpt(demoFunc, demoGrad, demoHess, [0, 0], { maxIter: 10, tol: 1e-12 });
  assert.ok(r.converged);
  // 海森为常数对角阵，从任意点出发 1 步即精确到达
  assert.ok(Math.abs(r.params[0]! - 3) < 1e-9, `x=${r.params[0]}`);
  assert.ok(Math.abs(r.params[1]! + 1) < 1e-9, `y=${r.params[1]}`);
  assert.ok(r.iterations <= 2, `iterations=${r.iterations}`);
});

test('newton-opt 目标值趋近 0', () => {
  const r = newtonOpt(demoFunc, demoGrad, demoHess, [10, -10], { maxIter: 20, tol: 1e-12 });
  assert.ok(r.value < 1e-12, `value=${r.value}`);
});

test('newton-opt 从远处仍一步收敛', () => {
  const r = newtonOpt(demoFunc, demoGrad, demoHess, [1000, -1000], { maxIter: 10, tol: 1e-10 });
  assert.ok(Math.abs(r.params[0]! - 3) < 1e-6);
  assert.ok(Math.abs(r.params[1]! + 1) < 1e-6);
});

test('newton-opt 钩子被调用', () => {
  let calls = 0;
  newtonOpt(demoFunc, demoGrad, demoHess, [0, 0], { maxIter: 10 }, { onIter: () => calls++ });
  assert.ok(calls > 0);
});
