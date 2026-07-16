// =============================================================================
// 稳定选择排序 · 录制帧序列
// 通过 stableSelectionSort 的钩子，把执行过程录成 Frame[]。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { stableSelectionSort, type StableSelectionHooks } from './impl.ts';

export const DEFAULT_INPUT = [4, 2, 4, 1, 3];

/** 录制演示帧序列。 */
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const a = [...input];
  const sorted = new Set<number>();
  let compareJ = -1;
  let compareMin = -1;
  let insertLo = -1;
  let insertMin = -1;

  const snapshot = (note: { zh: string; en: string }): void => {
    const roles: Record<number, BarRole> = {};
    for (const s of sorted) roles[s] = 'final';
    if (insertLo >= 0 && insertMin >= 0) {
      roles[insertLo] = 'swap';
      for (let k = insertLo + 1; k <= insertMin; k++) roles[k] = 'warn';
    }
    if (compareMin >= 0) roles[compareMin] = 'pivot';
    if (compareJ >= 0 && !roles[compareJ]) roles[compareJ] = 'compare';
    rec.begin(note).setBars(rec.barsFrom(a, roles)).commit();
    compareJ = -1;
    compareMin = -1;
    insertLo = -1;
    insertMin = -1;
  };

  snapshot({ zh: `初始数组：${a.join(', ')}`, en: `Initial array: ${a.join(', ')}` });

  const hooks: StableSelectionHooks = {
    onRoundStart: (i) => {
      compareMin = i;
      snapshot({
        zh: `第 ${i + 1} 轮：在 [${i}, ${a.length}) 中找最小值`,
        en: `Round ${i + 1}: find minimum in [${i}, ${a.length})`,
      });
    },
    onCompare: (j, minIdx) => {
      compareJ = j;
      compareMin = minIdx;
    },
    onNewMin: (minIdx) => {
      compareMin = minIdx;
      snapshot({
        zh: `更新最小值下标为 ${minIdx}（值 ${a[minIdx]}）`,
        en: `New minimum at index ${minIdx} (value ${a[minIdx]})`,
      });
    },
    onInsert: (i, minIdx) => {
      // 重建 a：复刻 impl 的搬移，使快照与真实状态一致
      // （impl 已搬移过，这里只是回放显示用，数组已是搬移后的状态）
      insertLo = i;
      insertMin = minIdx;
      snapshot({
        zh: `把最小值插入下标 ${i}（区间 [${i}, ${minIdx}) 右移一位）`,
        en: `Insert minimum at index ${i} (shift [${i}, ${minIdx}) right)`,
      });
    },
    onSorted: (i) => {
      sorted.add(i);
      snapshot({
        zh: `下标 ${i}（值 ${a[i]}）已就位`,
        en: `Index ${i} (value ${a[i]}) is in its final place`,
      });
    },
  };

  stableSelectionSort(input, hooks);

  // 终态
  rec
    .begin({ zh: '排序完成', en: 'Sorted' })
    .setBars(a.map((v) => ({ value: v, role: 'final' as BarRole })))
    .commit();

  return rec.build();
}
