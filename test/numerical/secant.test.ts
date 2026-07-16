import { test } from 'node:test';
import assert from 'node:assert/strict';
import { secant } from '../../src/algorithms/numerical/secant/impl.ts';

const closeTo = (a: number, b: number, eps = 1e-9): boolean => Math.abs(a - b) <= eps;

test('secant 求 √2', () => {
  const r = secant((x) => x * x - 2, 1, 2, { tol: 1e-12 });
  assert.ok(r.converged);
  assert.ok(closeTo(r.root, Math.SQRT2, 1e-10));
});

test('secant 求 x³ − x − 1 = 0', () => {
  const r = secant((x) => x * x * x - x - 1, 1, 2, { tol: 1e-12 });
  assert.ok(r.converged);
  assert.ok(closeTo(r.root, 1.324717957244746, 1e-9));
});

test('secant 不需要变号区间也能收敛', () => {
  // 两初值同侧 1.4, 1.5
  const r = secant((x) => x * x - 2, 1.4, 1.5, { tol: 1e-12 });
  assert.ok(r.converged);
  assert.ok(closeTo(r.root, Math.SQRT2, 1e-9));
});

test('secant 收敛比二分快（迭代数较少）', () => {
  const r = secant((x) => x * x - 2, 1, 2, { tol: 1e-12 });
  assert.ok(r.iterations <= 10, `迭代数 ${r.iterations} 应较小`);
});

test('secant 钩子被调用', () => {
  let calls = 0;
  const r = secant((x) => x * x - 2, 1, 2, { tol: 1e-6 }, { onIter: () => calls++ });
  assert.ok(r.converged);
  assert.ok(calls > 0);
});
