import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { quickSortMedian3, type QuickMedian3Hooks } from './impl.ts';

export const DEFAULT_INPUT = [5, 2, 8, 1, 9, 3, 7, 4, 6];

export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec
    .begin({ zh: `初始：${input.join(', ')}`, en: `Initial: ${input.join(', ')}` })
    .setBars(rec.barsFrom(input))
    .commit();
  const hooks: QuickMedian3Hooks = {
    onPartition: (lo, hi, pivot, arr) => {
      const roles: Record<number, BarRole> = { [lo]: 'pivot' };
      rec
        .begin({
          zh: `分区 [${lo},${hi}] pivot=${pivot}`,
          en: `Partition [${lo},${hi}] pivot=${pivot}`,
        })
        .setBars(rec.barsFrom(arr, roles))
        .commit();
    },
  };
  const result = quickSortMedian3(input, hooks);
  rec
    .begin({ zh: `完成`, en: `Done` })
    .setBars(result.map((v) => ({ value: v, role: 'final' as BarRole })))
    .commit();
  return rec.build();
}
