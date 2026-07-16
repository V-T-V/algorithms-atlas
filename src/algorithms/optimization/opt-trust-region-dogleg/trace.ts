// =============================================================================
// 信赖域 Dogleg · 录制帧序列
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { trustRegionDogleg, type DoglegHooks, type Vec } from './impl.ts';

// 目标 f(x,y) = (x-1)² + 2(y-2)²，最优 (1,2)
export const DEFAULT_INPUT = {
  f: (x: Vec): number => (x[0]! - 1) ** 2 + 2 * (x[1]! - 2) ** 2,
  x0: [5, 5],
};

export function buildTrace(input: typeof DEFAULT_INPUT = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { f, x0 } = input;

  rec
    .begin({
      zh: `信赖域 Dogleg 最小化目标，初始 (${x0.join(',')})，Δ₀=1。`,
      en: `Trust-region Dogleg minimizing objective, init (${x0.join(',')}), Δ₀=1.`,
    })
    .setAux([
      { label: '初始点', value: `(${x0.join(',')})`, role: 'frontier' as BarRole },
      { label: '初始值', value: f(x0).toFixed(6), role: 'pivot' as BarRole },
      { label: '初始 Δ', value: '1', role: 'compare' as BarRole },
    ])
    .commit();

  const hooks: DoglegHooks = {
    onIter: (iter, x, p, stepType, radius, rho) => {
      rec
        .begin({
          zh: `iter ${iter}：x=(${x.map((v) => v.toFixed(4)).join(',')}), 步类型=${stepType}, Δ=${radius.toFixed(3)}, ρ=${rho.toFixed(3)}`,
          en: `iter ${iter}: x=(${x.map((v) => v.toFixed(4)).join(',')}), step=${stepType}, Δ=${radius.toFixed(3)}, ρ=${rho.toFixed(3)}`,
        })
        .setAux([
          { label: 'iter', value: String(iter), role: 'pivot' as BarRole },
          {
            label: 'x',
            value: `(${x.map((v) => v.toFixed(4)).join(',')})`,
            role: 'compare' as BarRole,
          },
          { label: 'Δ', value: radius.toFixed(4), role: 'frontier' as BarRole },
          { label: 'ρ', value: rho.toFixed(4), role: 'final' as BarRole },
          { label: '步类型', value: stepType, role: 'compare' as BarRole },
        ])
        .commit();
    },
  };

  const result = trustRegionDogleg(f, x0, { maxIter: 100, initRadius: 1, tol: 1e-6 }, hooks);

  rec
    .begin({
      zh: result.converged
        ? `收敛：x=(${result.x.map((v) => v.toFixed(6)).join(',')}), f=${result.value.toFixed(8)}（${result.iterations} 步）`
        : `结束：x=(${result.x.map((v) => v.toFixed(6)).join(',')})`,
      en: result.converged
        ? `Converged: x=(${result.x.map((v) => v.toFixed(6)).join(',')}), f=${result.value.toFixed(8)} (${result.iterations} iters)`
        : `Stopped: x=(${result.x.map((v) => v.toFixed(6)).join(',')})`,
    })
    .setAux([
      {
        label: 'x',
        value: `(${result.x.map((v) => v.toFixed(6)).join(',')})`,
        role: 'final' as BarRole,
      },
      { label: 'f', value: result.value.toFixed(8), role: 'final' as BarRole },
      { label: '终 Δ', value: result.radius.toFixed(4), role: 'compare' as BarRole },
      { label: '迭代', value: String(result.iterations), role: 'compare' as BarRole },
    ])
    .commit();

  return rec.build();
}
