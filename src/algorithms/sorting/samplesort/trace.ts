// =============================================================================
// 采样排序 · 录制帧序列
// 通过 samplesort 的钩子，把执行过程录成 Frame[]。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { samplesort, type SamplesortHooks } from './impl.ts';

export const DEFAULT_INPUT = [19, 7, 13, 1, 17, 5, 11, 3, 15, 9, 21, 23, 25, 0, 2, 4, 6, 8, 10, 12];

/** 录制演示帧序列。 */
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const a = [...input];

  rec
    .begin({ zh: `初始数组：${a.join(', ')}`, en: `Initial array: ${a.join(', ')}` })
    .setBars(rec.barsFrom(a))
    .commit();

  const hooks: SamplesortHooks = {
    onPivots: (pivots) => {
      const pivotSet = new Set(pivots);
      rec
        .begin({ zh: `选取主元：[${pivots.join(', ')}]`, en: `Pivots: [${pivots.join(', ')}]` })
        .setBars(
          rec.barsFrom(
            a,
            ((): Record<number, BarRole> => {
              const r: Record<number, BarRole> = {};
              a.forEach((v, i) => {
                if (pivotSet.has(v)) r[i] = 'pivot';
              });
              return r;
            })(),
          ),
        )
        .commit();
    },
    onPartition: (sizes) => {
      rec
        .begin({
          zh: `${sizes.length} 路划分：[${sizes.join(', ')}]`,
          en: `${sizes.length}-way partition: [${sizes.join(', ')}]`,
        })
        .setBars(rec.barsFrom(a))
        .setAux(
          sizes.map((s, i) => ({ label: `桶${i}`, value: String(s), role: 'frontier' as BarRole })),
        )
        .commit();
    },
    onInsertion: (lo, hi) => {
      rec
        .begin({ zh: `小段 [${lo},${hi}] 插入排序收尾`, en: `Insertion sort on [${lo},${hi}]` })
        .setBars(rec.barsFrom(a))
        .commit();
    },
  };

  samplesort(input, 3, hooks);

  rec
    .begin({ zh: '排序完成', en: 'Sorted' })
    .setBars(a.map((v) => ({ value: v, role: 'final' as BarRole })))
    .commit();

  return rec.build();
}
