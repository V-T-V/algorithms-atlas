import { test } from 'node:test';
import assert from 'node:assert/strict';
import { rkf45Step, integrateRk45 } from '../../src/algorithms/numerical/num-rk45/impl.ts';

test('rkf45Step y5 与 y4 接近（光滑问题）', () => {
  const f = (_t: number, y: number): number => y;
  const { y4, y5 } = rkf45Step(f, 0, 1, 0.1);
  assert.ok(Math.abs(y4 - y5) < 1e-4);
});

test("integrateRk45 精确积分 y'=y 到 e", () => {
  const f = (_t: number, y: number): number => y;
  const steps = integrateRk45(f, 0, 1, 1, 0.1, 1e-8);
  const yEnd = steps[steps.length - 1]!.y;
  assert.ok(Math.abs(yEnd - Math.E) < 1e-5);
});

test("integrateRk45 精确积分 y'=cos(t) 到 sin", () => {
  const f = (t: number): number => Math.cos(t);
  const steps = integrateRk45(f, 0, 0, 1, 0.1, 1e-8);
  const yEnd = steps[steps.length - 1]!.y;
  assert.ok(Math.abs(yEnd - Math.sin(1)) < 1e-6);
});

test('integrateRk45 步长非正抛错', () => {
  assert.throws(() => integrateRk45((_t, _y) => 0, 0, 0, 1, -0.1), RangeError);
});

test('integrateRk45 容差非正抛错', () => {
  assert.throws(() => integrateRk45((_t, _y) => 0, 0, 0, 1, 0.1, -1), RangeError);
});

test('integrateRk45 反向积分', () => {
  const f = (_t: number, y: number): number => y;
  const steps = integrateRk45(f, 1, Math.E, 0, 0.1, 1e-8);
  const yEnd = steps[steps.length - 1]!.y;
  assert.ok(Math.abs(yEnd - 1) < 1e-4);
});
