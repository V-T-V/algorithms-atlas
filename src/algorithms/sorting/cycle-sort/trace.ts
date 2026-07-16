// =============================================================================
// 圈排序 · 录制帧序列
// 通过 cycleSort 的钩子，把执行过程录成 Frame[]。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { cycleSort, type CycleSortHooks } from './impl.ts';

export const DEFAULT_INPUT = [5, 2, 8, 1, 4];

/** 录制演示帧序列。 */
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const a = [...input];
  const sorted = new Set<number>();
  let highlight: number | null = null;

  const snapshot = (note: { zh: string; en: string }): void => {
    const roles: Record<number, BarRole> = {};
    for (const s of sorted) roles[s] = 'final';
    if (highlight !== null && !roles[highlight]) roles[highlight] = 'swap';
    rec.begin(note).setBars(rec.barsFrom(a, roles)).commit();
    highlight = null;
  };

  snapshot({ zh: `初始数组：${a.join(', ')}`, en: `Initial array: ${a.join(', ')}` });

  const hooks: CycleSortHooks = {
    onCycleStart: (item, pos) => {
      snapshot({
        zh: `开始循环：值 ${item} 应放到下标 ${pos}`,
        en: `Cycle: value ${item} belongs at index ${pos}`,
      });
    },
    onWrite: (pos, v) => {
      highlight = pos;
      snapshot({
        zh: `把 ${v} 写入下标 ${pos}`,
        en: `Write ${v} to index ${pos}`,
      });
    },
    onCycleEnd: () => {
      // 循环结束后，循环起点通常已就位
    },
  };

  cycleSort(input, hooks);

  for (let i = 0; i < a.length; i++) sorted.add(i);
  rec
    .begin({ zh: '排序完成', en: 'Sorted' })
    .setBars(a.map((v) => ({ value: v, role: 'final' as BarRole })))
    .commit();

  return rec.build();
}
