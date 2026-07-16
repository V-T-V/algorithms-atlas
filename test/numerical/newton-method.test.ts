import { test } from 'node:test';
import assert from 'node:assert/strict';
import { newtonMethod } from '../../src/algorithms/numerical/newton-method/impl.ts';

const closeTo = (a: number, b: number, eps = 1e-9): boolean => Math.abs(a - b) <= eps;

test('newton-method 求 sqrt(2)', () => {
  // f(x) = x² − 2，根 = √2
  const r = newtonMethod(
    (x) => x * x - 2,
    (x) => 2 * x,
    1.5,
    { tol: 1e-12 },
  );
  assert.ok(r.converged, '应收敛');
  assert.ok(closeTo(r.root, Math.SQRT2, 1e-10), `root=${r.root} expect √2=${Math.SQRT2}`);
  assert.ok(r.iterations <= 10, '牛顿法应在数轮内收敛');
});

test('newton-method 求 sqrt(9) = 3', () => {
  const r = newtonMethod(
    (x) => x * x - 9,
    (x) => 2 * x,
    1,
    { tol: 1e-12 },
  );
  assert.ok(r.converged);
  assert.ok(closeTo(r.root, 3, 1e-10));
});

test('newton-method 求 x³ − x − 1 = 0', () => {
  // 已知实根 ≈ 1.3247179572...
  const r = newtonMethod(
    (x) => x * x * x - x - 1,
    (x) => 3 * x * x - 1,
    1.5,
    { tol: 1e-12 },
  );
  assert.ok(r.converged);
  assert.ok(closeTo(r.root, 1.324717957244746, 1e-9));
});

test('newton-method 线性方程快速收敛', () => {
  // f(x) = 2x − 4，根 = 2；牛顿一步到达精确根，第二步残差为 0 触发收敛
  const r = newtonMethod(
    (x) => 2 * x - 4,
    () => 2,
    99,
    { tol: 1e-12 },
  );
  assert.ok(r.converged);
  assert.ok(r.iterations <= 2, `线性方程应在 ≤2 轮收敛，实际 ${r.iterations}`);
  assert.ok(closeTo(r.root, 2, 1e-12));
});

test('newton-method 导数为 0 时不收敛', () => {
  // f(x) = x² + 1（无实根），从 x=0 出发导数也是 0
  const r = newtonMethod(
    (x) => x * x + 1,
    (x) => 2 * x,
    0,
    { tol: 1e-6 },
  );
  assert.equal(r.converged, false);
  assert.equal(r.steps.length, 0);
});

test('newton-method maxIter 限流生效', () => {
  // 选一个迭代会发散/震荡且不触碰零导数的场景：f(x) = e^x − 1000，从极负值出发
  // 这里只验证：未收敛时 iterations 不超过 maxIter，steps 也被限流。
  const r = newtonMethod(
    (x) => Math.exp(x) - 1000,
    (x) => Math.exp(x),
    -1e6,
    {
      tol: 1e-12,
      maxIter: 3,
    },
  );
  assert.equal(r.converged, false);
  assert.ok(r.iterations <= 3, `iterations=${r.iterations} 应 ≤ maxIter=3`);
  assert.ok(r.steps.length <= 3);
});

test('newton-method 步骤记录完整', () => {
  const r = newtonMethod(
    (x) => x * x - 4,
    (x) => 2 * x,
    3,
    { tol: 1e-12 },
  );
  assert.ok(r.steps.length > 0);
  // 每一步的 next 应等于 x − fx/dfx
  for (const s of r.steps) {
    assert.ok(closeTo(s.next, s.x - s.fx / s.dfx, 1e-12), '迭代公式应成立');
    assert.equal(s.fx, s.x * s.x - 4);
  }
});

test('newton-method 钩子被调用', () => {
  let calls = 0;
  const r = newtonMethod(
    (x) => x * x - 2,
    (x) => 2 * x,
    1.5,
    { tol: 1e-12 },
    { onIter: () => calls++ },
  );
  assert.equal(calls, r.steps.length);
  assert.ok(calls > 0);
});

test('newton-method 二次收敛（有效位数翻倍）', () => {
  // 从 1.0 求 √2：观察 |err_{n+1}| ≈ C * |err_n|²
  const trueRoot = Math.SQRT2;
  const r = newtonMethod(
    (x) => x * x - 2,
    (x) => 2 * x,
    1.0,
    { tol: 1e-15, maxIter: 20 },
  );
  // 收集每轮的误差
  const errs = r.steps.map((s) => Math.abs(s.next - trueRoot)).filter((e) => e > 1e-16);
  // 后一项应明显小于前一项的平方（二次收敛的特征）
  for (let i = 1; i < errs.length; i++) {
    assert.ok(
      errs[i]! < errs[i - 1]! * errs[i - 1]! + 1e-12,
      `二次收敛失败: ${errs[i]} >= ${errs[i - 1]}²`,
    );
  }
});
