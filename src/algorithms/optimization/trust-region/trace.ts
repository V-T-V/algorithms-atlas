// =============================================================================
// 信赖域方法 · 录制帧序列
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { trustRegion, rosenbrock, type TrustRegionHooks } from './impl.ts';

export const DEFAULT_INPUT = { init: [-1.2, 1], maxIter: 100 };

export function buildTrace(input: { init?: number[]; maxIter?: number } = {}): Frame[] {
  const rec = new TraceRecorder();
  const { init = [-1.2, 1], maxIter = 100 } = input;

  rec
    .begin({ zh: `初值 [${init.join(', ')}]，Δ₀=1`, en: `Init [${init.join(', ')}], Δ₀=1` })
    .setBars([
      { value: init[0]!, role: 'compare' as BarRole, label: 'x' },
      { value: init[1]!, role: 'compare' as BarRole, label: 'y' },
      { value: rosenbrock(init), role: 'final' as BarRole, label: 'f' },
    ])
    .commit();

  const hooks: TrustRegionHooks = {
    onIteration: (iter, x, radius, value, rho) => {
      if (iter % 5 === 0 || iter < 3) {
        rec
          .begin({
            zh: `迭代 ${iter + 1}：x=[${x.map((v) => v.toFixed(3)).join(', ')}]，Δ=${radius.toExponential(2)}，ρ=${rho.toFixed(2)}`,
            en: `Iter ${iter + 1}: x=[${x.map((v) => v.toFixed(3)).join(', ')}], Δ=${radius.toExponential(2)}, ρ=${rho.toFixed(2)}`,
          })
          .setBars([
            { value: x[0]!, role: 'compare' as BarRole, label: 'x' },
            { value: x[1]!, role: 'compare' as BarRole, label: 'y' },
            { value: radius, role: 'frontier' as BarRole, label: 'Δ' },
            { value: value, role: 'final' as BarRole, label: 'f' },
          ])
          .setAux([
            { label: 'ρ', value: rho.toFixed(3), role: 'pivot' as BarRole },
            { label: 'Δ', value: radius.toExponential(2), role: 'frontier' as BarRole },
          ])
          .commit();
      }
    },
  };

  const result = trustRegion(rosenbrock, init, { maxIterations: maxIter }, hooks);

  rec
    .begin({
      zh: result.converged
        ? `收敛：x=[${result.x.map((v) => v.toFixed(3)).join(', ')}]，f=${result.value.toExponential(3)}，${result.iterations} 迭代`
        : `完成：${result.iterations} 迭代`,
      en: result.converged
        ? `Converged: x=[${result.x.map((v) => v.toFixed(3)).join(', ')}], f=${result.value.toExponential(3)}, ${result.iterations} iters`
        : `Done: ${result.iterations} iters`,
    })
    .setBars(
      result.x.map((v, i) => ({
        value: v,
        role: 'final' as BarRole,
        label: `${i === 0 ? 'x' : 'y'}=${v.toFixed(2)}`,
      })),
    )
    .setAux([
      { label: 'f*', value: result.value.toExponential(3), role: 'final' as BarRole },
      { label: 'Δ', value: result.radius.toExponential(2), role: 'frontier' as BarRole },
    ])
    .commit();

  return rec.build();
}
