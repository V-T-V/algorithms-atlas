import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { librarySortGapped, type LibraryGappedHooks } from './impl.ts';

export const DEFAULT_INPUT = [5, 2, 8, 1, 9, 3, 7, 4, 6];

export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec
    .begin({ zh: `初始：${input.join(', ')}`, en: `Initial: ${input.join(', ')}` })
    .setBars(rec.barsFrom(input))
    .commit();
  const hooks: LibraryGappedHooks = {
    onInsert: (pos, value, arr) => {
      const roles: Record<number, BarRole> = { [pos]: 'swap' };
      rec
        .begin({ zh: `二分插入 ${value} → 位置 ${pos}`, en: `Binary insert ${value} → pos ${pos}` })
        .setBars(rec.barsFrom(arr, roles))
        .commit();
    },
  };
  const result = librarySortGapped(input, hooks);
  rec
    .begin({ zh: `完成`, en: `Done` })
    .setBars(result.map((v) => ({ value: v, role: 'final' as BarRole })))
    .commit();
  return rec.build();
}
