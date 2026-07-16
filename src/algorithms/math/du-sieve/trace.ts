// 杜教筛 · 录制帧序列

import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { duSieve, type DuSieveHooks } from './impl.ts';

/** 默认上界：求 Σ_{i≤30} μ(i) 与 Σ_{i≤30} φ(i)。 */
export const DEFAULT_INPUT = 30;

/** 录制演示帧序列。 */
export function buildTrace(input: number = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const blocks: Array<{ l: number; r: number; d: number }> = [];

  rec
    .begin({ zh: `杜教筛：求 Σμ 与 Σφ (n=${input})`, en: `Du sieve: Σμ and Σφ (n=${input})` })
    .commit();

  const hooks: DuSieveHooks = {
    onPreSieve: (lim) => {
      rec.begin({ zh: `预筛 [1, ${lim}]`, en: `Pre-sieve [1, ${lim}]` }).commit();
    },
    onBlock: (l, r, d) => {
      blocks.push({ l, r, d });
      rec
        .begin({
          zh: `数论分块：[${l}, ${r}] → ⌊n/${l}⌋ = ${d}`,
          en: `Block [${l}, ${r}] → ⌊n/${l}⌋ = ${d}`,
        })
        .setBars(
          rec.barsFrom(
            blocks.map((b) => b.d),
            Object.fromEntries(blocks.map((_, i) => [i, 'compare'])),
          ),
        )
        .commit();
    },
    onRecurse: (d) => {
      rec.begin({ zh: `递归求 S(${d})`, en: `Recurse into S(${d})` }).commit();
    },
    onDone: (n, sumMu, sumPhi) => {
      rec
        .begin({
          zh: `完成：Σμ(${n})=${sumMu}，Σφ(${n})=${sumPhi}`,
          en: `Done: Σμ(${n})=${sumMu}, Σφ(${n})=${sumPhi}`,
        })
        .setBars(rec.barsFrom([Number(sumMu), Number(sumPhi)], { 0: 'final', 1: 'final' }))
        .commit();
    },
  };

  duSieve(input, hooks);

  return rec.build();
}
