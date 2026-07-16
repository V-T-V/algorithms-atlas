import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { combinationSum3 } from './impl.ts';
export const DEFAULT_INPUT = { k: 3, n: 7 };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const cur: number[] = [];
  rec
    .begin({ zh: 'k=' + input.k + ' n=' + input.n, en: 'k=' + input.k + ' n=' + input.n })
    .commit();
  combinationSum3(input.k, input.n, {
    onPick: (v) => {
      cur.push(v);
      rec
        .begin({ zh: '选 ' + v, en: 'pick ' + v })
        .setBars(cur.map((x) => ({ value: x, role: 'pivot' as BarRole })))
        .commit();
    },
    onResult: (c) =>
      rec
        .begin({ zh: '{' + c.join(',') + '}', en: '{' + c.join(',') + '}' })
        .setBars(c.map((x) => ({ value: x, role: 'final' as BarRole })))
        .commit(),
  });
  rec.begin({ zh: '完成', en: 'Done' }).commit();
  return rec.build();
}
