import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { mergeSortInsert, type MergeInsertHooks } from './impl.ts';

export const DEFAULT_INPUT = [5, 2, 8, 1, 9, 3, 7, 4, 6, 0, 5, 8, 2, 7, 1, 9, 4, 3];

export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec
    .begin({ zh: `初始：${input.join(', ')}`, en: `Initial: ${input.join(', ')}` })
    .setBars(rec.barsFrom(input))
    .commit();
  const hooks: MergeInsertHooks = {
    onMerge: (lo, mid, hi, arr) => {
      const roles: Record<number, BarRole> = {};
      for (let k = lo; k <= hi; k++) roles[k] = 'frontier';
      rec
        .begin({ zh: `归并 [${lo},${hi}]`, en: `Merge [${lo},${hi}]` })
        .setBars(rec.barsFrom(arr, roles))
        .commit();
    },
  };
  const result = mergeSortInsert(input, hooks);
  rec
    .begin({ zh: `完成`, en: `Done` })
    .setBars(result.map((v) => ({ value: v, role: 'final' as BarRole })))
    .commit();
  return rec.build();
}
