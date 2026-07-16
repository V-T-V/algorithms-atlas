// =============================================================================
// 区间调度 · 录制帧序列
// 用 setBars 展示各区间（柱高=时长，选中=final，考察中=compare），setAux 展示选中列表。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { intervalScheduling, type Interval, type IntervalHooks } from './impl.ts';

export const DEFAULT_INPUT: Interval[] = [
  { start: 1, finish: 4, id: 'A' },
  { start: 3, finish: 5, id: 'B' },
  { start: 0, finish: 6, id: 'C' },
  { start: 5, finish: 7, id: 'D' },
  { start: 3, finish: 9, id: 'E' },
  { start: 5, finish: 9, id: 'F' },
  { start: 6, finish: 10, id: 'G' },
  { start: 8, finish: 12, id: 'H' },
  { start: 8, finish: 11, id: 'I' },
  { start: 2, finish: 14, id: 'J' },
  { start: 12, finish: 16, id: 'K' },
];

export function buildTrace(intervals: readonly Interval[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();

  const selectedIds = new Set<string>();
  let consideringIdx = -1;
  // 用索引标识区间（id 可能缺失）
  const idOf = (it: Interval, i: number): string => it.id ?? `I${i}`;

  const snapshot = (
    note: { zh: string; en: string },
    ordering: Interval[],
    lastEnd: number,
  ): void => {
    const bars = ordering.map((it, i) => {
      const id = idOf(it, i);
      let role: BarRole = 'default';
      if (selectedIds.has(id)) role = 'final';
      else if (i === consideringIdx) role = 'compare';
      const len = Math.max(1, it.finish - it.start);
      return { value: len, role, label: `${id}[${it.start},${it.finish}]` };
    });
    const aux = [
      {
        label: 'lastEnd',
        value: String(lastEnd),
        role: 'pivot' as BarRole,
      },
      {
        label: '已选区间',
        value:
          ordering
            .filter((it, i) => selectedIds.has(idOf(it, i)))
            .map((it, i) => idOf(it, i))
            .join(',') || '∅',
        role: 'frontier' as BarRole,
      },
      {
        label: '已选数量',
        value: String(selectedIds.size),
        role: 'frontier' as BarRole,
      },
    ];
    rec.begin(note).setBars(bars).setAux(aux).commit();
  };

  // 初始：按原顺序展示
  snapshot(
    { zh: `共 ${intervals.length} 个区间`, en: `${intervals.length} intervals` },
    [...intervals],
    -Infinity,
  );

  // 排序后展示
  let sortedOrder: Interval[] = [];
  const hooks: IntervalHooks = {
    onSort: (sorted) => {
      sortedOrder = sorted.map((it, i) => ({ ...it, id: it.id ?? `S${i}` }));
      // 重新映射 id：保持原 id
      sortedOrder = sorted;
      snapshot({ zh: `按结束时间排序`, en: `Sort by finish time` }, sorted, -Infinity);
    },
    onConsider: (it, lastEnd, sel) => {
      consideringIdx = sortedOrder.indexOf(it);
      if (sel) selectedIds.add(idOf(it, consideringIdx));
      snapshot(
        {
          zh: sel
            ? `选中 ${idOf(it, consideringIdx)}（start ≥ lastEnd）`
            : `跳过 ${idOf(it, consideringIdx)}（与已选重叠）`,
          en: sel
            ? `Select ${idOf(it, consideringIdx)} (start ≥ lastEnd)`
            : `Skip ${idOf(it, consideringIdx)} (overlaps)`,
        },
        sortedOrder,
        lastEnd,
      );
    },
  };

  intervalScheduling(intervals, hooks);

  // 终态
  rec
    .begin({
      zh: `完成：选出 ${selectedIds.size} 个不重叠区间`,
      en: `Done: selected ${selectedIds.size} non-overlapping intervals`,
    })
    .setBars(
      sortedOrder.map((it, i) => ({
        value: Math.max(1, it.finish - it.start),
        role: (selectedIds.has(idOf(it, i)) ? 'final' : 'default') as BarRole,
        label: `${idOf(it, i)}[${it.start},${it.finish}]`,
      })),
    )
    .setAux([{ label: '最大不重叠数', value: String(selectedIds.size), role: 'final' as BarRole }])
    .commit();

  return rec.build();
}
