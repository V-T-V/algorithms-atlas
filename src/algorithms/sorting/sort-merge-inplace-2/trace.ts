import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { mergeSortInplace2, type MergeInplace2Hooks } from './impl.ts';

export const DEFAULT_INPUT = [5, 2, 8, 1, 9, 3, 7, 4, 6];

export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec
    .begin({ zh: `初始：${input.join(', ')}`, en: `Initial: ${input.join(', ')}` })
    .setBars(rec.barsFrom(input))
    .commit();
  const hooks: MergeInplace2Hooks = {
    onMerge: (lo, mid, hi, arr) => {
      const roles: Record<number, BarRole> = {};
      for (let k = lo; k <= hi; k++) roles[k] = 'frontier';
      rec
        .begin({ zh: `原地归并 [${lo},${hi}]`, en: `In-place merge [${lo},${hi}]` })
        .setBars(rec.barsFrom(arr, roles))
        .commit();
    },
  };
  const result = mergeSortInplace2(input, hooks);
  rec
    .begin({ zh: `完成`, en: `Done` })
    .setBars(result.map((v) => ({ value: v, role: 'final' as BarRole })))
    .commit();
  return rec.build();
}
