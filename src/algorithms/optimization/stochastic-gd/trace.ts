// 随机梯度下降 · 录制帧序列
// 用 setAux 展示参数 (w,b) 与 epoch 平均损失随训练变化。

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { stochasticGd, demoSamples, lossOnSample, gradOnSample, type SGDHooks } from './impl.ts';

export const DEFAULT_INPUT = { initParams: [0, 0], lr: 0.05, maxEpoch: 100, tol: 1e-10 };

export function buildTrace(
  input: { initParams?: number[]; lr?: number; maxEpoch?: number; tol?: number } = {},
): Frame[] {
  const { initParams = [0, 0], lr = 0.05, maxEpoch = 100, tol = 1e-10 } = input;
  const rec = new TraceRecorder();

  const snapshot = (
    note: { zh: string; en: string },
    w: number,
    b: number,
    loss: number,
    epoch: number,
  ) => {
    rec
      .begin(note)
      .setAux([
        { label: 'epoch', value: String(epoch), role: 'pivot' as BarRole },
        { label: 'w', value: w.toFixed(4), role: 'compare' as BarRole },
        { label: 'b', value: b.toFixed(4), role: 'compare' as BarRole },
        { label: 'avgLoss', value: loss.toFixed(6), role: 'final' as BarRole },
      ])
      .commit();
  };

  const firstLoss =
    demoSamples.reduce((s, samp) => s + lossOnSample(initParams, samp), 0) / demoSamples.length;
  snapshot(
    {
      zh: `初始 w=${initParams[0]} b=${initParams[1]}，拟合 y=2x+1`,
      en: `Init w=${initParams[0]} b=${initParams[1]}, fit y=2x+1`,
    },
    initParams[0]!,
    initParams[1]!,
    firstLoss,
    0,
  );

  const hooks: SGDHooks = {
    onEpoch: (epoch, params, avgLoss) => {
      snapshot(
        {
          zh: `epoch ${epoch}：avgLoss=${avgLoss.toFixed(6)}，w=${params[0]!.toFixed(3)} b=${params[1]!.toFixed(3)}`,
          en: `epoch ${epoch}: avgLoss=${avgLoss.toFixed(6)}, w=${params[0]!.toFixed(3)} b=${params[1]!.toFixed(3)}`,
        },
        params[0]!,
        params[1]!,
        avgLoss,
        epoch,
      );
    },
  };

  const result = stochasticGd(
    lossOnSample,
    gradOnSample,
    initParams,
    demoSamples,
    { lr, maxEpoch, tol },
    hooks,
  );

  rec
    .begin({
      zh: result.converged
        ? `收敛：w=${result.params[0]!.toFixed(3)} b=${result.params[1]!.toFixed(3)}（真值 2, 1）`
        : `结束：w=${result.params[0]!.toFixed(3)} b=${result.params[1]!.toFixed(3)}`,
      en: result.converged
        ? `Converged: w=${result.params[0]!.toFixed(3)} b=${result.params[1]!.toFixed(3)} (truth 2, 1)`
        : `Done: w=${result.params[0]!.toFixed(3)} b=${result.params[1]!.toFixed(3)}`,
    })
    .setAux([
      { label: 'w', value: result.params[0]!.toFixed(4), role: 'final' as BarRole },
      { label: 'b', value: result.params[1]!.toFixed(4), role: 'final' as BarRole },
    ])
    .commit();

  return rec.build();
}
