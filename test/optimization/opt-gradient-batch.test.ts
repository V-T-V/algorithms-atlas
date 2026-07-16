import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  batchGradientDescent,
  mseLoss,
  mseGrad,
  type Sample,
} from '../../src/algorithms/optimization/opt-gradient-batch/impl.ts';

const SAMPLES: Sample[] = [
  { x: 1, y: 3 },
  { x: 2, y: 5 },
  { x: 3, y: 7 },
  { x: 4, y: 9 },
];

test('batchGradientDescent 拟合 y=2x+1', () => {
  const r = batchGradientDescent(SAMPLES, [0, 0], 0.05, 500, 1e-8);
  assert.ok(Math.abs(r.params[0]! - 2) < 0.05, `w=${r.params[0]}`);
  assert.ok(Math.abs(r.params[1]! - 1) < 0.05, `b=${r.params[1]}`);
});

test('mseLoss / mseGrad 正确', () => {
  const loss = mseLoss([2, 1], SAMPLES);
  assert.ok(loss < 1e-6);
  const g = mseGrad([0, 0], SAMPLES);
  assert.ok(g[0]! < 0 && g[1]! < 0);
});

test('batchGradientDescent 钩子', () => {
  let epochs = 0;
  batchGradientDescent(SAMPLES, [0, 0], 0.05, 5, 1e-12, { onEpoch: () => epochs++ });
  assert.ok(epochs >= 1);
});
