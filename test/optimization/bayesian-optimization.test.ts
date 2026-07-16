import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  bayesianOptimization,
  demoFunc,
  expectedImprovement,
  normalCdf,
  normalPdf,
  erf,
  fitGP,
  type Observation,
} from '../../src/algorithms/optimization/bayesian-optimization/impl.ts';
import {
  buildTrace,
  DEFAULT_INPUT,
} from '../../src/algorithms/optimization/bayesian-optimization/trace.ts';

test('erf(0)=0, erf(∞)→1', () => {
  assert.ok(Math.abs(erf(0)) < 1e-6);
  assert.ok(Math.abs(erf(3) - 1) < 1e-3);
  assert.ok(Math.abs(erf(-3) + 1) < 1e-3);
});

test('normalCdf 单调 [0,1]', () => {
  assert.ok(Math.abs(normalCdf(0) - 0.5) < 1e-6);
  assert.ok(normalCdf(0) < normalCdf(1));
  assert.ok(normalCdf(-2) > 0 && normalCdf(2) < 1);
});

test('normalPdf 在 0 处最大', () => {
  const p0 = normalPdf(0);
  assert.ok(normalPdf(1) < p0);
  assert.ok(normalPdf(-1) < p0);
});

test('expectedImprovement 非负', () => {
  assert.ok(expectedImprovement(0.5, 0.1, 0) >= 0);
  assert.ok(expectedImprovement(-1, 0.5, 0) >= 0);
});

test('expectedImprovement σ=0 时为 0', () => {
  assert.equal(expectedImprovement(0.5, 0, 0), 0);
});

test('GP 对观测点预测方差小（接近噪声）', () => {
  const obs: Observation[] = [
    { x: 0.2, fx: 0.5 },
    { x: 0.8, fx: -0.5 },
  ];
  const predict = fitGP(obs, { lengthScale: 0.2, signalVar: 1, noiseVar: 1e-6 });
  const atObs = predict(0.2);
  assert.ok(atObs.variance < 0.1, `观测点方差应小, got ${atObs.variance}`);
});

test('bo 在 (x−0.7)² 上找到近似最优', () => {
  const init: Observation[] = [
    { x: 0.1, fx: demoFunc(0.1) },
    { x: 0.9, fx: demoFunc(0.9) },
  ];
  const r = bayesianOptimization(demoFunc, init, { nEvals: 15 });
  assert.ok(Math.abs(r.best.x - 0.7) < 0.1, `x≈0.7, got ${r.best.x}`);
});

test('bo 观测数 = 初始 + nEvals', () => {
  const init: Observation[] = [{ x: 0.5, fx: demoFunc(0.5) }];
  const r = bayesianOptimization(demoFunc, init, { nEvals: 5 });
  assert.equal(r.observations.length, 6);
  assert.equal(r.history.length, 5);
});

test('bo 钩子被调用', () => {
  let steps = 0;
  const init: Observation[] = [{ x: 0.5, fx: demoFunc(0.5) }];
  bayesianOptimization(demoFunc, init, { nEvals: 4 }, { onStep: () => steps++ });
  assert.equal(steps, 4);
});

test('buildTrace 生成多帧', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 3);
  const last = frames[frames.length - 1]!;
  assert.ok(last.aux, '末帧应含 aux');
});
