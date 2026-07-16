// =============================================================================
// 自适应 Nelder-Mead · 录制帧序列
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { adaptiveNelderMead, rosenbrock, adaptiveCoeffs, type AdaptiveNMHooks } from './impl.ts';

export const DEFAULT_INPUT = { init: [-1.2, 1], maxIter: 300, tol: 1e-12 };

export function buildTrace(
  input: { init?: number[]; maxIter?: number; tol?: number; initStep?: number } = {},
): Frame[] {
  const { init = [-1.2, 1], maxIter = 300, tol = 1e-12, initStep = 0.5 } = input;
  const rec = new TraceRecorder();
  const coeffs = adaptiveCoeffs(init.length);

  const snapshot = (
    note: { zh: string; en: string },
    iter: number,
    best: { x: number[]; fx: number },
    simplex: Array<{ x: number[]; fx: number }>,
  ) => {
    rec
      .begin(note)
      .setBars(
        simplex.map((p, i) => ({
          value: p.fx,
          role: (i === 0 ? 'final' : i === simplex.length - 1 ? 'warn' : 'compare') as BarRole,
          label: `(${p.x[0]!.toFixed(1)},${p.x[1]!.toFixed(1)})`,
        })),
      )
      .setAux([
        { label: '迭代', value: String(iter), role: 'pivot' as BarRole },
        { label: 'x', value: best.x[0]!.toFixed(4), role: 'compare' as BarRole },
        { label: 'y', value: best.x[1]!.toFixed(4), role: 'compare' as BarRole },
        { label: 'f', value: best.fx.toFixed(6), role: 'final' as BarRole },
        { label: 'γ(扩张)', value: coeffs.gamma.toFixed(3), role: 'frontier' as BarRole },
      ])
      .commit();
  };

  snapshot(
    {
      zh: `初始单纯形（自适应系数 γ=${coeffs.gamma.toFixed(2)} ρ=${coeffs.rho.toFixed(2)} σ=${coeffs.sigma.toFixed(2)}）`,
      en: `Initial simplex (adaptive γ=${coeffs.gamma.toFixed(2)} ρ=${coeffs.rho.toFixed(2)} σ=${coeffs.sigma.toFixed(2)})`,
    },
    0,
    { x: init, fx: rosenbrock(init) },
    [
      { x: init, fx: rosenbrock(init) },
      { x: [init[0]! + initStep, init[1]!], fx: rosenbrock([init[0]! + initStep, init[1]!]) },
      { x: [init[0]!, init[1]! + initStep], fx: rosenbrock([init[0]!, init[1]! + initStep]) },
    ],
  );

  const hooks: AdaptiveNMHooks = {
    onIter: (iter, best, simplex) => {
      if (iter % 5 === 0 || iter <= 3) {
        snapshot(
          {
            zh: `迭代 ${iter}：f=${best.fx.toExponential(3)}`,
            en: `Iter ${iter}: f=${best.fx.toExponential(3)}`,
          },
          iter,
          best,
          simplex,
        );
      }
    },
  };

  const result = adaptiveNelderMead(rosenbrock, init, { maxIter, tol, initStep }, hooks);

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
      { label: 'f', value: result.value.toExponential(3), role: 'final' as BarRole },
    ])
    .commit();

  return rec.build();
}
