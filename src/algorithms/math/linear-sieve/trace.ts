// 线性筛 · 录制帧序列

import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { linearSieve, type LinearSieveHooks } from './impl.ts';

/** 默认上界。 */
export const DEFAULT_INPUT = 30;

/** 录制演示帧序列。 */
export function buildTrace(input: number = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const isComposite = new Array<boolean>(input + 1).fill(false);

  rec
    .begin({ zh: `区间 [0, ${input}] 全部标记为「未筛」`, en: `Mark [0, ${input}] unsieved` })
    .setBars(rec.barsFrom(Array.from({ length: input + 1 }, (_, i) => i)))
    .commit();

  const hooks: LinearSieveHooks = {
    onPrime: (p) => {
      isComposite[p] = false;
      rec
        .begin({ zh: `i=${p} 未被标记 → 是素数`, en: `i=${p} unmarked → prime` })
        .setBars(
          rec.barsFrom(
            Array.from({ length: input + 1 }, (_, i) => i),
            Array.from({ length: input + 1 }, (_, i) =>
              i === p ? 'pivot' : isComposite[i] ? 'sorted' : 'default',
            ),
          ),
        )
        .commit();
    },
    onMark: (c, p, i) => {
      isComposite[c] = true;
      rec
        .begin({
          zh: `${i} × ${p} = ${c}，标记 ${c} 为合数`,
          en: `${i} × ${p} = ${c} marked composite`,
        })
        .setBars(
          rec.barsFrom(
            Array.from({ length: input + 1 }, (_, idx) => idx),
            Array.from({ length: input + 1 }, (_, idx) =>
              idx === c ? 'swap' : isComposite[idx] ? 'sorted' : 'default',
            ),
          ),
        )
        .commit();
    },
    onBreak: (i, p) => {
      rec
        .begin({
          zh: `${i} % ${p} === 0 → 停止内层（保证线性）`,
          en: `${i} % ${p} === 0 → break inner loop`,
        })
        .commit();
    },
    onDone: (_n, count) => {
      rec
        .begin({ zh: `筛完成，共 ${count} 个素数`, en: `Done — ${count} primes` })
        .setBars(
          rec.barsFrom(
            Array.from({ length: input + 1 }, (_, i) => i),
            Array.from({ length: input + 1 }, (_, i) =>
              !isComposite[i] && i >= 2 ? 'sorted' : 'default',
            ),
          ),
        )
        .commit();
    },
  };

  const result = linearSieve(input, hooks);

  rec
    .begin({
      zh: `素数：${result.primes.join(', ')}`,
      en: `Primes: ${result.primes.join(', ')}`,
    })
    .setBars(
      rec.barsFrom(
        Array.from({ length: input + 1 }, (_, i) => i),
        Array.from({ length: input + 1 }, () => 'final' as const),
      ),
    )
    .commit();

  return rec.build();
}
