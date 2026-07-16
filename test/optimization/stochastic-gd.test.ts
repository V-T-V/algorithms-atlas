import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  stochasticGd,
  demoSamples,
  lossOnSample,
  gradOnSample,
} from '../../src/algorithms/optimization/stochastic-gd/impl.ts';

test('stochastic-gd 拟合 y=2x+1，收敛到 w≈2 b≈1', () => {
  const r = stochasticGd(lossOnSample, gradOnSample, [0, 0], demoSamples, {
    lr: 0.05,
    maxEpoch: 500,
    tol: 1e-10,
  });
  assert.ok(Math.abs(r.params[0]! - 2) < 1e-2, `w=${r.params[0]}`);
  assert.ok(Math.abs(r.params[1]! - 1) < 1e-2, `b=${r.params[1]}`);
});

test('stochastic-gd 损失趋近 0', () => {
  const r = stochasticGd(lossOnSample, gradOnSample, [0, 0], demoSamples, {
    lr: 0.05,
    maxEpoch: 1000,
    tol: 1e-12,
  });
  assert.ok(r.loss < 1e-3, `loss=${r.loss}`);
});

test('stochastic-gd 单样本梯度在真值处为零', () => {
  const g = gradOnSample([2, 1], demoSamples[0]!);
  assert.ok(Math.abs(g[0]!) < 1e-9 && Math.abs(g[1]!) < 1e-9);
});

test('stochastic-gd 钩子被调用', () => {
  let epochs = 0;
  let samples = 0;
  stochasticGd(
    lossOnSample,
    gradOnSample,
    [0, 0],
    demoSamples,
    { maxEpoch: 10 },
    {
      onEpoch: () => epochs++,
      onSample: () => samples++,
    },
  );
  assert.ok(epochs > 0 && epochs <= 10);
  assert.equal(samples, 10 * demoSamples.length);
});
