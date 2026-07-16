// 差分进化 · 录制帧序列
// 用 setBars 展示种群每个体的目标值（按值升序），setAux 展示当前最优解。

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { differentialEvo, demoFunc, demoBounds, type DEHooks } from './impl.ts';

export const DEFAULT_INPUT = { NP: 12, F: 0.7, CR: 0.9, maxGen: 100, tol: 1e-12 };

export function buildTrace(
  input: {
    NP?: number;
    F?: number;
    CR?: number;
    maxGen?: number;
    tol?: number;
    seed?: number;
  } = {},
): Frame[] {
  const { NP = 12, F = 0.7, CR = 0.9, maxGen = 100, tol = 1e-12, seed = 42 } = input;
  const rec = new TraceRecorder();

  const snapshot = (
    note: { zh: string; en: string },
    gen: number,
    best: { x: number[]; fx: number },
    pop: Array<{ x: number[]; fx: number }>,
  ) => {
    const sorted = [...pop].sort((a, b) => a.fx - b.fx);
    rec
      .begin(note)
      .setBars(
        sorted.map((p, i) => ({
          value: p.fx,
          role: (i === 0 ? 'final' : i === sorted.length - 1 ? 'warn' : 'compare') as BarRole,
        })),
      )
      .setAux([
        { label: '代 / gen', value: String(gen), role: 'pivot' as BarRole },
        { label: 'best x', value: best.x[0]!.toFixed(4), role: 'compare' as BarRole },
        { label: 'best y', value: best.x[1]!.toFixed(4), role: 'compare' as BarRole },
        { label: 'f(best)', value: best.fx.toFixed(6), role: 'final' as BarRole },
      ])
      .commit();
  };

  // 初始种群的近似展示
  snapshot(
    { zh: '初始随机种群（12 个体）', en: 'Initial random population (12 individuals)' },
    0,
    { x: [0, 0], fx: demoFunc([0, 0]) },
    [{ x: [0, 0], fx: demoFunc([0, 0]) }],
  );

  const hooks: DEHooks = {
    onGeneration: (gen, best, pop) => {
      snapshot(
        {
          zh: `第 ${gen} 代：f=${best.fx.toFixed(6)}，差分变异驱动搜索`,
          en: `Gen ${gen}: f=${best.fx.toFixed(6)}, differential mutation drives search`,
        },
        gen,
        best,
        pop,
      );
    },
  };

  const result = differentialEvo(demoFunc, demoBounds, { NP, F, CR, maxGen, tol, seed }, hooks);

  rec
    .begin({
      zh: result.converged
        ? `收敛于 (${result.params[0]!.toFixed(3)}, ${result.params[1]!.toFixed(3)})，${result.generations} 代`
        : `结束于 (${result.params[0]!.toFixed(3)}, ${result.params[1]!.toFixed(3)})，${result.generations} 代`,
      en: result.converged
        ? `Converged at (${result.params[0]!.toFixed(3)}, ${result.params[1]!.toFixed(3)}) in ${result.generations} gens`
        : `Done at (${result.params[0]!.toFixed(3)}, ${result.params[1]!.toFixed(3)}) in ${result.generations} gens`,
    })
    .setAux([
      { label: 'x', value: result.params[0]!.toFixed(4), role: 'final' as BarRole },
      { label: 'y', value: result.params[1]!.toFixed(4), role: 'final' as BarRole },
    ])
    .commit();

  return rec.build();
}
