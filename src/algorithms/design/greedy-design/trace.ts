// =============================================================================
// 贪心设计范式 · 录制帧序列
// 用 setArray 展示排序后的区间端点；用 setAux 展示当前选择与原因。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { intervalSchedule, type Interval } from './impl.ts';

export const DEFAULT_INPUT: Interval[] = [
  { start: 1, end: 4 },
  { start: 3, end: 5 },
  { start: 0, end: 6 },
  { start: 5, end: 7 },
  { start: 3, end: 9 },
  { start: 5, end: 9 },
  { start: 6, end: 10 },
  { start: 8, end: 11 },
  { start: 8, end: 12 },
  { start: 2, end: 14 },
  { start: 12, end: 16 },
];

interface TraceOptions {
  intervals: Interval[];
}

export function buildTrace(input: Partial<TraceOptions> = {}): Frame[] {
  const intervals = input.intervals ?? DEFAULT_INPUT;
  const rec = new TraceRecorder();

  let sorted: Interval[] = [];
  const picked: Interval[] = [];
  let lastEnd = -Infinity;
  let curIdx = -1;

  const render = (note: { zh: string; en: string }): void => {
    const maxEnd = sorted.length > 0 ? Math.max(...sorted.map((iv) => iv.end)) : 1;
    rec
      .begin(note)
      .setBars(
        sorted.map((iv, i) => ({
          value: iv.end - iv.start,
          role: (i === curIdx
            ? 'swap'
            : picked.some((p) => p.start === iv.start && p.end === iv.end)
              ? 'final'
              : 'default') as BarRole,
          label: `[${iv.start},${iv.end})`,
        })),
      )
      .setAux([
        { label: '策略', value: '按 end 升序，选最早结束', role: 'pivot' as BarRole },
        { label: '上次 end', value: String(lastEnd), role: 'compare' as BarRole },
        {
          label: '已选区间',
          value: picked.map((p) => `[${p.start},${p.end})`).join(' '),
          role: 'final' as BarRole,
        },
        { label: '已选数', value: String(picked.length), role: 'final' as BarRole },
        { label: '时间轴上限', value: String(maxEnd), role: 'frontier' as BarRole },
      ])
      .commit();
  };

  render({ zh: `初始 ${intervals.length} 个区间`, en: `Initial ${intervals.length} intervals` });

  intervalSchedule(intervals, {
    onSort: (s) => {
      sorted = [...s];
      render({ zh: `排序：按 end 升序`, en: `Sort by end ascending` });
    },
    onPick: (iv, idx, le) => {
      curIdx = idx;
      picked.push(iv);
      lastEnd = le;
      render({
        zh: `选中 [${iv.start},${iv.end})（不与上次 end=${le - (iv.end - iv.start)}冲突）`,
        en: `Pick [${iv.start},${iv.end}) (no conflict)`,
      });
    },
    onSkip: (iv, reason) => {
      const idx = sorted.findIndex((s) => s.start === iv.start && s.end === iv.end);
      curIdx = idx;
      render({
        zh: `跳过 [${iv.start},${iv.end})（${reason}）`,
        en: `Skip [${iv.start},${iv.end}) (${reason})`,
      });
    },
  });

  rec
    .begin({
      zh: `完成：最多选 ${picked.length} 个不相交区间`,
      en: `Done: max ${picked.length} non-overlapping intervals`,
    })
    .setBars(
      sorted.map((iv) => ({
        value: iv.end - iv.start,
        role: (picked.some((p) => p.start === iv.start && p.end === iv.end)
          ? 'sorted'
          : 'default') as BarRole,
        label: `[${iv.start},${iv.end})`,
      })),
    )
    .setAux([
      {
        label: '结果',
        value: picked.map((p) => `[${p.start},${p.end})`).join(' '),
        role: 'final' as BarRole,
      },
      { label: '复杂度', value: 'O(n log n)', role: 'final' as BarRole },
    ])
    .commit();

  return rec.build();
}
