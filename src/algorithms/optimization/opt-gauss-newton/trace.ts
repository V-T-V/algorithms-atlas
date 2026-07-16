// =============================================================================
// 高斯-牛顿法 · 录制帧序列
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { gaussNewton, type GaussNewtonHooks, type Mat, type Vec } from './impl.ts';

// 拟合指数模型 y = a·e^(b·t) 的残差；参数 x=[a,b]
// 真值 a=2, b=0.5；数据点 t=0..4
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

  const r0 = residual(x0);
  const c0 = 0.5 * (r0[0]! ** 2 + r0.reduce((s, v) => s + v * v, 0));
  rec
    .begin({
      zh: `高斯-牛顿拟合指数 y=a·e^(b·t)，初始 a=${x0[0]}, b=${x0[1]}，初始成本 ${c0.toFixed(4)}。`,
      en: `Gauss-Newton fitting exponential y=a·e^(b·t), init a=${x0[0]}, b=${x0[1]}, cost ${c0.toFixed(4)}.`,
    })
    .setAux([
      { label: '初始 a', value: String(x0[0]), role: 'frontier' as BarRole },
      { label: '初始 b', value: String(x0[1]), role: 'frontier' as BarRole },
      { label: '初始成本', value: c0.toFixed(6), role: 'pivot' as BarRole },
    ])
    .commit();

  const hooks: GaussNewtonHooks = {
    onIter: (iter, x, cost) => {
      rec
        .begin({
          zh: `iter ${iter}：a=${x[0]!.toFixed(4)}, b=${x[1]!.toFixed(4)}, 成本 ${cost.toExponential(3)}`,
          en: `iter ${iter}: a=${x[0]!.toFixed(4)}, b=${x[1]!.toFixed(4)}, cost ${cost.toExponential(3)}`,
        })
        .setAux([
          { label: 'iter', value: String(iter), role: 'pivot' as BarRole },
          { label: 'a', value: x[0]!.toFixed(6), role: 'compare' as BarRole },
          { label: 'b', value: x[1]!.toFixed(6), role: 'compare' as BarRole },
          { label: '成本', value: cost.toExponential(3), role: 'final' as BarRole },
        ])
        .commit();
    },
  };

  const result = gaussNewton(residual, jacobian, x0, { maxIter: 50, tol: 1e-12 }, hooks);

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
      { label: '成本', value: result.residual.toExponential(3), role: 'final' as BarRole },
      { label: '迭代', value: String(result.iterations), role: 'compare' as BarRole },
    ])
    .commit();

  return rec.build();
}
