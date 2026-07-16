// 二进制粒子群 · 录制帧序列
// 用 setBars 展示最优位串 + setAux 展示最优/平均适应度。

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { binaryPSO, makeLcg, oneMaxFitness, type BinaryPSOHooks } from './impl.ts';

export const DEFAULT_INPUT = { bits: 12, numParticles: 10, maxIter: 30, seed: 42 };

export function buildTrace(
  input: { bits?: number; numParticles?: number; maxIter?: number; seed?: number } = {},
): Frame[] {
  const { bits = 12, numParticles = 10, maxIter = 30, seed = 42 } = input;
  const rec = new TraceRecorder();
  let bestPos: number[] = new Array(bits).fill(0);

  const snapshot = (
    note: { zh: string; en: string },
    bestFit: number,
    avgFit: number,
    iter: number,
  ) => {
    rec
      .begin(note)
      .setBars(
        bestPos.map((b, i) => ({
          value: b,
          role: (b === 1 ? 'final' : 'default') as BarRole,
          label: String(i),
        })),
      )
      .setAux([
        { label: '迭代 / iter', value: String(iter), role: 'pivot' as BarRole },
        { label: '最优适应度', value: String(bestFit), role: 'final' as BarRole },
        { label: '平均适应度', value: avgFit.toFixed(2), role: 'compare' as BarRole },
        { label: '目标', value: String(bits), role: 'default' as BarRole },
      ])
      .commit();
  };

  snapshot(
    {
      zh: `初始化 ${numParticles} 粒子，${bits} 位 One-Max`,
      en: `Init ${numParticles} particles, ${bits}-bit One-Max`,
    },
    0,
    0,
    0,
  );

  const hooks: BinaryPSOHooks = {
    onIter: (iter, bestFit, avgFit) => {
      snapshot(
        {
          zh: `迭代 ${iter}：最优 ${bestFit}/${bits}，平均 ${avgFit.toFixed(2)}`,
          en: `Iter ${iter}: best ${bestFit}/${bits}, avg ${avgFit.toFixed(2)}`,
        },
        bestFit,
        avgFit,
        iter,
      );
    },
  };

  const result = binaryPSO(
    bits,
    oneMaxFitness,
    numParticles,
    maxIter,
    1.0,
    2.0,
    2.0,
    makeLcg(seed),
    hooks,
  );
  bestPos = result.bestPosition;

  rec
    .begin({
      zh: `完成：最优 ${result.bestFitness}/${bits}（${result.iterations} 迭代）`,
      en: `Done: best ${result.bestFitness}/${bits} (${result.iterations} iters)`,
    })
    .setBars(bestPos.map((b) => ({ value: b, role: (b === 1 ? 'final' : 'default') as BarRole })))
    .commit();

  return rec.build();
}
