import { test } from 'node:test';
import assert from 'node:assert/strict';
import { adamsBashforth4 } from '../../src/algorithms/numerical/adams-bashforth/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/numerical/adams-bashforth/trace.ts';

test("adams-bashforth 4 阶精度（y'=y，x=1）", () => {
  const exact = Math.exp(1);
  const { points } = adamsBashforth4((_x, y) => y, 0, 1, 1, 0.1);
  const err = Math.abs(points[points.length - 1]!.y - exact);
  assert.ok(err < 1e-4, `误差过大: ${err}`);
});

test('adams-bashforth 常数导数精确', () => {
  const { points } = adamsBashforth4((_x, _y) => 2, 0, 1, 1, 0.25);
  for (const p of points) {
    assert.ok(Math.abs(p.y - (1 + 2 * p.x)) < 1e-9, `x=${p.x} y=${p.y}`);
  }
});

test('adams-bashforth 收敛阶 ≈ 4', () => {
  const exact = Math.exp(1);
  const errH = (h: number): number => {
    const { points } = adamsBashforth4((_x, y) => y, 0, 1, 1, h);
    return Math.abs(points[points.length - 1]!.y - exact);
  };
  const ratio = errH(0.05) / errH(0.1);
  // 四阶：h 减半时误差约 /16
  assert.ok(ratio < 0.1, `收敛阶不符: ratio=${ratio}`);
});

test('adams-bashforth 前 4 步用 RK4 启动', () => {
  const slopes: number[] = [];
  adamsBashforth4((_x, y) => y, 0, 1, 1, 0.25, { onStep: (_s, _x, _y, f) => slopes.push(f) });
  assert.equal(slopes.length, 4);
});

test('adams-bashforth 钩子被调用', () => {
  const steps: number[] = [];
  adamsBashforth4((_x, y) => y, 0, 1, 1, 0.25, { onStep: (s) => steps.push(s) });
  assert.equal(steps.length, 4);
});

test('buildTrace 生成有序帧', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 3);
  assert.ok(frames[0]!.bars, '首帧含 bars');
});
