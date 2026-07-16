// 单纯形法 Nelder-Mead · 录制帧序列
// 用 setBars 展示单纯形顶点（每个顶点的目标值），setAux 展示当前最优参数。

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { nelderMead, demoFunc, type NelderMeadHooks } from './impl.ts';

export const DEFAULT_INPUT = { init: [0, 0], maxIter: 200, tol: 1e-12 };

export function buildTrace(
  input: { init?: number[]; maxIter?: number; tol?: number; initStep?: number } = {},
): Frame[] {
  const { init = [0, 0], maxIter = 200, tol = 1e-12, initStep = 1 } = input;
  const rec = new TraceRecorder();

  const snapshot = (
    note: { zh: string; en: string },
    iter: number,
    best: { x: number[]; fx: number },
    simplex: Array<{ x: number[]; fx: number }>,
  ) => {
    rec
      .begin(note)
      .setBars(
        simplex.map((p, i) => ({
          value: p.fx,
          role: (i === 0 ? 'final' : i === simplex.length - 1 ? 'warn' : 'compare') as BarRole,
          label: `(${p.x[0]!.toFixed(1)},${p.x[1]!.toFixed(1)})`,
        })),
      )
      .setAux([
        { label: '迭代 / iter', value: String(iter), role: 'pivot' as BarRole },
        { label: 'best x', value: best.x[0]!.toFixed(4), role: 'compare' as BarRole },
        { label: 'best y', value: best.x[1]!.toFixed(4), role: 'compare' as BarRole },
        { label: 'f(best)', value: best.fx.toFixed(6), role: 'final' as BarRole },
      ])
      .commit();
  };

  snapshot(
    { zh: '初始单纯形（3 顶点）', en: 'Initial simplex (3 vertices)' },
    0,
    { x: init, fx: demoFunc(init) },
    [
      { x: init, fx: demoFunc(init) },
      { x: [init[0]! + 1, init[1]!], fx: demoFunc([init[0]! + 1, init[1]!]) },
      { x: [init[0]!, init[1]! + 1], fx: demoFunc([init[0]!, init[1]! + 1]) },
    ],
  );

  const hooks: NelderMeadHooks = {
    onIter: (iter, best, simplex) => {
      snapshot(
        {
          zh: `迭代 ${iter}：f=${best.fx.toFixed(6)}，单纯形反射/扩张/收缩`,
          en: `Iter ${iter}: f=${best.fx.toFixed(6)}, simplex reflects/expands/contracts`,
        },
        iter,
        best,
        simplex,
      );
    },
  };

  const result = nelderMead(demoFunc, init, { maxIter, tol, initStep }, hooks);

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
