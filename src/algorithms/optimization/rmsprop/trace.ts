// RMSProp · 录制帧序列
// 用 setAux 展示参数 / 梯度 / 移动均方 E[g²] / 目标值随迭代变化。

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { rmsprop, demoFunc, demoGrad, type RMSPropHooks } from './impl.ts';

export const DEFAULT_INPUT = { initParams: [0, 0], lr: 0.05, rho: 0.9, maxIter: 200, tol: 1e-10 };

export function buildTrace(
  input: { initParams?: number[]; lr?: number; rho?: number; maxIter?: number; tol?: number } = {},
): Frame[] {
  const { initParams = [0, 0], lr = 0.05, rho = 0.9, maxIter = 200, tol = 1e-10 } = input;
  const rec = new TraceRecorder();

  const snapshot = (
    note: { zh: string; en: string },
    params: number[],
    grad: number[],
    meanSq: number[],
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
        { label: 'E[g²]_x', value: meanSq[0]!.toFixed(4), role: 'default' as BarRole },
        { label: 'E[g²]_y', value: meanSq[1]!.toFixed(4), role: 'default' as BarRole },
        { label: '∇x', value: grad[0]!.toFixed(4), role: 'default' as BarRole },
        { label: '∇y', value: grad[1]!.toFixed(4), role: 'default' as BarRole },
      ])
      .commit();
  };

  snapshot(
    { zh: '初始 (0,0)，E[g²]=0', en: 'Init (0,0), E[g²]=0' },
    initParams,
    demoGrad(initParams),
    [0, 0],
    demoFunc(initParams),
    0,
  );

  const hooks: RMSPropHooks = {
    onIter: (iter, params, grad, meanSq, value) => {
      snapshot(
        {
          zh: `迭代 ${iter}：f=${value.toFixed(6)}，用近期均方缩放学习率`,
          en: `Iter ${iter}: f=${value.toFixed(6)}, LR scaled by recent RMS`,
        },
        params,
        grad,
        meanSq,
        value,
        iter,
      );
    },
  };

  const result = rmsprop(demoFunc, demoGrad, initParams, { lr, rho, maxIter, tol }, hooks);

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
