import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fixedPoint } from '../../src/algorithms/numerical/fixed-point/impl.ts';

const closeTo = (a: number, b: number, eps = 1e-6): boolean => Math.abs(a - b) <= eps;

test('fixed-point 求 x = cos(x)（Dottie 数）', () => {
  const r = fixedPoint((x) => Math.cos(x), 1, { tol: 1e-12 });
  assert.ok(r.converged);
  assert.ok(closeTo(r.root, 0.7390851332151607, 1e-9));
});

test('fixed-point 求 √2（巴比伦法）', () => {
  const r = fixedPoint((x) => 0.5 * (x + 2 / x), 1.5, { tol: 1e-12 });
  assert.ok(r.converged);
  assert.ok(closeTo(r.root, Math.SQRT2, 1e-10));
});

test('fixed-point 收敛判据：线性函数一步到位', () => {
  // g(x) = 0.5 x + 1，不动点 x=2；线性收敛
  const r = fixedPoint((x) => 0.5 * x + 1, 0, { tol: 1e-12, maxIter: 200 });
  assert.ok(r.converged);
  assert.ok(closeTo(r.root, 2, 1e-9));
});

test('fixed-point 发散情形不收敛', () => {
  // g(x) = 2x，|g\'| = 2 > 1，发散
  const r = fixedPoint((x) => 2 * x, 1, { tol: 1e-12, maxIter: 50 });
  assert.equal(r.converged, false);
});

test('fixed-point 钩子被调用', () => {
  let calls = 0;
  fixedPoint((x) => Math.cos(x), 1, { tol: 1e-3, maxIter: 50 }, { onIter: () => calls++ });
  assert.ok(calls > 0, '至少一轮迭代');
});
