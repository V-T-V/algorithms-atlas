import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  particleFilter,
  systematicResample,
  mulberry32,
  demoData,
} from '../../src/algorithms/optimization/particle-filter/impl.ts';
import { buildTrace } from '../../src/algorithms/optimization/particle-filter/trace.ts';

test('systematicResample 权重越大的粒子越可能被保留', () => {
  const rng = mulberry32(1);
  const particles = [
    { x: 0, w: 0.9 },
    { x: 1, w: 0.05 },
    { x: 2, w: 0.05 },
  ];
  const out = systematicResample(particles, rng);
  // 高权重粒子 x=0 应被复制多次
  const count0 = out.filter((p) => p.x === 0).length;
  assert.ok(count0 >= 2);
});

test('systematicResample 保持粒子数', () => {
  const rng = mulberry32(1);
  const particles = Array.from({ length: 10 }, (_, i) => ({ x: i, w: 0.1 }));
  const out = systematicResample(particles, rng);
  assert.equal(out.length, 10);
});

test('particleFilter 估计步数等于观测数', () => {
  const { observations, initialState } = demoData();
  const { estimates } = particleFilter(observations, initialState, { nParticles: 100, seed: 1 });
  assert.equal(estimates.length, observations.length);
});

test('particleFilter 估计追踪真值', () => {
  const { observations, initialState, truth } = demoData();
  const { estimates } = particleFilter(observations, initialState, { nParticles: 300, seed: 1 });
  const finalEst = estimates.at(-1)!;
  assert.ok(Math.abs(finalEst - truth.at(-1)!) < 2, `est≈${truth.at(-1)}, got ${finalEst}`);
});

test('particleFilter 确定性', () => {
  const { observations, initialState } = demoData();
  const a = particleFilter(observations, initialState, { nParticles: 50, seed: 7 });
  const b = particleFilter(observations, initialState, { nParticles: 50, seed: 7 });
  assert.deepEqual(a.estimates, b.estimates);
});

test('particleFilter 粒子权重和为 1', () => {
  const { observations, initialState } = demoData();
  const { particles } = particleFilter(observations, initialState, { nParticles: 50, seed: 1 });
  const sum = particles.reduce((s, p) => s + p.w, 0);
  assert.ok(Math.abs(sum - 1) < 1e-6);
});

test('particleFilter 钩子被调用', () => {
  let steps = 0;
  const { observations, initialState } = demoData();
  particleFilter(
    observations,
    initialState,
    { nParticles: 50, seed: 1 },
    { onStep: () => steps++ },
  );
  assert.equal(steps, observations.length);
});

test('particleFilter 边界：空观测', () => {
  const r = particleFilter([], 0, { nParticles: 10 });
  assert.deepEqual(r.estimates, []);
});

test('buildTrace 生成多帧', () => {
  const frames = buildTrace();
  assert.ok(frames.length >= 3);
  const last = frames[frames.length - 1]!;
  assert.ok(last.bars, '末帧应含 bars');
});
