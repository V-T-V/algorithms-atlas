// =============================================================================
// Nesterov 加速梯度 · 录制帧序列
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { nesterovAcceleratedGradient, type NesterovHooks } from './impl.ts';

export const DEFAULT_INPUT = { initParams: [0, 0], lr: 0.1, momentum: 0.9, maxIter: 50, tol: 1e-6 };

export function buildTrace(input: typeof DEFAULT_INPUT = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { initParams, lr, momentum, maxIter, tol } = input;

  rec
    .begin({
      zh: `初始 (${initParams[0]},${initParams[1]})，目标 (3,-1)`,
      en: `Init (${initParams[0]},${initParams[1]}), target (3,-1)`,
    })
    .setAux([
      { label: 'lr', value: String(lr), role: 'pivot' as BarRole },
      { label: 'momentum', value: String(momentum), role: 'compare' as BarRole },
    ])
    .commit();

  const hooks: NesterovHooks = {
    onIter: (iter, params, velocity, lookAhead, value) => {
      rec
        .begin({
          zh: `iter ${iter}：f=${value.toFixed(6)}`,
          en: `iter ${iter}: f=${value.toFixed(6)}`,
        })
        .setAux([
          { label: 'iter', value: String(iter), role: 'pivot' as BarRole },
          { label: 'x', value: params[0]!.toFixed(4), role: 'compare' as BarRole },
          { label: 'y', value: params[1]!.toFixed(4), role: 'compare' as BarRole },
          { label: 'lookX', value: lookAhead[0]!.toFixed(4) },
          { label: 'lookY', value: lookAhead[1]!.toFixed(4) },
          { label: 'vx', value: velocity[0]!.toFixed(4) },
          { label: 'f', value: value.toFixed(6), role: 'final' as BarRole },
        ])
        .commit();
    },
  };

  const result = nesterovAcceleratedGradient(initParams, lr, momentum, maxIter, tol, hooks);

  rec
    .begin({
      zh: result.converged
        ? `收敛于 (${result.params[0]!.toFixed(3)}, ${result.params[1]!.toFixed(3)})，${result.iterations} 步`
        : `结束于 (${result.params[0]!.toFixed(3)}, ${result.params[1]!.toFixed(3)})`,
      en: result.converged
        ? `Converged at (${result.params[0]!.toFixed(3)}, ${result.params[1]!.toFixed(3)}) in ${result.iterations} steps`
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
