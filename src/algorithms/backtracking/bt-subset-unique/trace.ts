import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { subsetsWithDup } from './impl.ts';
export const DEFAULT_INPUT = [1, 2, 2];
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const cur: number[] = [];
  rec.begin({ zh: '子集II [' + input.join(',') + ']', en: 'Subsets II' }).commit();
  subsetsWithDup(input, {
    onPick: (v) => {
      cur.push(v);
      rec
        .begin({ zh: '选 ' + v, en: 'pick ' + v })
        .setBars(cur.map((x) => ({ value: x, role: 'pivot' as BarRole })))
        .commit();
    },
    onResult: (s) =>
      rec
        .begin({ zh: '{' + s.join(',') + '}', en: '{' + s.join(',') + '}' })
        .setBars(s.map((x) => ({ value: x, role: 'final' as BarRole })))
        .commit(),
  });
  rec.begin({ zh: '完成', en: 'Done' }).commit();
  return rec.build();
}
