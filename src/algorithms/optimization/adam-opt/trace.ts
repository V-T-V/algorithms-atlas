// Adam 优化器 · 录制帧序列
// 用 setAux 展示参数 / 一阶矩 m / 二阶矩 v / 目标值随迭代变化。

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { adamOpt, demoFunc, demoGrad, type AdamHooks } from './impl.ts';

export const DEFAULT_INPUT = {
  initParams: [0, 0],
  lr: 0.5,
  beta1: 0.9,
  beta2: 0.999,
  maxIter: 100,
  tol: 1e-10,
};

export function buildTrace(
  input: {
    initParams?: number[];
    lr?: number;
    beta1?: number;
    beta2?: number;
    maxIter?: number;
    tol?: number;
  } = {},
): Frame[] {
  const {
    initParams = [0, 0],
    lr = 0.5,
    beta1 = 0.9,
    beta2 = 0.999,
    maxIter = 100,
    tol = 1e-10,
  } = input;
  const rec = new TraceRecorder();

  const snapshot = (
    note: { zh: string; en: string },
    params: number[],
    m: number[],
    v: number[],
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
        { label: 'm_x', value: m[0]!.toFixed(4), role: 'default' as BarRole },
        { label: 'm_y', value: m[1]!.toFixed(4), role: 'default' as BarRole },
        { label: 'v_x', value: v[0]!.toFixed(4), role: 'default' as BarRole },
        { label: 'v_y', value: v[1]!.toFixed(4), role: 'default' as BarRole },
      ])
      .commit();
  };

  snapshot(
    { zh: '初始 (0,0)，m=v=0', en: 'Init (0,0), m=v=0' },
    initParams,
    [0, 0],
    [0, 0],
    demoFunc(initParams),
    0,
  );

  const hooks: AdamHooks = {
    onIter: (iter, params, _g, m, v, value) => {
      snapshot(
        {
          zh: `迭代 ${iter}：f=${value.toFixed(6)}，动量+自适应学习率+偏差校正`,
          en: `Iter ${iter}: f=${value.toFixed(6)}, momentum + adaptive LR + bias correction`,
        },
        params,
        m,
        v,
        value,
        iter,
      );
    },
  };

  const result = adamOpt(demoFunc, demoGrad, initParams, { lr, beta1, beta2, maxIter, tol }, hooks);

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
