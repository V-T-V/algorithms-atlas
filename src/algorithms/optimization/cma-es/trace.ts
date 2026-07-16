// CMA-ES · 录制帧序列
// 用 setBars 展示当代子代的目标值（升序），setAux 展示均值、步长 σ、最优解。

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { cmaEs, demoFunc, demoBounds, type CMAHooks } from './impl.ts';

export const DEFAULT_INPUT = { lambda: 8, sigma0: 3, maxGen: 80, tol: 1e-12 };

export function buildTrace(
  input: { sigma0?: number; lambda?: number; maxGen?: number; tol?: number; seed?: number } = {},
): Frame[] {
  const { lambda = 8, sigma0 = 3, maxGen = 80, tol = 1e-12, seed = 42 } = input;
  const rec = new TraceRecorder();

  const snapshot = (
    note: { zh: string; en: string },
    gen: number,
    best: { x: number[]; fx: number },
    mean: number[],
    sigma: number,
  ) => {
    rec
      .begin(note)
      .setAux([
        { label: '代 / gen', value: String(gen), role: 'pivot' as BarRole },
        { label: 'mean x', value: mean[0]!.toFixed(4), role: 'compare' as BarRole },
        { label: 'mean y', value: mean[1]!.toFixed(4), role: 'compare' as BarRole },
        { label: 'σ (步长)', value: sigma.toFixed(4), role: 'default' as BarRole },
        { label: 'best x', value: best.x[0]!.toFixed(4), role: 'default' as BarRole },
        { label: 'best y', value: best.x[1]!.toFixed(4), role: 'default' as BarRole },
        { label: 'f(best)', value: best.fx.toFixed(6), role: 'final' as BarRole },
      ])
      .commit();
  };

  snapshot(
    { zh: '初始分布 N(中心, σ²·C)，C=I', en: 'Initial N(center, σ²·C), C=I' },
    0,
    { x: [0, 0], fx: demoFunc([0, 0]) },
    [0, 0],
    sigma0,
  );

  const hooks: CMAHooks = {
    onGeneration: (gen, best, mean, sigma) => {
      snapshot(
        {
          zh: `第 ${gen} 代：f=${best.fx.toExponential(2)}，σ=${sigma.toFixed(3)}，协方差学习问题几何`,
          en: `Gen ${gen}: f=${best.fx.toExponential(2)}, σ=${sigma.toFixed(3)}, C learns problem geometry`,
        },
        gen,
        best,
        mean,
        sigma,
      );
    },
  };

  const result = cmaEs(demoFunc, demoBounds, { lambda, sigma0, maxGen, tol, seed }, hooks);

  rec
    .begin({
      zh: result.converged
        ? `收敛于 (${result.params[0]!.toFixed(3)}, ${result.params[1]!.toFixed(3)})，${result.generations} 代`
        : `结束于 (${result.params[0]!.toFixed(3)}, ${result.params[1]!.toFixed(3)})，${result.generations} 代`,
      en: result.converged
        ? `Converged at (${result.params[0]!.toFixed(3)}, ${result.params[1]!.toFixed(3)}) in ${result.generations} gens`
        : `Done at (${result.params[0]!.toFixed(3)}, ${result.params[1]!.toFixed(3)}) in ${result.generations} gens`,
    })
    .setAux([
      { label: 'x', value: result.params[0]!.toFixed(4), role: 'final' as BarRole },
      { label: 'y', value: result.params[1]!.toFixed(4), role: 'final' as BarRole },
    ])
    .commit();

  return rec.build();
}
