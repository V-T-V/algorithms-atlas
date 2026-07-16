import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { shakerSortNaive, type ShakerNaiveHooks } from './impl.ts';

export const DEFAULT_INPUT = [5, 2, 8, 1, 9, 3, 7, 4, 6];

export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec
    .begin({ zh: `初始：${input.join(', ')}`, en: `Initial: ${input.join(', ')}` })
    .setBars(rec.barsFrom(input))
    .commit();
  const hooks: ShakerNaiveHooks = {
    onCompare: (i: number, j: number, arr: number[]) => {
      const roles: Record<number, BarRole> = { [i]: 'compare', [j]: 'pivot' };
      rec
        .begin({ zh: `比较 a[${i}], a[${j}]`, en: `Compare a[${i}], a[${j}]` })
        .setBars(rec.barsFrom(arr, roles))
        .commit();
    },
  };
  const result = shakerSortNaive(input, hooks);
  rec
    .begin({ zh: `完成`, en: `Done` })
    .setBars(result.map((v) => ({ value: v, role: 'final' as BarRole })))
    .commit();
  return rec.build();
}
