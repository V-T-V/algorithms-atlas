// 会议室 · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { greedyMeetingRooms, type GreedyMeetingRoomsHooks, type Interval } from './impl.ts';

export const DEFAULT_INPUT: Interval[] = [
  { start: 0, end: 30 },
  { start: 5, end: 10 },
  { start: 15, end: 20 },
];

export function buildTrace(input: Interval[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();

  rec
    .begin({
      zh: `${input.length} 个会议区间`,
      en: `${input.length} meeting intervals`,
    })
    .setBars(input.map((iv) => ({ value: iv.end, role: 'default' as BarRole })))
    .commit();

  const hooks: GreedyMeetingRoomsHooks = {
    onSort: (sorted) => {
      rec
        .begin({ zh: '按开始时间排序', en: 'Sorted by start time' })
        .setBars(sorted.map((iv) => ({ value: iv.end, role: 'pivot' as BarRole })))
        .commit();
    },
    onCompare: (i, prev, cur, overlap) => {
      rec
        .begin({
          zh: `[${prev.start},${prev.end}] vs [${cur.start},${cur.end}]：${overlap ? '重叠' : '不重叠'}`,
          en: `[${prev.start},${prev.end}] vs [${cur.start},${cur.end}]: ${overlap ? 'overlap' : 'ok'}`,
        })
        .setBars(
          input.map((_, idx) => ({
            value: input[idx]!.end,
            role: (idx === i - 1 || idx === i
              ? overlap
                ? 'warn'
                : 'compare'
              : 'default') as BarRole,
          })),
        )
        .commit();
    },
  };

  const result = greedyMeetingRooms(input, hooks);

  rec
    .begin({
      zh: `结论：${result ? '可全部安排' : '有冲突'}`,
      en: `Result: ${result ? 'can attend all' : 'conflict'}`,
    })
    .setAux([{ label: '结论', value: result ? 'YES' : 'NO', role: result ? 'final' : 'warn' }])
    .commit();

  return rec.build();
}
