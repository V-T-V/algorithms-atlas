import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { insertionSortLinked, type InsertLinkedHooks } from './impl.ts';

export const DEFAULT_INPUT = [5, 2, 8, 1, 9, 3, 7, 4, 6];

export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec
    .begin({ zh: `初始：${input.join(', ')}`, en: `Initial: ${input.join(', ')}` })
    .setBars(rec.barsFrom(input))
    .commit();
  const hooks: InsertLinkedHooks = {
    onShift: (i, value, arr) => {
      const roles: Record<number, BarRole> = { [i - 1]: 'compare', [i]: 'swap' };
      rec
        .begin({
          zh: `右移 a[${i - 1}]，腾位给 ${value}`,
          en: `Shift a[${i - 1}] right for ${value}`,
        })
        .setBars(rec.barsFrom(arr, roles))
        .commit();
    },
  };
  const result = insertionSortLinked(input, hooks);
  rec
    .begin({ zh: `完成`, en: `Done` })
    .setBars(result.map((v) => ({ value: v, role: 'final' as BarRole })))
    .commit();
  return rec.build();
}
