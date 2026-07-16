// =============================================================================
// 罚函数法 · 录制帧序列
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { penaltyMethod, type PenaltyHooks, type Vec } from './impl.ts';

// min (x-4)^2 + (y-2)^2  s.t. g₁ = x+y-4 ≤ 0, g₂ = -x ≤ 0, g₃ = -y ≤ 0
export const DEFAULT_INPUT: { x0: Vec } = {
  x0: [0, 0], // 不可行也无妨
};

const fObj = (x: Vec): number => (x[0]! - 4) ** 2 + (x[1]! - 2) ** 2;
const gradObj = (x: Vec): Vec => [2 * (x[0]! - 4), 2 * (x[1]! - 2)];
const G = [
  (x: Vec): number => x[0]! + x[1]! - 4,
  (x: Vec): number => -x[0]!,
  (x: Vec): number => -x[1]!,
];
const gradG = [(_x: Vec): Vec => [1, 1], (_x: Vec): Vec => [-1, 0], (_x: Vec): Vec => [0, -1]];

export function buildTrace(input: typeof DEFAULT_INPUT = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { x0 } = input;

  rec
    .begin({
      zh: `初值 x0=(${x0.join(',')})，罚参数 μ₀=1`,
      en: `Init x0=(${x0.join(',')}), μ₀=1`,
    })
    .setAux([
      { label: 'x', value: x0[0]!.toFixed(3), role: 'pivot' as BarRole },
      { label: 'y', value: x0[1]!.toFixed(3), role: 'pivot' as BarRole },
      { label: 'f(x)', value: fObj(x0).toFixed(4), role: 'compare' as BarRole },
      { label: 'μ₀', value: '1', role: 'final' as BarRole },
    ])
    .commit();

  const hooks: PenaltyHooks = {
    onOuter: (mu, x, fval, viol) => {
      rec
        .begin({
          zh: `μ=${mu.toExponential(2)}：(${x[0]!.toFixed(3)},${x[1]!.toFixed(3)})，违反量=${viol.toExponential(2)}`,
          en: `μ=${mu.toExponential(2)}: (${x[0]!.toFixed(3)},${x[1]!.toFixed(3)}), violation=${viol.toExponential(2)}`,
        })
        .setAux([
          { label: 'μ', value: mu.toExponential(2), role: 'pivot' as BarRole },
          { label: 'x', value: x[0]!.toFixed(4), role: 'compare' as BarRole },
          { label: 'y', value: x[1]!.toFixed(4), role: 'compare' as BarRole },
          { label: 'f', value: fval.toFixed(4), role: 'final' as BarRole },
          { label: 'violation', value: viol.toExponential(2), role: 'warn' as BarRole },
        ])
        .commit();
    },
  };

  const result = penaltyMethod(
    fObj,
    gradObj,
    G,
    gradG,
    x0,
    { mu0: 1, beta: 10, eps: 1e-6, innerLr: 0.02, innerMaxIter: 300 },
    hooks,
  );

  rec
    .begin({
      zh: result.converged
        ? `收敛 (${result.x[0]!.toFixed(4)},${result.x[1]!.toFixed(4)})，f=${result.fval.toFixed(4)}，μ=${result.muFinal.toExponential(2)}`
        : `结束 (${result.x[0]!.toFixed(4)},${result.x[1]!.toFixed(4)})，f=${result.fval.toFixed(4)}`,
      en: result.converged
        ? `Converged (${result.x[0]!.toFixed(4)},${result.x[1]!.toFixed(4)}), f=${result.fval.toFixed(4)}, μ=${result.muFinal.toExponential(2)}`
        : `Stopped (${result.x[0]!.toFixed(4)},${result.x[1]!.toFixed(4)}), f=${result.fval.toFixed(4)}`,
    })
    .setAux([
      { label: 'x*', value: result.x[0]!.toFixed(4), role: 'final' as BarRole },
      { label: 'y*', value: result.x[1]!.toFixed(4), role: 'final' as BarRole },
      { label: 'f*', value: result.fval.toFixed(4), role: 'final' as BarRole },
      { label: 'viol', value: result.violation.toExponential(2), role: 'warn' as BarRole },
      { label: 'outer', value: String(result.outerIter), role: 'sorted' as BarRole },
    ])
    .commit();

  return rec.build();
}
