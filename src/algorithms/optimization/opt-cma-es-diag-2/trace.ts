// opt-cma-es-diag-2 · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { optCmaEsDiag2, demoFunc, demoGrad } from './impl.ts';

export const DEFAULT_INPUT = { initParams: [0, 0], sigma: 1.0, maxIter: 80, tol: 1e-10 };

export function buildTrace(
  input: { initParams?: number[]; sigma?: number; maxIter?: number; tol?: number } = {},
): Frame[] {
  const { initParams = [0, 0], sigma = 1.0, maxIter = 80, tol = 1e-10 } = input;
  const rec = new TraceRecorder();

  rec
    .begin({ zh: '初始 (0,0)', en: 'Init (0,0)' })
    .setAux([
      { label: 'gen', value: '0', role: 'pivot' as BarRole },
      { label: 'x', value: initParams[0]!.toFixed(4), role: 'compare' as BarRole },
      { label: 'y', value: initParams[1]!.toFixed(4), role: 'compare' as BarRole },
      { label: 'f(x,y)', value: demoFunc(initParams).toFixed(6), role: 'final' as BarRole },
    ])
    .commit();

  const result = optCmaEsDiag2(
    demoFunc,
    demoGrad,
    initParams,
    { sigma, maxIter, tol },
    {
      onGen: (gen, mean, s) =>
        rec
          .begin({ zh: `第 ${gen} 代，σ=${s.toFixed(3)}`, en: `gen ${gen}, sigma=${s.toFixed(3)}` })
          .setAux([
            { label: 'gen', value: String(gen), role: 'pivot' as BarRole },
            { label: 'x', value: mean[0]!.toFixed(4), role: 'compare' as BarRole },
            { label: 'y', value: mean[1]!.toFixed(4), role: 'compare' as BarRole },
          ])
          .commit(),
    },
  );

  rec
    .begin({
      zh: result.converged
        ? `收敛于 (${result.params[0]!.toFixed(3)}, ${result.params[1]!.toFixed(3)})，${result.iterations} 步`
        : `未收敛（${result.iterations} 步）`,
      en: result.converged
        ? `Converged at (${result.params[0]!.toFixed(3)}, ${result.params[1]!.toFixed(3)}) in ${result.iterations} steps`
        : `Not converged (${result.iterations} steps)`,
    })
    .setAux([
      { label: 'x', value: result.params[0]!.toFixed(4), role: 'final' as BarRole },
      { label: 'y', value: result.params[1]!.toFixed(4), role: 'final' as BarRole },
    ])
    .commit();

  return rec.build();
}
