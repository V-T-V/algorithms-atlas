// =============================================================================
// 批量梯度下降 · 录制帧序列
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { batchGradientDescent, type BatchGDHooks, type Sample } from './impl.ts';

// 数据近似 y = 2x + 1
export const DEFAULT_INPUT: {
  samples: Sample[];
  initParams: number[];
  lr: number;
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
  maxIter: 100,
  tol: 1e-6,
};

export function buildTrace(input: typeof DEFAULT_INPUT = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { samples, initParams, lr, maxIter, tol } = input;

  const snapshot = (
    note: { zh: string; en: string },
    epoch: number,
    params: number[],
    grad: number[],
    loss: number,
  ): void => {
    rec
      .begin(note)
      .setAux([
        { label: 'epoch', value: String(epoch), role: 'pivot' as BarRole },
        { label: 'w', value: params[0]!.toFixed(4), role: 'compare' as BarRole },
        { label: 'b', value: params[1]!.toFixed(4), role: 'compare' as BarRole },
        { label: 'loss', value: loss.toFixed(6), role: 'final' as BarRole },
        { label: 'gw', value: grad[0]!.toFixed(4) },
        { label: 'gb', value: grad[1]!.toFixed(4) },
      ])
      .commit();
  };

  snapshot(
    {
      zh: `初始 w=${initParams[0]}, b=${initParams[1]}，目标 y≈2x+1`,
      en: `Init w=${initParams[0]}, b=${initParams[1]}, target y≈2x+1`,
    },
    0,
    initParams,
    [0, 0],
    0,
  );

  const hooks: BatchGDHooks = {
    onEpoch: (epoch, params, grad, loss) => {
      snapshot(
        {
          zh: `epoch ${epoch}：loss=${loss.toFixed(6)}, w=${params[0]!.toFixed(4)}, b=${params[1]!.toFixed(4)}`,
          en: `epoch ${epoch}: loss=${loss.toFixed(6)}, w=${params[0]!.toFixed(4)}, b=${params[1]!.toFixed(4)}`,
        },
        epoch,
        params,
        grad,
        loss,
      );
    },
  };

  const result = batchGradientDescent(samples, initParams, lr, maxIter, tol, hooks);

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
