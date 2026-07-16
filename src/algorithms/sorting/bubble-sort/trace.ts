// =============================================================================
// 冒泡排序 · 录制帧序列
// 通过 bubbleSort 的钩子，把执行过程录成 Frame[]。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { bubbleSort, type BubbleSortHooks } from './impl.ts';

export const DEFAULT_INPUT = [5, 2, 8, 1, 9, 3, 7, 4, 6];

/** 录制演示帧序列。 */
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const a = [...input];
  const sorted = new Set<number>();
  const comparing = new Set<number>();
  let pendingSwap: [number, number] | null = null;

  const snapshot = (note: { zh: string; en: string }): void => {
    const roles: Record<number, BarRole> = {};
    for (const s of sorted) roles[s] = 'final';
    if (pendingSwap) {
      roles[pendingSwap[0]] = 'swap';
      roles[pendingSwap[1]] = 'swap';
    }
    for (const c of comparing) if (!roles[c]) roles[c] = 'compare';
    rec.begin(note).setBars(rec.barsFrom(a, roles)).commit();
    comparing.clear();
    pendingSwap = null;
  };

  snapshot({ zh: `初始数组：${a.join(', ')}`, en: `Initial array: ${a.join(', ')}` });

  const hooks: BubbleSortHooks = {
    onPassStart: (pass, hi) => {
      snapshot({
        zh: `第 ${pass + 1} 轮：扫描到下标 ${hi}`,
        en: `Pass ${pass + 1}: scanning up to index ${hi}`,
      });
    },
    onCompare: (i, j) => {
      comparing.add(i);
      comparing.add(j);
    },
    onSwap: (i, j) => {
      const t = a[i]!;
      a[i] = a[j]!;
      a[j] = t;
      pendingSwap = [i, j];
      snapshot({
        zh: `${a[i]} > ${a[j]}？是，交换下标 ${i} 和 ${j}`,
        en: `${a[i]} > ${a[j]}? Yes, swap indices ${i} ↔ ${j}`,
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

  bubbleSort(input, hooks);

  // 终态
  rec
    .begin({ zh: '排序完成', en: 'Sorted' })
    .setBars(a.map((v) => ({ value: v, role: 'final' as BarRole })))
    .commit();

  return rec.build();
}
