import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { beadSortCount, type BeadCountHooks } from './impl.ts';

export const DEFAULT_INPUT = [5, 2, 8, 1, 4, 3];

export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec
    .begin({ zh: `初始：${input.join(', ')}`, en: `Initial: ${input.join(', ')}` })
    .setBars(rec.barsFrom(input))
    .commit();
  const hooks: BeadCountHooks = {
    onRow: (row, count) => {
      rec
        .begin({
          zh: `第 ${row + 1} 层珠子数 = ${count}`,
          en: `Row ${row + 1} bead count = ${count}`,
        })
        .setAux([
          { label: 'row', value: String(row + 1), role: 'pivot' as BarRole },
          { label: 'count', value: String(count), role: 'frontier' as BarRole },
        ])
        .commit();
    },
  };
  const result = beadSortCount(input, hooks);
  rec
    .begin({ zh: `完成`, en: `Done` })
    .setBars(result.map((v) => ({ value: v, role: 'final' as BarRole })))
    .setAux([])
    .commit();
  return rec.build();
}
