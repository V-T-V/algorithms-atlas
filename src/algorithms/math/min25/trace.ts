// Min_25筛 · 录制帧序列

import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { min25, type Min25Hooks } from './impl.ts';

/** 默认上界：求 Σ_{p≤100} p。 */
export const DEFAULT_INPUT = 100;

/** 录制演示帧序列。 */
export function buildTrace(input: number = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  // 当前累计「被剔除的合数和」与剩余「候选和」
  const candidates: number[] = Array.from({ length: input + 1 }, (_, i) => i);
  candidates[0] = 0;
  candidates[1] = 0;

  rec
    .begin({
      zh: `初始 g[v] = Σ_{j=2}^{v} j（n=${input}）`,
      en: `Init g[v] = Σ_{j=2}^{v} j (n=${input})`,
    })
    .setBars(rec.barsFrom(candidates.slice(0, Math.min(input + 1, 40))))
    .commit();

  const hooks: Min25Hooks = {
    onInit: (sqrtN, count) => {
      rec
        .begin({
          zh: `预筛 ≤√${input}=${sqrtN} 的素数（共 ${count} 个）`,
          en: `Pre-sieve primes ≤√${input}=${sqrtN} (${count} primes)`,
        })
        .commit();
    },
    onRelaxPrime: (p) => {
      // 用 p 松弛：剔除 p 的所有倍数（保留 p 本身）
      for (let j = p * p; j <= input; j += p) candidates[j] = 0;
      rec
        .begin({
          zh: `用素数 ${p} 松弛：剔除 ${p}²=${p * p} 起的倍数`,
          en: `Relax with prime ${p}: remove multiples from ${p * p}`,
        })
        .setBars(
          rec.barsFrom(
            candidates.slice(0, Math.min(input + 1, 40)),
            Object.fromEntries(
              candidates
                .slice(0, Math.min(input + 1, 40))
                .map((v, i) => [
                  i,
                  v === 0 ? 'sorted' : v % p === 0 && v >= p ? 'pivot' : 'default',
                ]),
            ),
          ),
        )
        .commit();
    },
    onDone: (_n, sum) => {
      const primes: number[] = [];
      for (let i = 2; i <= input; i++) if (candidates[i] !== 0) primes.push(i);
      rec
        .begin({
          zh: `完成：Σ_{p≤${input}} p = ${sum}（${primes.length} 个素数）`,
          en: `Done: Σ_{p≤${input}} p = ${sum} (${primes.length} primes)`,
        })
        .setBars(
          rec.barsFrom(
            candidates.slice(0, Math.min(input + 1, 40)),
            Object.fromEntries(
              candidates.slice(0, Math.min(input + 1, 40)).map((_, i) => [i, 'final']),
            ),
          ),
        )
        .commit();
    },
  };

  min25(input, hooks);

  return rec.build();
}
