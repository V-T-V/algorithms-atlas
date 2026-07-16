import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  bayesianLinearRegression,
  predict,
  demoData,
} from '../../src/algorithms/ml/bayesian-linear/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/ml/bayesian-linear/trace.ts';

test('bayesian-linear 在无噪声线性数据上拟合', () => {
  const { X, y } = demoData(); // y = 3x + 2
  const r = bayesianLinearRegression(X, y, { noiseVar: 0.01, priorPrecision: 0.001 });
  assert.ok(Math.abs(r.posterior.mean[1]! - 3) < 0.3, `slope≈3, got ${r.posterior.mean[1]}`);
  assert.ok(Math.abs(r.posterior.mean[0]! - 2) < 0.5, `intercept≈2, got ${r.posterior.mean[0]}`);
});

test('bayesian-linear 输出预测方差', () => {
  const { X, y } = demoData();
  const r = bayesianLinearRegression(X, y, { noiseVar: 0.5, priorPrecision: 0.1 });
  assert.equal(r.variances.length, X.length);
  for (const v of r.variances) assert.ok(v > 0);
});

test('bayesian-linear 精度矩阵对称正定（对角为正）', () => {
  const { X, y } = demoData();
  const r = bayesianLinearRegression(X, y, { noiseVar: 0.5, priorPrecision: 0.1 });
  for (let i = 0; i < r.posterior.precision.length; i++) {
    assert.ok(r.posterior.precision[i]![i]! > 0, '对角线应为正');
  }
});

test('bayesian-linear 外推预测方差更大', () => {
  const { X, y } = demoData();
  const r = bayesianLinearRegression(X, y, { noiseVar: 0.5, priorPrecision: 0.1 });
  const inSample = predict(r, [X[0]![0]!], 0.5, true);
  const far = predict(r, [100], 0.5, true);
  assert.ok(far.variance > inSample.variance, '远离数据点方差应更大');
});

test('bayesian-linear 边界：空数据', () => {
  const r = bayesianLinearRegression([], [], { noiseVar: 1 });
  assert.deepEqual(r.posterior.mean, []);
});

test('bayesian-linear 钩子被调用', () => {
  let precisions = 0;
  let posteriors = 0;
  const { X, y } = demoData();
  bayesianLinearRegression(
    X,
    y,
    { noiseVar: 0.5 },
    {
      onPrecision: () => precisions++,
      onPosterior: () => posteriors++,
    },
  );
  assert.equal(precisions, 1);
  assert.equal(posteriors, 1);
});

test('buildTrace 生成多帧', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 3);
  const last = frames[frames.length - 1]!;
  assert.ok(last.aux, '末帧应含 aux');
});
