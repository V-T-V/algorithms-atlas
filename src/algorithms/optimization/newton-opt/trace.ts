// 牛顿法优化 · 录制帧序列
// 用 setAux 展示参数 / 梯度 / 牛顿步 / 目标值随迭代变化。

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { newtonOpt, demoFunc, demoGrad, demoHess, type NewtonOptHooks } from './impl.ts';

export const DEFAULT_INPUT = { initParams: [0, 0], maxIter: 50, tol: 1e-10 };

export function buildTrace(
  input: { initParams?: number[]; maxIter?: number; tol?: number } = {},
): Frame[] {
  const { initParams = [0, 0], maxIter = 50, tol = 1e-10 } = input;
  const rec = new TraceRecorder();

  const snapshot = (
    note: { zh: string; en: string },
    params: number[],
    grad: number[],
    step: number[],
    value: number,
    iter: number,
  ) => {
    rec
      .begin(note)
      .setAux([
        { label: '迭代 / iter', value: String(iter), role: 'pivot' as BarRole },
        { label: 'x', value: params[0]!.toFixed(4), role: 'compare' as BarRole },
        { label: 'y', value: params[1]!.toFixed(4), role: 'compare' as BarRole },
        { label: 'f(x,y)', value: value.toFixed(6), role: 'final' as BarRole },
        { label: '∇x', value: grad[0]!.toFixed(4), role: 'default' as BarRole },
        { label: '∇y', value: grad[1]!.toFixed(4), role: 'default' as BarRole },
        { label: 'Δx', value: step[0]!.toFixed(4), role: 'default' as BarRole },
        { label: 'Δy', value: step[1]!.toFixed(4), role: 'default' as BarRole },
      ])
      .commit();
  };

  snapshot(
    { zh: '初始 (0,0)，目标最小化 (x-3)²+(y+1)²', en: 'Init (0,0), minimize (x-3)²+(y+1)²' },
    initParams,
    demoGrad(initParams),
    [3 - initParams[0]!, -1 - initParams[1]!], // 牛顿一步直达
    demoFunc(initParams),
    0,
  );

  const hooks: NewtonOptHooks = {
    onIter: (iter, params, grad, step, value) => {
      snapshot(
        {
          zh: `迭代 ${iter}：f=${value.toFixed(6)}，用海森曲率修正步长`,
          en: `Iter ${iter}: f=${value.toFixed(6)}, Hessian curvature corrects the step`,
        },
        params,
        grad,
        step,
        value,
        iter,
      );
    },
  };

  const result = newtonOpt(demoFunc, demoGrad, demoHess, initParams, { maxIter, tol }, hooks);

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
    ])
    .commit();

  return rec.build();
}
