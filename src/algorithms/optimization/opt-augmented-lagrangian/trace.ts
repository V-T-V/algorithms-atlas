// =============================================================================
// 增广拉格朗日法 · 录制帧序列
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { augmentedLagrangian, type ALHooks, type Vec } from './impl.ts';

// min (x-3)^2 + (y-2)^2  s.t. h: x + y - 4 = 0
// 无约束解 (3,2) 不满足约束；最优 (2.5, 1.5)
// KKT: 2(x-3)=λ, 2(y-2)=λ, x+y=4 → x-3=y-2 → x=y+1, 2y+1=4 → y=1.5, x=2.5
export const DEFAULT_INPUT: { x0: Vec } = {
  x0: [0, 0],
};

const fObj = (x: Vec): number => (x[0]! - 3) ** 2 + (x[1]! - 2) ** 2;
const gradObj = (x: Vec): Vec => [2 * (x[0]! - 3), 2 * (x[1]! - 2)];
const H = [(x: Vec): number => x[0]! + x[1]! - 4];
const gradH = [(): Vec => [1, 1]];

export function buildTrace(input: typeof DEFAULT_INPUT = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { x0 } = input;

  rec
    .begin({
      zh: `初值 x0=(${x0.join(',')})，μ₀=10，λ₀=0`,
      en: `Init x0=(${x0.join(',')}), μ₀=10, λ₀=0`,
    })
    .setAux([
      { label: 'x', value: x0[0]!.toFixed(3), role: 'pivot' as BarRole },
      { label: 'y', value: x0[1]!.toFixed(3), role: 'pivot' as BarRole },
      { label: 'f(x)', value: fObj(x0).toFixed(4), role: 'compare' as BarRole },
      { label: 'μ₀', value: '10', role: 'final' as BarRole },
    ])
    .commit();

  const hooks: ALHooks = {
    onOuter: (mu, lambda, x, fval, viol) => {
      rec
        .begin({
          zh: `μ=${mu.toFixed(2)}，λ=${lambda[0]!.toFixed(3)}：(${x[0]!.toFixed(3)},${x[1]!.toFixed(3)})，违反=${viol.toExponential(2)}`,
          en: `μ=${mu.toFixed(2)}, λ=${lambda[0]!.toFixed(3)}: (${x[0]!.toFixed(3)},${x[1]!.toFixed(3)}), viol=${viol.toExponential(2)}`,
        })
        .setAux([
          { label: 'μ', value: mu.toFixed(2), role: 'pivot' as BarRole },
          { label: 'λ', value: lambda[0]!.toFixed(4), role: 'compare' as BarRole },
          { label: 'x', value: x[0]!.toFixed(4), role: 'compare' as BarRole },
          { label: 'y', value: x[1]!.toFixed(4), role: 'compare' as BarRole },
          { label: 'f', value: fval.toFixed(4), role: 'final' as BarRole },
          { label: 'viol', value: viol.toExponential(2), role: 'warn' as BarRole },
        ])
        .commit();
    },
  };

  const result = augmentedLagrangian(
    fObj,
    gradObj,
    H,
    gradH,
    x0,
    { mu0: 10, beta: 5, eps: 1e-7, innerLr: 0.02 },
    hooks,
  );

  rec
    .begin({
      zh: result.converged
        ? `收敛 (${result.x[0]!.toFixed(4)},${result.x[1]!.toFixed(4)})，f=${result.fval.toFixed(4)}，λ=${result.lambda[0]!.toFixed(3)}`
        : `结束 (${result.x[0]!.toFixed(4)},${result.x[1]!.toFixed(4)})`,
      en: result.converged
        ? `Converged (${result.x[0]!.toFixed(4)},${result.x[1]!.toFixed(4)}), f=${result.fval.toFixed(4)}, λ=${result.lambda[0]!.toFixed(3)}`
        : `Stopped (${result.x[0]!.toFixed(4)},${result.x[1]!.toFixed(4)})`,
    })
    .setAux([
      { label: 'x*', value: result.x[0]!.toFixed(4), role: 'final' as BarRole },
      { label: 'y*', value: result.x[1]!.toFixed(4), role: 'final' as BarRole },
      { label: 'f*', value: result.fval.toFixed(4), role: 'final' as BarRole },
      { label: 'λ*', value: result.lambda[0]!.toFixed(4), role: 'pivot' as BarRole },
      { label: 'viol', value: result.violation.toExponential(2), role: 'warn' as BarRole },
    ])
    .commit();

  return rec.build();
}
