import { test } from 'node:test';
import assert from 'node:assert/strict';
import { dopriStep, integrateDopri } from '../../src/algorithms/numerical/num-rk-dopri/impl.ts';

test('dopriStep 小误差（光滑问题）', () => {
  const f = (_t: number, y: number): number => y;
  const { yNew, error } = dopriStep(f, 0, 1, 0.1);
  assert.ok(Math.abs(yNew - Math.exp(0.1)) < 1e-6);
  assert.ok(error > 0);
});

test("integrateDopri y'=y 精确到 e", () => {
  const f = (_t: number, y: number): number => y;
  const steps = integrateDopri(f, 0, 1, 1, 0.1, 1e-10);
  const yEnd = steps[steps.length - 1]!.y;
  assert.ok(Math.abs(yEnd - Math.E) < 1e-6);
});

test("integrateDopri 测试方程 y'=-2y", () => {
  const f = (_t: number, y: number): number => -2 * y;
  const steps = integrateDopri(f, 0, 1, 1, 0.1, 1e-9);
  const yEnd = steps[steps.length - 1]!.y;
  // 解 y(1) = e^(-2)
  assert.ok(Math.abs(yEnd - Math.exp(-2)) < 1e-5);
});

test('integrateDopri 步长非正抛错', () => {
  assert.throws(() => integrateDopri((_t, _y) => 0, 0, 0, 1, -0.1), RangeError);
});

test('integrateDopri 容差非正抛错', () => {
  assert.throws(() => integrateDopri((_t, _y) => 0, 0, 0, 1, 0.1, 0), RangeError);
});
