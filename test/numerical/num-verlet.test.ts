import { test } from 'node:test';
import assert from 'node:assert/strict';
import { verletStep, integrateVerlet } from '../../src/algorithms/numerical/num-verlet/impl.ts';

test('Verlet 简谐振子周期正确', () => {
  const accel = (x: number): number => -x;
  const out = integrateVerlet(accel, 0, 1, 0, 2 * Math.PI, 1000);
  const last = out[out.length - 1]!;
  assert.ok(Math.abs(last.x - 1) < 0.005);
  assert.ok(Math.abs(last.v) < 0.05);
});

test('Verlet 能量辛守恒', () => {
  const accel = (x: number): number => -x;
  const out = integrateVerlet(accel, 0, 1, 0, 100, 10000);
  const E0 = 0.5;
  const last = out[out.length - 1]!;
  const EEnd = 0.5 * last.v * last.v + 0.5 * last.x * last.x;
  assert.ok(Math.abs(EEnd - E0) < 0.05);
});

test('verletStep 自由运动', () => {
  // a = 0：x 增加 h·v, v 不变
  const { xNew, vNew, aNew } = verletStep((_x) => 0, 0, 3, 0, 0.5);
  assert.ok(Math.abs(xNew - 1.5) < 1e-9);
  assert.ok(Math.abs(vNew - 3) < 1e-9);
  assert.ok(Math.abs(aNew) < 1e-9);
});

test('步数非正抛错', () => {
  assert.throws(() => integrateVerlet((_x) => 0, 0, 0, 0, 1, 0), RangeError);
});

test('输出长度 = steps + 1', () => {
  const out = integrateVerlet((_x) => 0, 0, 0, 1, 1, 5);
  assert.equal(out.length, 6);
});
