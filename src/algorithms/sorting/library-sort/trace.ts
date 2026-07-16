// =============================================================================
// 图书馆排序 · 录制帧序列
// 通过 librarySort 的钩子，把执行过程录成 Frame[]。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { librarySort, type LibrarySortHooks } from './impl.ts';

export const DEFAULT_INPUT = [8, 3, 5, 1, 9, 2, 7, 4, 6];

/** 录制演示帧序列。 */
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const sorted: number[] = []; // 已排序段（按插入顺序）
  let highlight: number | null = null;

  const snapshot = (note: { zh: string; en: string }): void => {
    const roles: Record<number, BarRole> = {};
    if (highlight !== null && sorted[highlight] !== undefined) roles[highlight] = 'compare';
    rec.begin(note).setBars(rec.barsFrom(sorted, roles)).commit();
    highlight = null;
  };

  snapshot({ zh: `初始数组：${input.join(', ')}`, en: `Initial array: ${input.join(', ')}` });

  const hooks: LibrarySortHooks = {
    onInsert: (v, _pos) => {
      // 维护已排序段快照（pos 是带空槽位置，这里用相对插入位置近似）
      const idx = sorted.findIndex((x) => x > v);
      const insertAt = idx === -1 ? sorted.length : idx;
      sorted.splice(insertAt, 0, v);
      highlight = insertAt;
      snapshot({
        zh: `二分插入 ${v} 到已排序段位置 ${insertAt}`,
        en: `Insert ${v} into sorted region at ${insertAt}`,
      });
    },
    onRebalance: (inserted) => {
      snapshot({
        zh: `空槽耗尽，重排 ${inserted} 个元素并重新预留间隔`,
        en: `Slots exhausted; rebalance ${inserted} elements with new gaps`,
      });
    },
  };

  librarySort(input, hooks);

  rec
    .begin({ zh: '排序完成', en: 'Sorted' })
    .setBars(sorted.map((v) => ({ value: v, role: 'final' as BarRole })))
    .commit();

  return rec.build();
}
