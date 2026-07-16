// =============================================================================
// 批量梯度下降（动量 + 裁剪）· 录制帧序列
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { batchGradientDescent2, type BatchGD2Hooks, type Sample } from './impl.ts';

export const DEFAULT_INPUT: {
  samples: Sample[];
  initParams: number[];
  lr: number;
  momentum: number;
  maxGradNorm: number;
  maxIter: number;
  tol: number;
} = {
  samples: [
    { x: 1, y: 3 },
    { x: 2, y: 5 },
    { x: 3, y: 7 },
    { x: 4, y: 9 },
  ],
  initParams: [0, 0],
  lr: 0.05,
  momentum: 0.9,
  maxGradNorm: 10,
  maxIter: 200,
  tol: 1e-6,
};

export function buildTrace(input: typeof DEFAULT_INPUT = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { samples, initParams, lr, momentum, maxGradNorm, maxIter, tol } = input;

  const snapshot = (
    note: { zh: string; en: string },
    epoch: number,
    params: number[],
    grad: number[],
    velocity: number[],
    loss: number,
    clipped: boolean,
  ): void => {
    rec
      .begin(note)
      .setAux([
        { label: 'epoch', value: String(epoch), role: 'pivot' as BarRole },
        { label: 'w', value: params[0]!.toFixed(4), role: 'compare' as BarRole },
        { label: 'b', value: params[1]!.toFixed(4), role: 'compare' as BarRole },
        { label: 'loss', value: loss.toFixed(6), role: 'final' as BarRole },
        { label: 'vw', value: velocity[0]!.toFixed(4) },
        { label: 'vb', value: velocity[1]!.toFixed(4) },
        {
          label: 'clip',
          value: clipped ? 'YES' : 'no',
          role: (clipped ? 'warn' : 'default') as BarRole,
        },
      ])
      .commit();
  };

  snapshot(
    {
      zh: `初始 w=${initParams[0]}, b=${initParams[1]}，动量 ${momentum}，目标 y≈2x+1`,
      en: `Init w=${initParams[0]}, b=${initParams[1]}, momentum ${momentum}, target y≈2x+1`,
    },
    0,
    initParams,
    [0, 0],
    [0, 0],
    0,
    false,
  );

  const hooks: BatchGD2Hooks = {
    onEpoch: (epoch, params, grad, velocity, loss, clipped) => {
      snapshot(
        {
          zh: `epoch ${epoch}：loss=${loss.toFixed(6)}, w=${params[0]!.toFixed(4)}, b=${params[1]!.toFixed(4)}`,
          en: `epoch ${epoch}: loss=${loss.toFixed(6)}, w=${params[0]!.toFixed(4)}, b=${params[1]!.toFixed(4)}`,
        },
        epoch,
        params,
        grad,
        velocity,
        loss,
        clipped,
      );
    },
  };

  const result = batchGradientDescent2(
    samples,
    initParams,
    lr,
    momentum,
    maxGradNorm,
    maxIter,
    tol,
    hooks,
  );

  rec
    .begin({
      zh: result.converged
        ? `收敛：w=${result.params[0]!.toFixed(4)}, b=${result.params[1]!.toFixed(4)}（${result.iterations} 步）`
        : `结束：w=${result.params[0]!.toFixed(4)}, b=${result.params[1]!.toFixed(4)}`,
      en: result.converged
        ? `Converged: w=${result.params[0]!.toFixed(4)}, b=${result.params[1]!.toFixed(4)} (${result.iterations} steps)`
        : `Stopped: w=${result.params[0]!.toFixed(4)}, b=${result.params[1]!.toFixed(4)}`,
    })
    .setAux([
      { label: 'w', value: result.params[0]!.toFixed(4), role: 'final' as BarRole },
      { label: 'b', value: result.params[1]!.toFixed(4), role: 'final' as BarRole },
      { label: 'loss', value: result.loss.toFixed(6), role: 'final' as BarRole },
    ])
    .commit();
  return rec.build();
}
