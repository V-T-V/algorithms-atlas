import { test } from 'node:test';
import assert from 'node:assert/strict';
import { heunMethod } from '../../src/algorithms/numerical/heun-method/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/numerical/heun-method/trace.ts';

test('heun 比 Euler 更精确', () => {
  const exact = Math.exp(2);
  const { points } = heunMethod((_x, y) => y, 0, 1, 2, 0.1);
  const err = Math.abs(points[points.length - 1]!.y - exact);
  assert.ok(err < 0.1, `误差过大: ${err}`);
});

test('heun 收敛阶 ≈ 2', () => {
  const exact = Math.exp(1);
  const errH = (h: number): number => {
    const { points } = heunMethod((_x, y) => y, 0, 1, 1, h);
    return Math.abs(points[points.length - 1]!.y - exact);
  };
  const ratio = errH(0.05) / errH(0.1);
  assert.ok(ratio < 0.35, `收敛阶不符: ratio=${ratio}`);
});

test('heun 常数导数精确', () => {
  const { points } = heunMethod((_x, _y) => 2, 0, 1, 1, 0.25);
  for (const p of points) {
    assert.ok(Math.abs(p.y - (1 + 2 * p.x)) < 1e-9, `x=${p.x} y=${p.y}`);
  }
});

test('heun 钩子被调用', () => {
  const steps: number[] = [];
  heunMethod((_x, y) => y, 0, 1, 1, 0.25, { onStep: (s) => steps.push(s) });
  assert.equal(steps.length, 4);
});

test('buildTrace 生成有序帧', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 3);
  assert.ok(frames[0]!.bars, '首帧含 bars');
});
