// =============================================================================
// 小批量梯度下降 · 纯算法实现
// 演示：拟合 y = w·x + b（MSE）。
// =============================================================================

import { mseLoss, type Sample } from '../opt-gradient-batch/impl.ts';

export type { Sample };

export interface MiniBatchGDHooks {
  onBatch?: (epoch: number, batch: number, params: number[], loss: number) => void;
  onEpochEnd?: (epoch: number, params: number[], loss: number) => void;
  onDone?: (params: number[], epochs: number) => void;
}

export interface MiniBatchResult {
  params: number[];
  epochs: number;
  loss: number;
}

/** 用 LCG 伪随机（可注入种子）打乱索引。 */
export function shuffledIndices(n: number, seed: number): number[] {
  const idx = Array.from({ length: n }, (_, i) => i);
  let s = seed >>> 0;
  for (let i = n - 1; i > 0; i--) {
    s = (s * 1664525 + 1013904223) >>> 0;
    const j = s % (i + 1);
    const tmp = idx[i]!;
    idx[i] = idx[j]!;
    idx[j] = tmp;
  }
  return idx;
}

/**
 * 小批量梯度下降。
 */
export function miniBatchGradientDescent(
  samples: readonly Sample[],
  initParams: number[],
  lr: number,
  batchSize: number,
  epochs: number,
  seed: number = 1,
  hooks: MiniBatchGDHooks = {},
): MiniBatchResult {
  const params = [...initParams];
  const n = samples.length;
  let lastLoss = mseLoss(params, samples);
  for (let epoch = 1; epoch <= epochs; epoch++) {
    const order = shuffledIndices(n, seed + epoch);
    for (let start = 0; start < n; start += batchSize) {
      const batchIdx = order.slice(start, start + batchSize);
      const batch: Sample[] = batchIdx.map((i) => samples[i]!);
      // batch 梯度
      let gw = 0;
      let gb = 0;
      for (const smp of batch) {
        const e = params[0]! * smp.x + params[1]! - smp.y;
        gw += 2 * e * smp.x;
        gb += 2 * e;
      }
      const m = Math.max(1, batch.length);
      params[0]! -= lr * (gw / m);
      params[1]! -= lr * (gb / m);
      lastLoss = mseLoss(params, samples);
      hooks.onBatch?.(epoch, Math.floor(start / batchSize) + 1, [...params], lastLoss);
    }
    hooks.onEpochEnd?.(epoch, [...params], lastLoss);
  }
  hooks.onDone?.(params, epochs);
  return { params, epochs, loss: mseLoss(params, samples) };
}
