import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  extendedKalmanFilter,
  demoData,
} from '../../src/algorithms/optimization/extended-kalman/impl.ts';
import { buildTrace } from '../../src/algorithms/optimization/extended-kalman/trace.ts';

test('ekf 输出步数等于观测数', () => {
  const { options, observations } = demoData();
  const states = extendedKalmanFilter(observations, options);
  assert.equal(states.length, observations.length);
});

test('ekf 估计位置在合理范围', () => {
  const { options, observations, truth } = demoData();
  const states = extendedKalmanFilter(observations, options);
  const final = states.at(-1)!.mean;
  const t = truth.at(-1)!;
  // 位置估计应接近真值（容差较宽，因含噪）
  assert.ok(Math.abs(final[0]! - t[0]!) < 3, `px 误差应 <3, got ${Math.abs(final[0]! - t[0]!)}`);
  assert.ok(Math.abs(final[1]! - t[1]!) < 3, `py 误差应 <3`);
});

test('ekf 协方差保持维度', () => {
  const { options, observations } = demoData();
  const states = extendedKalmanFilter(observations, options);
  for (const s of states) {
    assert.equal(s.mean.length, 4);
    assert.equal(s.cov.length, 4);
  }
});

test('ekf 协方差对称', () => {
  const { options, observations } = demoData();
  const states = extendedKalmanFilter(observations, options);
  for (const s of states) {
    for (let i = 0; i < s.cov.length; i++)
      for (let j = 0; j < i; j++)
        assert.ok(Math.abs(s.cov[i]![j]! - s.cov[j]![i]!) < 1e-9, '协方差应对称');
  }
});

test('ekf 钩子被调用', () => {
  let steps = 0;
  const { options, observations } = demoData();
  extendedKalmanFilter(observations, options, { onStep: () => steps++ });
  assert.equal(steps, observations.length);
});

test('ekf 边界：空观测', () => {
  const { options } = demoData();
  const states = extendedKalmanFilter([], options);
  assert.deepEqual(states, []);
});

test('buildTrace 生成多帧', () => {
  const frames = buildTrace();
  assert.ok(frames.length >= 3);
  const last = frames[frames.length - 1]!;
  assert.ok(last.bars, '末帧应含 bars');
});
