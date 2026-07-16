// 欧拉函数筛 · 录制帧序列

import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { phiSieve, type PhiSieveHooks } from './impl.ts';

/** 默认上界：求 [0, 20] 的欧拉函数。 */
export const DEFAULT_INPUT = 20;

/** 录制演示帧序列。 */
export function buildTrace(input: number = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const phi = new Array<number>(input + 1).fill(0);
  for (let i = 0; i <= input; i++) phi[i] = i;

  rec
    .begin({ zh: `初始化 phi[i] = i，i = 0..${input}`, en: `Init phi[i] = i for i = 0..${input}` })
    .setBars(rec.barsFrom(phi))
    .commit();

  const hooks: PhiSieveHooks = {
    onPrime: (p) => {
      rec
        .begin({ zh: `素数 ${p}：松弛其全部倍数`, en: `Prime ${p}: relax all multiples` })
        .setBars(
          rec.barsFrom(
            phi,
            phi.map((_, i) => (i % p === 0 && i >= p ? 'pivot' : 'default')),
          ),
        )
        .commit();
    },
    onMark: (j, p) => {
      phi[j] = phi[j]! - Math.floor(phi[j]! / p);
      rec
        .begin({ zh: `phi[${j}] -= phi[${j}] / ${p}`, en: `phi[${j}] -= phi[${j}] / ${p}` })
        .setBars(
          rec.barsFrom(
            phi,
            phi.map((_, i) => (i === j ? 'swap' : 'default')),
          ),
        )
        .commit();
    },
    onDone: (_n, count) => {
      rec
        .begin({ zh: `筛完成，共 ${count} 个素数`, en: `Done — ${count} primes` })
        .setBars(
          rec.barsFrom(
            phi,
            phi.map(() => 'sorted' as const),
          ),
        )
        .commit();
    },
  };

  phiSieve(input, hooks);

  rec
    .begin({ zh: `最终结果 phi[0..${input}]`, en: `Final phi[0..${input}]` })
    .setBars(
      rec.barsFrom(
        phi,
        phi.map(() => 'final' as const),
      ),
    )
    .commit();

  return rec.build();
}
