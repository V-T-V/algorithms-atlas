import { test } from 'node:test';
import assert from 'node:assert/strict';
import { bisection } from '../../src/algorithms/numerical/bisection/impl.ts';

const closeTo = (a: number, b: number, eps = 1e-6): boolean => Math.abs(a - b) <= eps;

test('bisection 求 sqrt(2)', () => {
  const r = bisection((x) => x * x - 2, 1, 2, { tol: 1e-12 });
  assert.ok(r.converged);
  assert.ok(closeTo(r.root, Math.SQRT2, 1e-6));
  // 收敛可能由残差 |f(mid)|<=tol 触发（此时宽度未必 <= tol），故只断言显著缩小
  assert.ok(r.width < 1e-6, `终区间宽度应充分小（实际 ${r.width}）`);
});

test('bisection 求 x³ − x − 1 = 0', () => {
  const r = bisection((x) => x * x * x - x - 1, 1, 2, { tol: 1e-12 });
  assert.ok(r.converged);
  assert.ok(closeTo(r.root, 1.324717957244746, 1e-6));
});

test('bisection 端点恰好为根', () => {
  // f(x) = x − 3，[2, 3] 的右端点就是根
  const r = bisection((x) => x - 3, 2, 3, { tol: 1e-12 });
  assert.ok(r.converged);
  assert.ok(closeTo(r.root, 3, 1e-12));
});

test('bisection 同号区间返回 NaN 且不收敛', () => {
  const r = bisection((x) => x * x + 1, 1, 2, { tol: 1e-6 });
  assert.equal(r.converged, false);
  assert.ok(Number.isNaN(r.root));
  assert.equal(r.steps.length, 0);
});

test('bisection 区间宽度每轮减半', () => {
  const r = bisection((x) => x * x - 2, 1, 2, { tol: 1e-12 });
  // 初始宽度 1，每轮减半：width_n = 1 / 2^n
  for (const s of r.steps) {
    const expectedWidth = Math.pow(2, -(s.iter - 1)); // 起始宽度 1
    const actualWidth = s.hi - s.lo;
    assert.ok(
      Math.abs(actualWidth - expectedWidth) < 1e-9,
      `iter ${s.iter}: width=${actualWidth} expect ${expectedWidth}`,
    );
  }
});

test('bisection 收敛轮数与理论一致', () => {
  // 初始宽度 1，容差 1e-12：n = ceil(log2(1/1e-12)) = 40
  const r = bisection((x) => x * x - 2, 1, 2, { tol: 1e-12 });
  const theory = Math.ceil(Math.log2(1 / 1e-12));
  assert.ok(r.iterations <= theory, `iters=${r.iterations} should ≤ ${theory}`);
});

test('bisection 步骤记录完整', () => {
  const r = bisection((x) => x * x - 2, 1, 2, { tol: 1e-10 });
  assert.ok(r.steps.length > 0);
  for (const s of r.steps) {
    // mid 应等于 (lo + hi) / 2
    assert.ok(closeTo(s.mid, (s.lo + s.hi) / 2, 1e-15));
    // newLo/newHi 必为 [lo, mid] 或 [mid, hi] 之一
    assert.ok((s.newLo === s.lo && s.newHi === s.mid) || (s.newLo === s.mid && s.newHi === s.hi));
  }
});

test('bisection maxIter 限流生效', () => {
  const r = bisection((x) => x * x - 2, 1, 2, { tol: 1e-30, maxIter: 10 });
  assert.equal(r.converged, false);
  assert.ok(r.iterations <= 10);
  assert.ok(r.steps.length <= 10);
});

test('bisection 钩子被调用', () => {
  let probes = 0;
  let shrinks = 0;
  bisection(
    (x) => x * x - 2,
    1,
    2,
    { tol: 1e-6 },
    {
      onProbe: () => probes++,
      onShrink: () => shrinks++,
    },
  );
  assert.ok(probes > 0);
  assert.ok(shrinks > 0);
});
