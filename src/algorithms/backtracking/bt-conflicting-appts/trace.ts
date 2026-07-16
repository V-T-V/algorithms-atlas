import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { maxNonConflict, type Appt } from './impl.ts';
export const DEFAULT_INPUT: Appt[] = [
  { start: 1, end: 3 },
  { start: 2, end: 5 },
  { start: 4, end: 6 },
  { start: 6, end: 7 },
  { start: 5, end: 8 },
  { start: 7, end: 9 },
];
export function buildTrace(input: Appt[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const picked: number[] = [];
  rec.begin({ zh: '最大不冲突预约', en: 'Max non-conflict' }).commit();
  maxNonConflict(input, {
    onPick: (i) => {
      picked.push(i);
      rec
        .begin({ zh: '选预约 ' + i, en: 'pick ' + i })
        .setBars(picked.map((p) => ({ value: input[p]!.end, role: 'pivot' as BarRole })))
        .commit();
    },
  });
  rec.begin({ zh: '完成', en: 'Done' }).commit();
  return rec.build();
}
