import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  batchGradientDescent2,
  mseLoss,
  mseGrad,
  clipByNorm,
  type Sample,
} from '../../src/algorithms/optimization/opt-gradient-batch-2/impl.ts';
import { buildTrace } from '../../src/algorithms/optimization/opt-gradient-batch-2/trace.ts';

const SAMPLES: Sample[] = [
  { x: 1, y: 3 },
  { x: 2, y: 5 },
  { x: 3, y: 7 },
  { x: 4, y: 9 },
];

test('opt-gradient-batch-2 拟合 y=2x+1', () => {
  const r = batchGradientDescent2(SAMPLES, [0, 0], 0.05, 0.9, 100, 500, 1e-8);
  assert.ok(Math.abs(r.params[0]! - 2) < 0.05, `w=${r.params[0]}`);
  assert.ok(Math.abs(r.params[1]! - 1) < 0.05, `b=${r.params[1]}`);
});

test('opt-gradient-batch-2 clipByNorm 不超阈值', () => {
  const { grad, clipped } = clipByNorm([3, 4], 1);
  assert.equal(clipped, true);
  const norm = Math.hypot(grad[0]!, grad[1]!);
  assert.ok(Math.abs(norm - 1) < 1e-9);
});

test('opt-gradient-batch-2 clipByNorm 未超阈值不裁剪', () => {
  const { grad, clipped } = clipByNorm([0.3, 0.4], 10);
  assert.equal(clipped, false);
  assert.equal(grad[0], 0.3);
});

test('opt-gradient-batch-2 mseLoss/mseGrad', () => {
  assert.ok(mseLoss([2, 1], SAMPLES) < 1e-6);
  const g = mseGrad([0, 0], SAMPLES);
  assert.ok(g[0]! < 0 && g[1]! < 0);
});

test('opt-gradient-batch-2 动量比纯 GD 更快', () => {
  const withMom = batchGradientDescent2(SAMPLES, [0, 0], 0.05, 0.9, 100, 30, 1e-8);
  const noMom = batchGradientDescent2(SAMPLES, [0, 0], 0.05, 0, 100, 30, 1e-8);
  // 同样步数下，动量的 loss 应不大于无动量
  assert.ok(withMom.loss <= noMom.loss + 1e-9);
});

test('opt-gradient-batch-2 梯度裁剪触发', () => {
  let clipped = false;
  // 极小 maxNorm 强制裁剪
  batchGradientDescent2(SAMPLES, [100, 100], 0.01, 0, 0.001, 1, 1e-12, {
    onEpoch: (_e, _p, _g, _v, _l, c) => {
      if (c) clipped = true;
    },
  });
  assert.equal(clipped, true);
});

test('opt-gradient-batch-2 钩子', () => {
  let epochs = 0;
  let dones = 0;
  batchGradientDescent2(SAMPLES, [0, 0], 0.05, 0.9, 100, 5, 1e-12, {
    onEpoch: () => epochs++,
    onDone: () => dones++,
  });
  assert.ok(epochs >= 1);
  assert.equal(dones, 1);
});

test('buildTrace 生成 aux 帧', () => {
  const frames = buildTrace();
  assert.ok(frames.length >= 4);
  for (const f of frames) assert.ok(f.aux);
  const last = frames[frames.length - 1]!;
  const w = last.aux!.find((e) => e.label === 'w');
  assert.ok(w);
});
