// 区间覆盖 · 录制帧序列

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { intervalCover, type Interval, type IntervalCoverHooks } from './impl.ts';

export interface IcInput {
  intervals: Interval[];
  target: { L: number; R: number };
}

export const DEFAULT_INPUT: IcInput = {
  intervals: [
    { start: 0, end: 3 },
    { start: 1, end: 6 },
    { start: 3, end: 5 },
    { start: 4, end: 9 },
    { start: 8, end: 10 },
  ],
  target: { L: 0, R: 10 },
};

/** 录制演示帧序列。 */
export function buildTrace(input: IcInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { intervals, target } = input;

  rec
    .begin({
      zh: `${intervals.length} 个区间，覆盖 [${target.L}, ${target.R}]`,
      en: `${intervals.length} intervals, cover [${target.L}, ${target.R}]`,
    })
    .setBars(intervals.map((it) => ({ value: it.end - it.start, role: 'default' as BarRole })))
    .commit();

  const hooks: IntervalCoverHooks = {
    onPick: (idx) => {
      rec
        .begin({ zh: `选中区间 ${idx}`, en: `Pick interval ${idx}` })
        .setBars(
          intervals.map((_, i) => ({
            value: intervals[i]!.end - intervals[i]!.start,
            role: (i === idx ? 'final' : 'default') as BarRole,
          })),
        )
        .commit();
    },
  };
  const { chosen } = intervalCover(intervals, target, hooks);

  rec
    .begin({ zh: `完成：用 ${chosen.length} 个区间`, en: `Done: used ${chosen.length} intervals` })
    .setMap([{ key: '区间数', value: String(chosen.length), role: 'final' as BarRole }])
    .commit();

  return rec.build();
}
