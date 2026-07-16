import { test } from 'node:test';
import assert from 'node:assert/strict';
import { kalmanFilter, demoData } from '../../src/algorithms/optimization/kalman-filter/impl.ts';
import { buildTrace } from '../../src/algorithms/optimization/kalman-filter/trace.ts';

test('kalman 输出步数等于观测数', () => {
  const { F, H, Q, R, init, observations } = demoData();
  const states = kalmanFilter(observations, { F, H, Q, R, init });
  assert.equal(states.length, observations.length);
});

test('kalman 估计追踪真值（最终误差小）', () => {
  const { F, H, Q, R, init, observations, truth } = demoData();
  const states = kalmanFilter(observations, { F, H, Q, R, init });
  const finalPos = states.at(-1)!.mean[0]!;
  assert.ok(Math.abs(finalPos - truth.at(-1)!) < 1.5);
});

test('kalman 协方差随迭代减小', () => {
  const { F, H, Q, R, init, observations } = demoData();
  const states = kalmanFilter(observations, { F, H, Q, R, init });
  const earlyCov = states[0]!.cov[0]![0]!;
  const lateCov = states.at(-1)!.cov[0]![0]!;
  assert.ok(lateCov <= earlyCov + 1e-6, '协方差应减小或维持');
});

test('kalman 状态维度保持', () => {
  const { F, H, Q, R, init, observations } = demoData();
  const states = kalmanFilter(observations, { F, H, Q, R, init });
  for (const s of states) {
    assert.equal(s.mean.length, init.mean.length);
    assert.equal(s.cov.length, init.cov.length);
  }
});

test('kalman 协方差对称', () => {
  const { F, H, Q, R, init, observations } = demoData();
  const states = kalmanFilter(observations, { F, H, Q, R, init });
  for (const s of states) {
    assert.ok(Math.abs(s.cov[0]![1]! - s.cov[1]![0]!) < 1e-9, '协方差应对称');
  }
});

test('kalman 钩子被调用', () => {
  let steps = 0;
  const { F, H, Q, R, init, observations } = demoData();
  kalmanFilter(observations, { F, H, Q, R, init }, { onStep: () => steps++ });
  assert.equal(steps, observations.length);
});

test('kalman 边界：空观测', () => {
  const { F, H, Q, R, init } = demoData();
  const states = kalmanFilter([], { F, H, Q, R, init });
  assert.deepEqual(states, []);
});

test('buildTrace 生成多帧', () => {
  const frames = buildTrace();
  assert.ok(frames.length >= 3);
  const last = frames[frames.length - 1]!;
  assert.ok(last.bars, '末帧应含 bars');
});
