// =============================================================================
// Spread 排序 · 录制帧序列
// 通过 spreadsort 的钩子，把执行过程录成 Frame[]。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { spreadsort, type SpreadsortHooks } from './impl.ts';

export const DEFAULT_INPUT = [29, 10, 14, 37, 13, 25, 1, 30, 8, 22, 16, 4];

/** 录制演示帧序列。 */
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();

  rec
    .begin({ zh: `初始数组：${input.join(', ')}`, en: `Initial array: ${input.join(', ')}` })
    .setBars(rec.barsFrom(input))
    .commit();

  let depth = 0;
  const hooks: SpreadsortHooks = {
    onBin: (bucketCount, shift) => {
      rec
        .begin({
          zh: `桶数 ${bucketCount}，移位 ${shift}（深度 ${depth}）`,
          en: `${bucketCount} buckets, shift ${shift} (depth ${depth})`,
        })
        .setAux([{ label: '桶数', value: String(bucketCount), role: 'pivot' }])
        .commit();
    },
    onDistribute: (sizes) => {
      const nonzero = sizes.filter((s) => s > 0).length;
      rec
        .begin({
          zh: `分桶完成（${nonzero} 个非空桶）`,
          en: `Distributed (${nonzero} non-empty buckets)`,
        })
        .setAux(
          sizes.map((s, i) => ({ label: `桶${i}`, value: String(s), role: 'frontier' as BarRole })),
        )
        .commit();
      depth++;
    },
    onInsertion: (lo, hi) => {
      rec
        .begin({ zh: `小段 [${lo},${hi}] 插入排序`, en: `Insertion sort on [${lo},${hi}]` })
        .setBars(rec.barsFrom(input))
        .commit();
    },
  };

  const result = spreadsort(input, hooks);

  rec
    .begin({ zh: '排序完成', en: 'Sorted' })
    .setBars(result.map((v) => ({ value: v, role: 'final' as BarRole })))
    .commit();

  return rec.build();
}
