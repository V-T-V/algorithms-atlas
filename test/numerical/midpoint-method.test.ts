import { test } from 'node:test';
import assert from 'node:assert/strict';
import { midpointMethod } from '../../src/algorithms/numerical/midpoint-method/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/numerical/midpoint-method/trace.ts';

test("midpoint 比 Euler 更精确（y'=y，x=2，精确 e^2≈7.389）", () => {
  const exact = Math.exp(2);
  const { points: mp } = midpointMethod((_x, y) => y, 0, 1, 2, 0.1);
  // Euler 在 h=0.1 下约为 (1+0.1)^20 ≈ 6.73，误差大；midpoint 应更接近
  const mpErr = Math.abs(mp[mp.length - 1]!.y - exact);
  assert.ok(mpErr < 0.1, `midpoint 误差过大: ${mpErr}`);
});

test('midpoint 收敛阶 ≈ 2（误差 ~ h^2）', () => {
  const exact = Math.exp(1);
  const errH = (h: number): number => {
    const { points } = midpointMethod((_x, y) => y, 0, 1, 1, h);
    return Math.abs(points[points.length - 1]!.y - exact);
  };
  const e1 = errH(0.1);
  const e2 = errH(0.05);
  const ratio = e2 / e1;
  // 二阶方法：h 减半时误差约 /4
  assert.ok(ratio < 0.35, `收敛阶不符: ratio=${ratio}`);
});

test('midpoint 线性方程精确解', () => {
  // y' = 2（常数），精确解 y = 1 + 2x
  const { points } = midpointMethod((_x, _y) => 2, 0, 1, 1, 0.25);
  for (const p of points) {
    assert.ok(Math.abs(p.y - (1 + 2 * p.x)) < 1e-9, `x=${p.x} y=${p.y}`);
  }
});

test('midpoint 钩子被调用', () => {
  const steps: number[] = [];
  midpointMethod((_x, y) => y, 0, 1, 1, 0.25, { onStep: (s) => steps.push(s) });
  assert.equal(steps.length, 4);
});

test('buildTrace 生成有序帧', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 3);
  assert.ok(frames[0]!.bars, '首帧含 bars');
});
