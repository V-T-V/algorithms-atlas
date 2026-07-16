import { test } from 'node:test';
import assert from 'node:assert/strict';
import { rk4System } from '../../src/algorithms/numerical/rk4-system/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/numerical/rk4-system/trace.ts';

test('rk4-system 解独立方程组（与单变量 RK4 一致）', () => {
  // 两个独立 y'=y，应各自给出 e^1
  const { points } = rk4System((_x, y) => [y[0]!, y[1]!], 0, [1, 1], 1, 0.25);
  const last = points[points.length - 1]!.y;
  assert.ok(Math.abs(last[0]! - Math.E) < 0.01);
  assert.ok(Math.abs(last[1]! - Math.E) < 0.01);
});

test('rk4-system 线性系统精确', () => {
  // y1' = 1, y2' = 0 → y1 = t, y2 = const
  const { points } = rk4System((_x, _y) => [1, 0], 0, [0, 5], 2, 0.5);
  for (const p of points) {
    assert.ok(Math.abs(p.y[0]! - p.x) < 1e-9, `y1=${p.y[0]} at x=${p.x}`);
    assert.ok(Math.abs(p.y[1]! - 5) < 1e-9, `y2=${p.y[1]}`);
  }
});

test('rk4-system Lotka-Volterra 总量非负', () => {
  const F = (_x: number, y: number[]) => [
    1.1 * y[0]! - 0.4 * y[0]! * y[1]!,
    0.1 * y[0]! * y[1]! - 0.4 * y[1]!,
  ];
  const { points } = rk4System(F, 0, [40, 9], 20, 0.1);
  for (const p of points) {
    assert.ok(p.y[0]! >= 0, `猎物负: ${p.y[0]}`);
    assert.ok(p.y[1]! >= 0, `捕食者负: ${p.y[1]}`);
  }
});

test('rk4-system 维数保持', () => {
  const { points } = rk4System((_x, y) => [y[0]!, y[1]!, y[2]!], 0, [1, 2, 3], 1, 0.25);
  for (const p of points) assert.equal(p.y.length, 3);
});

test('rk4-system 钩子被调用', () => {
  const steps: number[] = [];
  rk4System((_x, y) => [y[0]!], 0, [1], 1, 0.25, { onStep: (s) => steps.push(s) });
  assert.equal(steps.length, 4);
});

test('buildTrace 生成有序帧', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 3);
  assert.ok(frames[0]!.bars, '首帧含 bars');
});
