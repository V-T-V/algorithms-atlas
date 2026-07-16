// =============================================================================
// AMSGrad · 录制帧序列
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { amsGrad, type AmsGradHooks } from './impl.ts';

export const DEFAULT_INPUT = {
  initParams: [0, 0],
  lr: 0.1,
  beta1: 0.9,
  beta2: 0.999,
  eps: 1e-8,
  maxIter: 80,
  tol: 1e-6,
};

export function buildTrace(input: typeof DEFAULT_INPUT = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { initParams, lr, beta1, beta2, eps, maxIter, tol } = input;

  rec
    .begin({
      zh: `AMSGrad：lr=${lr}, β1=${beta1}, β2=${beta2}`,
      en: `AMSGrad: lr=${lr}, β1=${beta1}, β2=${beta2}`,
    })
    .setAux([
      { label: 'lr', value: String(lr), role: 'pivot' as BarRole },
      { label: 'β1', value: String(beta1) },
      { label: 'β2', value: String(beta2) },
    ])
    .commit();

  const hooks: AmsGradHooks = {
    onIter: (t, params, vHat, value) => {
      rec
        .begin({ zh: `iter ${t}：f=${value.toFixed(6)}`, en: `iter ${t}: f=${value.toFixed(6)}` })
        .setAux([
          { label: 'iter', value: String(t), role: 'pivot' as BarRole },
          { label: 'x', value: params[0]!.toFixed(4), role: 'compare' as BarRole },
          { label: 'y', value: params[1]!.toFixed(4), role: 'compare' as BarRole },
          { label: 'v̂x', value: vHat[0]!.toFixed(4) },
          { label: 'f', value: value.toFixed(6), role: 'final' as BarRole },
        ])
        .commit();
    },
  };

  const result = amsGrad(initParams, lr, beta1, beta2, eps, maxIter, tol, hooks);

  rec
    .begin({
      zh: result.converged
        ? `收敛于 (${result.params[0]!.toFixed(3)}, ${result.params[1]!.toFixed(3)})`
        : `结束于 (${result.params[0]!.toFixed(3)}, ${result.params[1]!.toFixed(3)})`,
      en: result.converged
        ? `Converged at (${result.params[0]!.toFixed(3)}, ${result.params[1]!.toFixed(3)})`
        : `Stopped at (${result.params[0]!.toFixed(3)}, ${result.params[1]!.toFixed(3)})`,
    })
    .setAux([
      { label: 'x', value: result.params[0]!.toFixed(4), role: 'final' as BarRole },
      { label: 'y', value: result.params[1]!.toFixed(4), role: 'final' as BarRole },
      { label: 'f', value: result.value.toFixed(6), role: 'final' as BarRole },
    ])
    .commit();
  return rec.build();
}
