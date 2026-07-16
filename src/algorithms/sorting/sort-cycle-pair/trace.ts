import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { cycleSortPair, type CyclePairHooks } from './impl.ts';

export const DEFAULT_INPUT = [5, 2, 8, 1, 9, 3, 7, 4, 6];

export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec
    .begin({ zh: `初始：${input.join(', ')}`, en: `Initial: ${input.join(', ')}` })
    .setBars(rec.barsFrom(input))
    .commit();
  const hooks: CyclePairHooks = {
    onCycle: (start, pos, arr) => {
      const roles: Record<number, BarRole> = { [start]: 'pivot', [pos]: 'swap' };
      rec
        .begin({ zh: `循环节：放到位置 ${pos}`, en: `Cycle: place at ${pos}` })
        .setBars(rec.barsFrom(arr, roles))
        .commit();
    },
  };
  const result = cycleSortPair(input, hooks);
  rec
    .begin({ zh: `完成`, en: `Done` })
    .setBars(result.map((v) => ({ value: v, role: 'final' as BarRole })))
    .commit();
  return rec.build();
}
