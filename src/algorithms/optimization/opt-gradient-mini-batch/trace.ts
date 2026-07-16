// =============================================================================
// 小批量梯度下降 · 录制帧序列
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { miniBatchGradientDescent, type MiniBatchGDHooks, type Sample } from './impl.ts';

export const DEFAULT_INPUT = {
  samples: [
    { x: 1, y: 3 },
    { x: 2, y: 5 },
    { x: 3, y: 7 },
    { x: 4, y: 9 },
    { x: 5, y: 11 },
    { x: 6, y: 13 },
  ] as Sample[],
  initParams: [0, 0],
  lr: 0.05,
  batchSize: 2,
  epochs: 30,
};

export function buildTrace(input: typeof DEFAULT_INPUT = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();

  rec
    .begin({
      zh: `小批量 GD：batchSize=${input.batchSize}`,
      en: `Mini-Batch GD: batchSize=${input.batchSize}`,
    })
    .setAux([
      { label: 'lr', value: String(input.lr), role: 'pivot' as BarRole },
      { label: 'batch', value: String(input.batchSize), role: 'compare' as BarRole },
      { label: 'w', value: String(input.initParams[0]) },
      { label: 'b', value: String(input.initParams[1]) },
    ])
    .commit();

  const hooks: MiniBatchGDHooks = {
    onEpochEnd: (epoch, params, loss) => {
      rec
        .begin({
          zh: `epoch ${epoch}：loss=${loss.toFixed(5)}`,
          en: `epoch ${epoch}: loss=${loss.toFixed(5)}`,
        })
        .setAux([
          { label: 'epoch', value: String(epoch), role: 'pivot' as BarRole },
          { label: 'w', value: params[0]!.toFixed(4), role: 'compare' as BarRole },
          { label: 'b', value: params[1]!.toFixed(4), role: 'compare' as BarRole },
          { label: 'loss', value: loss.toFixed(6), role: 'final' as BarRole },
        ])
        .commit();
    },
  };

  const result = miniBatchGradientDescent(
    input.samples,
    input.initParams,
    input.lr,
    input.batchSize,
    input.epochs,
    1,
    hooks,
  );

  rec
    .begin({
      zh: `结束：w=${result.params[0]!.toFixed(4)}, b=${result.params[1]!.toFixed(4)}`,
      en: `Done: w=${result.params[0]!.toFixed(4)}, b=${result.params[1]!.toFixed(4)}`,
    })
    .setAux([
      { label: 'w', value: result.params[0]!.toFixed(4), role: 'final' as BarRole },
      { label: 'b', value: result.params[1]!.toFixed(4), role: 'final' as BarRole },
      { label: 'loss', value: result.loss.toFixed(6), role: 'final' as BarRole },
    ])
    .commit();
  return rec.build();
}
