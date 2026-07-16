import { test } from 'node:test';
import assert from 'node:assert/strict';
import { bdf2Step, integrateBdf2 } from '../../src/algorithms/numerical/num-bdf/impl.ts';

test('bdf2Step 非刚性方程收敛', () => {
  const f = (_t: number, y: number): number => y;
  // y'=y：y_{n+1} = (2/3)(2 y_n - 0.5 y_{n-1} + h·y_{n+1})
  // 解析：y_{n+1} = (2/3)(2 y_n - 0.5 y_{n-1}) / (1 - 2h/3)
  const { yNext, iter } = bdf2Step(f, 0.2, 1, Math.exp(0.1), 0.1);
  assert.ok(iter < 100);
  // 与解析比较（不动点法解的是同一方程）
  const expected = ((2 / 3) * (2 * Math.exp(0.1) - 0.5 * 1)) / (1 - (2 / 3) * 0.1);
  assert.ok(Math.abs(yNext - expected) < 1e-6);
});

test("integrateBdf2 y'=y 稳定逼近 e", () => {
  const f = (_t: number, y: number): number => y;
  const out = integrateBdf2(f, 0, 1, 1, 1000);
  const yEnd = out[out.length - 1]!.y;
  // BDF2 二阶精度，1000 步足够
  assert.ok(Math.abs(yEnd - Math.E) < 0.01);
});

test('integrateBdf2 刚性方程保持稳定', () => {
  // y' = -50 y，刚性。BDF2 应保持稳定（不振荡发散）
  const f = (_t: number, y: number): number => -50 * y;
  const out = integrateBdf2(f, 0, 1, 0.5, 500);
  const yEnd = out[out.length - 1]!.y;
  // 解 y(0.5) = e^(-25) ≈ 1.4e-11，应趋近 0 而非 NaN/Inf
  assert.ok(Number.isFinite(yEnd));
  assert.ok(Math.abs(yEnd) < 0.01);
});

test('integrateBdf2 步数 ≤ 1 抛错', () => {
  assert.throws(() => integrateBdf2((_t, _y) => 0, 0, 0, 1, 1), RangeError);
});

test('输出长度 = steps + 1', () => {
  const out = integrateBdf2((_t, y) => -y, 0, 1, 1, 10);
  assert.equal(out.length, 11);
});
