import { test } from 'node:test';
import assert from 'node:assert/strict';
import { brent } from '../../src/algorithms/numerical/brent/impl.ts';

const closeTo = (a: number, b: number, eps = 1e-9): boolean => Math.abs(a - b) <= eps;

test('brent 求 √2', () => {
  const r = brent((x) => x * x - 2, 1, 2);
  assert.ok(r.converged);
  assert.ok(closeTo(r.root, Math.SQRT2, 1e-10));
});

test('brent 求 x³ − x − 1 = 0', () => {
  const r = brent((x) => x * x * x - x - 1, 1, 2);
  assert.ok(r.converged);
  assert.ok(closeTo(r.root, 1.324717957244746, 1e-9));
});

test('brent 根在端点上直接返回', () => {
  const r = brent((x) => x * x - 4, 2, 5);
  assert.ok(r.converged);
  assert.equal(r.root, 2);
});

test('brent 区间不变号抛错', () => {
  assert.throws(() => brent((x) => x * x + 1, 0, 1)); // 恒正，无根
});

test('brent 保证收敛（迭代数有界）', () => {
  const r = brent((x) => Math.sin(x), 3, 4); // 根 = π
  assert.ok(r.converged);
  assert.ok(closeTo(r.root, Math.PI, 1e-9));
  assert.ok(r.iterations <= 80);
});

test('brent 钩子被调用且方法合法', () => {
  const methods = new Set<string>();
  const r = brent(
    (x) => x * x - 2,
    1,
    2,
    { tol: 1e-12 },
    {
      onStep: (s) => methods.add(s.method),
    },
  );
  assert.ok(r.converged);
  for (const m of methods) assert.ok(['iqi', 'secant', 'bisection'].includes(m));
});
