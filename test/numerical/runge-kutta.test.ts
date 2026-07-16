import { test } from 'node:test';
import assert from 'node:assert/strict';
import { rungeKutta4 } from '../../src/algorithms/numerical/runge-kutta/impl.ts';

test("RK4 解 y'=y 近似 e^x", () => {
  const result = rungeKutta4((_, y) => y, 0, 1, 1, 0.1);
  const last = result.points[result.points.length - 1]!;
  // e^1 ≈ 2.71828，RK4 误差极小
  assert.ok(Math.abs(last.y - Math.E) < 1e-4, `y(1)=${last.y} vs e=${Math.E}`);
});

test("RK4 解 y'=1 近似线性", () => {
  const result = rungeKutta4((_, _y) => 1, 0, 0, 5, 0.5);
  const last = result.points[result.points.length - 1]!;
  assert.ok(Math.abs(last.y - 5) < 1e-9);
});

test("RK4 解 y'=-y", () => {
  const result = rungeKutta4((_, y) => -y, 0, 1, 1, 0.1);
  const last = result.points[result.points.length - 1]!;
  // 精确解 e^-1 ≈ 0.36788
  assert.ok(Math.abs(last.y - 1 / Math.E) < 1e-4);
});

test('RK4 步数正确', () => {
  const result = rungeKutta4((_, y) => y, 0, 1, 1, 0.25);
  assert.equal(result.points.length, 5); // x=0,0.25,0.5,0.75,1
});

test('RK4 钩子被调用', () => {
  let steps = 0;
  rungeKutta4((_, y) => y, 0, 1, 1, 0.25, { onStep: () => steps++ });
  assert.equal(steps, 4);
});
