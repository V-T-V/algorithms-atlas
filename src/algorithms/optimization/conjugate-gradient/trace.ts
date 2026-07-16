// 共轭梯度 · 录制帧序列
// 用 setAux 展示参数 / 梯度 / 共轭方向 / 目标值随迭代变化。

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { conjugateGradient, demoFunc, demoGrad, type ConjugateGradientHooks } from './impl.ts';

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
    direction: number[],
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
        { label: 'd_x', value: direction[0]!.toFixed(4), role: 'default' as BarRole },
        { label: 'd_y', value: direction[1]!.toFixed(4), role: 'default' as BarRole },
      ])
      .commit();
  };

  snapshot(
    { zh: '初始 (0,0)，目标最小化 (x-3)²+(y+1)²', en: 'Init (0,0), minimize (x-3)²+(y+1)²' },
    initParams,
    demoGrad(initParams),
    demoGrad(initParams).map((x) => -x),
    demoFunc(initParams),
    0,
  );

  const hooks: ConjugateGradientHooks = {
    onIter: (iter, params, grad, direction, value) => {
      snapshot(
        {
          zh: `迭代 ${iter}：f=${value.toFixed(6)}，搜索方向与旧方向共轭`,
          en: `Iter ${iter}: f=${value.toFixed(6)}, direction conjugate to previous`,
        },
        params,
        grad,
        direction,
        value,
        iter,
      );
    },
  };

  const result = conjugateGradient(demoFunc, demoGrad, initParams, { maxIter, tol }, hooks);

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
