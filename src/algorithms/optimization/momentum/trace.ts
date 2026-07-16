// 动量梯度下降 · 录制帧序列
// 用 setAux 展示参数 / 速度 / 目标值随迭代变化。

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { momentum, demoFunc, demoGrad, type MomentumHooks } from './impl.ts';

export const DEFAULT_INPUT = { initParams: [0, 0], lr: 0.05, beta: 0.9, maxIter: 80, tol: 1e-10 };

export function buildTrace(
  input: { initParams?: number[]; lr?: number; beta?: number; maxIter?: number; tol?: number } = {},
): Frame[] {
  const { initParams = [0, 0], lr = 0.05, beta = 0.9, maxIter = 80, tol = 1e-10 } = input;
  const rec = new TraceRecorder();

  const snapshot = (
    note: { zh: string; en: string },
    params: number[],
    velocity: number[],
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
        { label: 'v_x', value: velocity[0]!.toFixed(4), role: 'default' as BarRole },
        { label: 'v_y', value: velocity[1]!.toFixed(4), role: 'default' as BarRole },
      ])
      .commit();
  };

  snapshot(
    { zh: '初始 (0,0)，速度为 0', en: 'Init (0,0), zero velocity' },
    initParams,
    [0, 0],
    demoFunc(initParams),
    0,
  );

  const hooks: MomentumHooks = {
    onIter: (iter, params, _grad, velocity, value) => {
      snapshot(
        {
          zh: `迭代 ${iter}：f=${value.toFixed(6)}，惯性累积形成动量`,
          en: `Iter ${iter}: f=${value.toFixed(6)}, momentum accumulates`,
        },
        params,
        velocity,
        value,
        iter,
      );
    },
  };

  const result = momentum(demoFunc, demoGrad, initParams, { lr, beta, maxIter, tol }, hooks);

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
