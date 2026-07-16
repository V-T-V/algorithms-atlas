import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { quickSort3Way, type Quick3WayHooks } from './impl.ts';

export const DEFAULT_INPUT = [5, 3, 8, 3, 9, 3, 7, 4, 3];

export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec
    .begin({ zh: `初始：${input.join(', ')}`, en: `Initial: ${input.join(', ')}` })
    .setBars(rec.barsFrom(input))
    .commit();
  const hooks: Quick3WayHooks = {
    onPartition: (lt, gt, arr) => {
      const roles: Record<number, BarRole> = {};
      for (let k = lt; k <= gt; k++) roles[k] = 'final';
      rec
        .begin({ zh: `等于 pivot 段 [${lt},${gt}]`, en: `= pivot [${lt},${gt}]` })
        .setBars(rec.barsFrom(arr, roles))
        .commit();
    },
  };
  const result = quickSort3Way(input, hooks);
  rec
    .begin({ zh: `完成`, en: `Done` })
    .setBars(result.map((v) => ({ value: v, role: 'final' as BarRole })))
    .commit();
  return rec.build();
}
