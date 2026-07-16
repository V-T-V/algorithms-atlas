// 会议室 II · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { greedyMeetingRooms2, type GreedyMeetingRooms2Hooks, type Interval } from './impl.ts';

export const DEFAULT_INPUT: Interval[] = [
  { start: 0, end: 30 },
  { start: 5, end: 10 },
  { start: 15, end: 20 },
];

export function buildTrace(input: Interval[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();

  rec
    .begin({ zh: `${input.length} 个会议`, en: `${input.length} meetings` })
    .setBars(input.map((iv) => ({ value: iv.end - iv.start, role: 'default' as BarRole })))
    .commit();

  const hooks: GreedyMeetingRooms2Hooks = {
    onEvent: (time, delta, rooms) => {
      rec
        .begin({
          zh: `时刻 ${time} ${delta > 0 ? '开始' : '结束'}，当前 ${rooms} 间`,
          en: `time ${time} ${delta > 0 ? 'start' : 'end'}, ${rooms} rooms`,
        })
        .setBars([{ value: rooms, role: 'pivot' as BarRole }])
        .setAux([{ label: 'rooms', value: String(rooms), role: delta > 0 ? 'warn' : 'compare' }])
        .commit();
    },
  };

  const result = greedyMeetingRooms2(input, hooks);

  rec
    .begin({ zh: `完成：最少 ${result} 间`, en: `Done: min ${result} rooms` })
    .setBars([{ value: result, role: 'final' as BarRole }])
    .setAux([{ label: '最少间数', value: String(result), role: 'final' }])
    .commit();

  return rec.build();
}
