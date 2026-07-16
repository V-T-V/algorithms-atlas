// =============================================================================
// 珠算排序 · 录制帧序列
// 通过 beadSort 的钩子，把执行过程录成 Frame[]。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { beadSort, type BeadSortHooks } from './impl.ts';

export const DEFAULT_INPUT = [5, 2, 8, 1, 6];

/** 录制演示帧序列。 */
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const a = [...input];
  const dropped = new Set<number>();
  let highlight: number | null = null;

  const snapshot = (note: { zh: string; en: string }): void => {
    const roles: Record<number, BarRole> = {};
    for (const d of dropped) roles[d] = 'frontier';
    if (highlight !== null && !roles[highlight]) roles[highlight] = 'compare';
    rec.begin(note).setBars(rec.barsFrom(a, roles)).commit();
    highlight = null;
  };

  snapshot({ zh: `初始数组：${a.join(', ')}`, en: `Initial array: ${a.join(', ')}` });

  const hooks: BeadSortHooks = {
    onDrop: (i, rowCount) => {
      dropped.add(i);
      highlight = i;
      snapshot({
        zh: `第 ${i} 个元素 ${rowCount} 颗珠子下落`,
        en: `Element ${i} drops ${rowCount} beads`,
      });
    },
    onReadRow: (i, newV) => {
      a[i] = newV;
      highlight = i;
      snapshot({
        zh: `读出第 ${i} 行：值变为 ${newV}`,
        en: `Read row ${i}: value becomes ${newV}`,
      });
    },
  };

  beadSort(input, hooks);

  rec
    .begin({ zh: '排序完成', en: 'Sorted' })
    .setBars(a.map((v) => ({ value: v, role: 'final' as BarRole })))
    .commit();

  return rec.build();
}
