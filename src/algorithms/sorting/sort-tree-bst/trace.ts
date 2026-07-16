import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { treeSortBst, type TreeBstHooks } from './impl.ts';

export const DEFAULT_INPUT = [5, 2, 8, 1, 9, 3, 7, 4, 6];

export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec
    .begin({ zh: `初始：${input.join(', ')}`, en: `Initial: ${input.join(', ')}` })
    .setBars(rec.barsFrom(input))
    .commit();
  const hooks: TreeBstHooks = {
    onVisit: (value, arr) => {
      const roles: Record<number, BarRole> = {};
      for (let k = 0; k < arr.length; k++) roles[k] = 'sorted';
      rec
        .begin({ zh: `中序访问 ${value}`, en: `In-order visit ${value}` })
        .setBars(rec.barsFrom(arr, roles))
        .commit();
    },
  };
  const result = treeSortBst(input, hooks);
  rec
    .begin({ zh: `完成`, en: `Done` })
    .setBars(result.map((v) => ({ value: v, role: 'final' as BarRole })))
    .commit();
  return rec.build();
}
