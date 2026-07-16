// =============================================================================
// 障碍（内点）法 · 录制帧序列
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { barrierMethod, type BarrierHooks, type Constraint, type Vec } from './impl.ts';

// 示例问题：min (x-4)^2 + (y-2)^2
// s.t.  x + y ≤ 4   (即原问题最优在 (3,1) 附近因约束激活)
//       0 ≤ x, 0 ≤ y （以 -x ≤ 0, -y ≤ 0 表示）
export const DEFAULT_INPUT: {
  x0: Vec;
  con: Constraint;
} = {
  x0: [1, 0.5],
  con: {
    A: [
      [1, 1],
      [-1, 0],
      [0, -1],
    ],
    b: [4, 0, 0],
  },
};

const fObj = (x: Vec): number => (x[0]! - 4) ** 2 + (x[1]! - 2) ** 2;
const gradObj = (x: Vec): Vec => [2 * (x[0]! - 4), 2 * (x[1]! - 2)];
const hessObj = (_x: Vec): number[][] => [
  [2, 0],
  [0, 2],
];

export function buildTrace(input: typeof DEFAULT_INPUT = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { x0, con } = input;

  rec
    .begin({
      zh: `严格内点 x0=(${x0.join(',')})，约束数 ${con.A.length}`,
      en: `Strict interior start x0=(${x0.join(',')}), ${con.A.length} constraints`,
    })
    .setAux([
      { label: 'x', value: x0[0]!.toFixed(3), role: 'pivot' as BarRole },
      { label: 'y', value: x0[1]!.toFixed(3), role: 'pivot' as BarRole },
      { label: 'f(x)', value: fObj(x0).toFixed(4), role: 'compare' as BarRole },
      { label: 'μ₀', value: '1.0', role: 'final' as BarRole },
    ])
    .commit();

  const hooks: BarrierHooks = {
    onOuter: (mu, x, fval, slackMin) => {
      rec
        .begin({
          zh: `μ=${mu.toExponential(2)}：中心路径点 (${x[0]!.toFixed(3)},${x[1]!.toFixed(3)})，最小松弛 ${slackMin.toFixed(3)}`,
          en: `μ=${mu.toExponential(2)}: central path point (${x[0]!.toFixed(3)},${x[1]!.toFixed(3)}), min slack ${slackMin.toFixed(3)}`,
        })
        .setAux([
          { label: 'μ', value: mu.toExponential(2), role: 'pivot' as BarRole },
          { label: 'x', value: x[0]!.toFixed(4), role: 'compare' as BarRole },
          { label: 'y', value: x[1]!.toFixed(4), role: 'compare' as BarRole },
          { label: 'f', value: fval.toFixed(4), role: 'final' as BarRole },
          { label: 'min slack', value: slackMin.toFixed(4), role: 'warn' as BarRole },
        ])
        .commit();
    },
  };

  const result = barrierMethod(
    fObj,
    gradObj,
    hessObj,
    con,
    x0,
    { mu0: 1, tau: 0.2, eps: 1e-8 },
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
      { label: 'μ_final', value: result.muFinal.toExponential(2), role: 'pivot' as BarRole },
      { label: 'outer', value: String(result.outerIter), role: 'sorted' as BarRole },
    ])
    .commit();

  return rec.build();
}
