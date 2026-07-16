import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  integrateLeapfrog,
  leapfrogStep,
} from '../../src/algorithms/numerical/num-leapfrog/impl.ts';

test('Leapfrog 简谐振子周期正确', () => {
  // x'' = -x，x(0)=1, v(0)=0。一个周期 2π 后应回到 x≈1, v≈0
  const accel = (x: number): number => -x;
  const out = integrateLeapfrog(accel, 0, 1, 0, 2 * Math.PI, 1000);
  const last = out[out.length - 1]!;
  assert.ok(Math.abs(last.x - 1) < 0.01);
  assert.ok(Math.abs(last.v) < 0.05);
});

test('Leapfrog 能量近似守恒（辛性）', () => {
  const accel = (x: number): number => -x;
  const out = integrateLeapfrog(accel, 0, 1, 0, 100, 10000);
  // 能量 E = 0.5 v² + 0.5 x²，初始 E=0.5，应保持近似
  const E0 = 0.5;
  const last = out[out.length - 1]!;
  const EEnd = 0.5 * last.v * last.v + 0.5 * last.x * last.x;
  // 辛积分器能量在真值附近振荡，不漂移
  assert.ok(Math.abs(EEnd - E0) < 0.1);
});

test('leapfrogStep 单步正确', () => {
  // 自由运动 x'' = 0：vHalf 应不变，x 增加 h·v
  const { xNew, vNewHalf } = leapfrogStep((_x) => 0, 0, 2, 0.5);
  assert.ok(Math.abs(xNew - 1) < 1e-9);
  assert.ok(Math.abs(vNewHalf - 2) < 1e-9);
});

test('步数非正抛错', () => {
  assert.throws(() => integrateLeapfrog((_x) => 0, 0, 0, 0, 1, 0), RangeError);
});

test('输出长度 = steps + 1', () => {
  const out = integrateLeapfrog((_x) => 0, 0, 0, 1, 1, 5);
  assert.equal(out.length, 6);
});
