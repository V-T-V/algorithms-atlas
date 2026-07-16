// =============================================================================
// Levenberg-Marquardt · 录制帧序列
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { levenbergMarquardt, type LMHooks, type Mat, type Vec } from './impl.ts';

const TRUE_A = 2;
const TRUE_B = 0.5;
const DATA: Array<{ t: number; y: number }> = [0, 1, 2, 3, 4].map((t) => ({
  t,
  y: TRUE_A * Math.exp(TRUE_B * t),
}));

export const DEFAULT_INPUT = {
  residual: (x: Vec): Vec => DATA.map((d) => x[0]! * Math.exp(x[1]! * d.t) - d.y),
  jacobian: (x: Vec): Mat =>
    DATA.map((d) => [Math.exp(x[1]! * d.t), x[0]! * d.t * Math.exp(x[1]! * d.t)]),
  x0: [1, 0.1],
};

export function buildTrace(input: typeof DEFAULT_INPUT = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { residual, jacobian, x0 } = input;

  rec
    .begin({
      zh: `LM 拟合指数，初始 a=${x0[0]}, b=${x0[1]}，λ=1e-3。`,
      en: `LM fitting exponential, init a=${x0[0]}, b=${x0[1]}, λ=1e-3.`,
    })
    .setAux([
      { label: '初始 a', value: String(x0[0]), role: 'frontier' as BarRole },
      { label: '初始 b', value: String(x0[1]), role: 'frontier' as BarRole },
      { label: '初始 λ', value: '1e-3', role: 'pivot' as BarRole },
    ])
    .commit();

  const hooks: LMHooks = {
    onIter: (iter, x, cost, lambda, accepted) => {
      rec
        .begin({
          zh: `iter ${iter}：a=${x[0]!.toFixed(4)}, b=${x[1]!.toFixed(4)}, λ=${lambda.toExponential(2)}, ${accepted ? '接受' : '拒绝'}`,
          en: `iter ${iter}: a=${x[0]!.toFixed(4)}, b=${x[1]!.toFixed(4)}, λ=${lambda.toExponential(2)}, ${accepted ? 'accept' : 'reject'}`,
        })
        .setAux([
          { label: 'iter', value: String(iter), role: 'pivot' as BarRole },
          { label: 'a', value: x[0]!.toFixed(6), role: 'compare' as BarRole },
          { label: 'b', value: x[1]!.toFixed(6), role: 'compare' as BarRole },
          { label: '成本', value: cost.toExponential(3), role: 'final' as BarRole },
          { label: 'λ', value: lambda.toExponential(2), role: 'frontier' as BarRole },
          {
            label: '状态',
            value: accepted ? '接受' : '拒绝',
            role: (accepted ? 'final' : 'warn') as BarRole,
          },
        ])
        .commit();
    },
  };

  const result = levenbergMarquardt(residual, jacobian, x0, { maxIter: 100, tol: 1e-12 }, hooks);

  rec
    .begin({
      zh: result.converged
        ? `收敛：a=${result.x[0]!.toFixed(6)}, b=${result.x[1]!.toFixed(6)}（${result.iterations} 步）`
        : `结束：a=${result.x[0]!.toFixed(6)}, b=${result.x[1]!.toFixed(6)}`,
      en: result.converged
        ? `Converged: a=${result.x[0]!.toFixed(6)}, b=${result.x[1]!.toFixed(6)} (${result.iterations} iters)`
        : `Stopped: a=${result.x[0]!.toFixed(6)}, b=${result.x[1]!.toFixed(6)}`,
    })
    .setAux([
      { label: 'a', value: result.x[0]!.toFixed(6), role: 'final' as BarRole },
      { label: 'b', value: result.x[1]!.toFixed(6), role: 'final' as BarRole },
      { label: 'λ', value: result.lambda.toExponential(2), role: 'compare' as BarRole },
      { label: '迭代', value: String(result.iterations), role: 'compare' as BarRole },
    ])
    .commit();

  return rec.build();
}
