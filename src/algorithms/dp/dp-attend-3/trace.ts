import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { maxMeetings, type AttendHooks, type Interval } from './impl.ts';

export const DEFAULT_INPUT: Interval[] = [
  { start: 1, end: 3 },
  { start: 2, end: 5 },
  { start: 4, end: 6 },
  { start: 6, end: 8 },
  { start: 5, end: 7 },
];

export function buildTrace(intervals: readonly Interval[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const chosen = new Array<boolean>(intervals.length).fill(false);
  rec
    .begin({ zh: `${intervals.length} 个活动`, en: `${intervals.length} meetings` })
    .setBars(
      intervals.map((it) => ({
        value: it.end,
        role: 'default' as BarRole,
        label: `${it.start}-${it.end}`,
      })),
    )
    .commit();
  const hooks: AttendHooks = {
    onPick: (idx, it) => {
      chosen[idx] = true;
      rec
        .begin({ zh: `选 [${it[0]},${it[1]})`, en: `Pick [${it[0]},${it[1]})` })
        .setBars(
          intervals.map((x, j) => ({
            value: x.end,
            role: (j === idx ? 'sorted' : chosen[j] ? 'frontier' : 'default') as BarRole,
            label: `${x.start}-${x.end}`,
          })),
        )
        .commit();
    },
    onSkip: (idx, it) => {
      rec
        .begin({ zh: `跳过 [${it[0]},${it[1]})`, en: `Skip [${it[0]},${it[1]})` })
        .setBars(
          intervals.map((x, j) => ({
            value: x.end,
            role: (j === idx ? 'warn' : chosen[j] ? 'frontier' : 'default') as BarRole,
            label: `${x.start}-${x.end}`,
          })),
        )
        .commit();
    },
  };
  const ans = maxMeetings(intervals, hooks);
  rec
    .begin({ zh: `最多参加=${ans}`, en: `Max attended=${ans}` })
    .setAux([{ label: '答案', value: String(ans), role: 'final' }])
    .commit();
  return rec.build();
}
