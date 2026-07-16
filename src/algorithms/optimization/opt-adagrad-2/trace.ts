// opt-adagrad-2 · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { optAdagrad2, demoFunc, demoGrad } from './impl.ts';

export const DEFAULT_INPUT = { initParams: [0, 0], lr: 0.1, maxIter: 80, tol: 1e-10 };

export function buildTrace(
  input: { initParams?: number[]; lr?: number; maxIter?: number; tol?: number } = {},
): Frame[] {
  const { initParams = [0, 0], lr = 0.1, maxIter = 80, tol = 1e-10 } = input;
  const rec = new TraceRecorder();

  const snapshot = (
    note: { zh: string; en: string },
    params: number[],
    value: number,
    iter: number,
    extra: Array<{ label: string; value: string; role?: BarRole }> = [],
  ) => {
    rec
      .begin(note)
      .setAux([
        { label: '迭代 / iter', value: String(iter), role: 'pivot' as BarRole },
        { label: 'x', value: params[0]!.toFixed(4), role: 'compare' as BarRole },
        { label: 'y', value: params[1]!.toFixed(4), role: 'compare' as BarRole },
        { label: 'f(x,y)', value: value.toFixed(6), role: 'final' as BarRole },
        ...extra,
      ])
      .commit();
  };

  snapshot({ zh: '初始 (0,0)', en: 'Init (0,0)' }, initParams, demoFunc(initParams), 0);

  const result = optAdagrad2(demoFunc, demoGrad, initParams, { lr, maxIter, tol });

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
