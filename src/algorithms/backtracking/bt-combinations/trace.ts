import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { combine } from './impl.ts';
export const DEFAULT_INPUT = { n: 4, k: 2 };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const cur: number[] = [];
  rec
    .begin({ zh: 'C(' + input.n + ',' + input.k + ')', en: 'C(' + input.n + ',' + input.k + ')' })
    .commit();
  combine(input.n, input.k, {
    onPick: (v) => {
      cur.push(v);
      rec
        .begin({ zh: '选 ' + v, en: 'pick ' + v })
        .setBars(cur.map((x) => ({ value: x, role: 'pivot' as BarRole })))
        .commit();
    },
    onResult: (c) =>
      rec
        .begin({ zh: '组合 {' + c.join(',') + '}', en: 'comb {' + c.join(',') + '}' })
        .setBars(c.map((x) => ({ value: x, role: 'final' as BarRole })))
        .commit(),
  });
  rec.begin({ zh: '完成', en: 'Done' }).commit();
  return rec.build();
}
