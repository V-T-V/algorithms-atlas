import { test } from 'node:test';
import assert from 'node:assert/strict';
import { householder } from '../../src/algorithms/numerical/householder/impl.ts';

const closeTo = (a: number, b: number, eps = 1e-9): boolean => Math.abs(a - b) <= eps;

test('householder (Halley) 求 √2', () => {
  const r = householder(
    (x) => x * x - 2,
    (x) => 2 * x,
    () => 2,
    1.5,
    { tol: 1e-14 },
  );
  assert.ok(r.converged);
  assert.ok(closeTo(r.root, Math.SQRT2, 1e-12));
});

test('householder 求 x³ − x − 1 = 0', () => {
  const r = householder(
    (x) => x * x * x - x - 1,
    (x) => 3 * x * x - 1,
    (x) => 6 * x,
    1.5,
    { tol: 1e-14 },
  );
  assert.ok(r.converged);
  assert.ok(closeTo(r.root, 1.324717957244746, 1e-12));
});

test('householder order=1 退化为牛顿法', () => {
  const r = householder(
    (x) => x * x - 2,
    (x) => 2 * x,
    () => 2,
    1.5,
    { order: 1, tol: 1e-14 },
  );
  assert.ok(r.converged);
  assert.ok(closeTo(r.root, Math.SQRT2, 1e-12));
});

test('householder (Halley) 比 order=1 收敛更快', () => {
  const halley = householder(
    (x) => x * x - 2,
    (x) => 2 * x,
    () => 2,
    1.5,
    { tol: 1e-14 },
  );
  const newton = householder(
    (x) => x * x - 2,
    (x) => 2 * x,
    () => 2,
    1.5,
    { order: 1, tol: 1e-14 },
  );
  assert.ok(
    halley.iterations <= newton.iterations,
    `Halley ${halley.iterations} 应 ≤ Newton ${newton.iterations}`,
  );
});

test('householder 钩子被调用', () => {
  let calls = 0;
  const r = householder(
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
