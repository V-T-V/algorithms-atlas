import { test } from 'node:test';
import assert from 'node:assert/strict';
import { chebyshev } from '../../src/algorithms/numerical/chebyshev/impl.ts';

const closeTo = (a: number, b: number, eps = 1e-9): boolean => Math.abs(a - b) <= eps;

test('chebyshev 求 √2', () => {
  const r = chebyshev(
    (x) => x * x - 2,
    (x) => 2 * x,
    () => 2,
    1.5,
    { tol: 1e-14 },
  );
  assert.ok(r.converged);
  assert.ok(closeTo(r.root, Math.SQRT2, 1e-12));
});

test('chebyshev 求 x³ − x − 1 = 0', () => {
  const r = chebyshev(
    (x) => x * x * x - x - 1,
    (x) => 3 * x * x - 1,
    (x) => 6 * x,
    1.5,
    { tol: 1e-14 },
  );
  assert.ok(r.converged);
  assert.ok(closeTo(r.root, 1.324717957244746, 1e-12));
});

test('chebyshev 三阶收敛（迭代数很少）', () => {
  const r = chebyshev(
    (x) => x * x - 2,
    (x) => 2 * x,
    () => 2,
    1.5,
    { tol: 1e-14 },
  );
  assert.ok(r.iterations <= 6, `迭代数 ${r.iterations} 应很少`);
});

test('chebyshev 线性函数一步到根', () => {
  // f = 2x - 4, f' = 2, f'' = 0 -> 切比雪夫退化为牛顿，一步到根 2
  const r = chebyshev(
    (x) => 2 * x - 4,
    () => 2,
    () => 0,
    99,
    { tol: 1e-12 },
  );
  assert.ok(r.converged);
  assert.ok(r.iterations <= 2);
  assert.ok(closeTo(r.root, 2, 1e-12));
});

test('chebyshev 钩子被调用', () => {
  let calls = 0;
  const r = chebyshev(
    (x) => x * x - 2,
    (x) => 2 * x,
    () => 2,
    1.5,
    { tol: 1e-12 },
    { onIter: () => calls++ },
  );
  assert.ok(r.converged);
  assert.ok(calls > 0);
});
