// =============================================================================
// L-BFGS · 录制帧序列
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { lbfgs, type LBFGSHooks } from './impl.ts';

// 演示：Rosenbrock 函数 f(x,y) = (1-x)^2 + 100(y-x^2)^2，最小点 (1,1)
export const DEFAULT_INPUT = {
  f: (x: number[]): number => (1 - x[0]!) ** 2 + 100 * (x[1]! - x[0]! ** 2) ** 2,
  g: (x: number[]): number[] => [
    -2 * (1 - x[0]!) - 400 * x[0]! * (x[1]! - x[0]! ** 2),
    200 * (x[1]! - x[0]! ** 2),
  ],
  x0: [-1.2, 1],
};

export function buildTrace(input: typeof DEFAULT_INPUT = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { f, g, x0 } = input;

  rec
    .begin({
      zh: `L-BFGS 最小化 Rosenbrock 函数，初始 (${x0.join(',')})，最优 (1,1)。`,
      en: `L-BFGS on Rosenbrock, init (${x0.join(',')}), optimum (1,1).`,
    })
    .setAux([
      { label: '初始点', value: `(${x0.join(',')})`, role: 'frontier' as BarRole },
      { label: '初始值', value: f(x0).toFixed(6), role: 'pivot' as BarRole },
    ])
    .commit();

  const hooks: LBFGSHooks = {
    onIter: (iter, x, grad, value, step) => {
      rec
        .begin({
          zh: `iter ${iter}：x=(${x.map((v) => v.toFixed(4)).join(',')}), f=${value.toFixed(6)}, 步长 ${step.toFixed(4)}`,
          en: `iter ${iter}: x=(${x.map((v) => v.toFixed(4)).join(',')}), f=${value.toFixed(6)}, step ${step.toFixed(4)}`,
        })
        .setAux([
          { label: 'iter', value: String(iter), role: 'pivot' as BarRole },
          {
            label: 'x',
            value: `(${x.map((v) => v.toFixed(4)).join(',')})`,
            role: 'compare' as BarRole,
          },
          { label: 'f', value: value.toFixed(6), role: 'final' as BarRole },
          { label: '|g|', value: Math.hypot(...grad).toFixed(6), role: 'frontier' as BarRole },
          { label: '步长', value: step.toFixed(4) },
        ])
        .commit();
    },
  };

  const result = lbfgs(f, g, x0, { maxIter: 100, tol: 1e-8, m: 10 }, hooks);

  rec
    .begin({
      zh: result.converged
        ? `收敛：x=(${result.x.map((v) => v.toFixed(4)).join(',')}), f=${result.value.toFixed(8)}（${result.iterations} 步）`
        : `结束：x=(${result.x.map((v) => v.toFixed(4)).join(',')})`,
      en: result.converged
        ? `Converged: x=(${result.x.map((v) => v.toFixed(4)).join(',')}), f=${result.value.toFixed(8)} (${result.iterations} iters)`
        : `Stopped: x=(${result.x.map((v) => v.toFixed(4)).join(',')})`,
    })
    .setAux([
      {
        label: 'x',
        value: `(${result.x.map((v) => v.toFixed(6)).join(',')})`,
        role: 'final' as BarRole,
      },
      { label: 'f', value: result.value.toFixed(8), role: 'final' as BarRole },
      { label: '迭代', value: String(result.iterations), role: 'compare' as BarRole },
    ])
    .commit();

  return rec.build();
}
