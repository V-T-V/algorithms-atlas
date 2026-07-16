// 和声搜索 · 录制帧序列
// 每 50 次即兴采样一帧：setAux 展示当前最优解 + 记忆库最优值。

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { harmonySearch, demoFunc, demoBounds, type HarmonySearchHooks } from './impl.ts';

export const DEFAULT_INPUT = { HMS: 30, HMCR: 0.9, PAR: 0.3, maxIter: 2000, tol: 1e-12 };

export function buildTrace(
  input: {
    HMS?: number;
    HMCR?: number;
    PAR?: number;
    bw?: number;
    maxIter?: number;
    tol?: number;
    seed?: number;
  } = {},
): Frame[] {
  const { HMS = 30, HMCR = 0.9, PAR = 0.3, maxIter = 2000, tol = 1e-12, seed = 42 } = input;
  const rec = new TraceRecorder();

  const snapshot = (
    note: { zh: string; en: string },
    iter: number,
    harmony: number[],
    value: number,
    bestInMemory: number,
  ) => {
    rec
      .begin(note)
      .setAux([
        { label: '迭代 / iter', value: String(iter), role: 'pivot' as BarRole },
        { label: '新和声 x', value: harmony[0]!.toFixed(4), role: 'default' as BarRole },
        { label: '新和声 y', value: harmony[1]!.toFixed(4), role: 'default' as BarRole },
        { label: 'f(新)', value: value.toFixed(6), role: 'compare' as BarRole },
        { label: 'best x', value: '—', role: 'default' as BarRole },
        { label: 'f(best)', value: bestInMemory.toFixed(6), role: 'final' as BarRole },
      ])
      .commit();
  };

  snapshot(
    { zh: '初始记忆库（30 个随机和声）', en: 'Initial harmony memory (30 random harmonies)' },
    0,
    [0, 0],
    demoFunc([0, 0]),
    demoFunc([0, 0]),
  );

  const hooks: HarmonySearchHooks = {
    onImprovise: (iter, harmony, value, bestInMemory) => {
      // 每 50 次即兴采样一帧，避免帧过多
      if (iter % 50 !== 0) return;
      snapshot(
        {
          zh: `即兴 ${iter}：f(新)=${value.toFixed(4)}，记忆库最优 f=${bestInMemory.toExponential(2)}`,
          en: `Improvise ${iter}: f(new)=${value.toFixed(4)}, memory best=${bestInMemory.toExponential(2)}`,
        },
        iter,
        harmony,
        value,
        bestInMemory,
      );
    },
  };

  const result = harmonySearch(demoFunc, demoBounds, { HMS, HMCR, PAR, maxIter, tol, seed }, hooks);

  rec
    .begin({
      zh: result.converged
        ? `收敛于 (${result.params[0]!.toFixed(3)}, ${result.params[1]!.toFixed(3)})，${result.iterations} 次即兴`
        : `结束于 (${result.params[0]!.toFixed(3)}, ${result.params[1]!.toFixed(3)})`,
      en: result.converged
        ? `Converged at (${result.params[0]!.toFixed(3)}, ${result.params[1]!.toFixed(3)}) in ${result.iterations} improvisations`
        : `Done at (${result.params[0]!.toFixed(3)}, ${result.params[1]!.toFixed(3)})`,
    })
    .setAux([
      { label: 'x', value: result.params[0]!.toFixed(4), role: 'final' as BarRole },
      { label: 'y', value: result.params[1]!.toFixed(4), role: 'final' as BarRole },
    ])
    .commit();

  return rec.build();
}
