// =============================================================================
// 优化冒泡排序 · 录制帧序列
// 通过 optimizedBubbleSort 的钩子，把执行过程录成 Frame[]。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { optimizedBubbleSort, type OptimizedBubbleHooks } from './impl.ts';

export const DEFAULT_INPUT = [5, 1, 2, 3, 4, 9, 8, 7, 6];

/** 录制演示帧序列。 */
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const a = [...input];
  const sorted = new Set<number>();
  const comparing = new Set<number>();
  let pendingSwap: [number, number] | null = null;
  let curEnd = a.length;
  let curLastSwap = -1;

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

  const hooks: OptimizedBubbleHooks = {
    onPassStart: (pass, end) => {
      curEnd = end;
      snapshot({
        zh: `第 ${pass + 1} 轮：扫描 [0, ${end})`,
        en: `Pass ${pass + 1}: scan [0, ${end})`,
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
    onLastSwap: (lastSwap) => {
      curLastSwap = lastSwap;
      snapshot({
        zh: `本轮最后交换在 ${lastSwap}；下一轮上界收紧到 ${lastSwap}`,
        en: `Last swap at ${lastSwap}; next upper bound shrinks to ${lastSwap}`,
      });
    },
    onEarlyExit: () => {
      snapshot({
        zh: `本轮无交换 → 数组已有序，提前结束`,
        en: `No swap this pass → array sorted, early exit`,
      });
    },
    onSorted: (i) => {
      sorted.add(i);
    },
  };

  optimizedBubbleSort(input, hooks);

  void curEnd;
  void curLastSwap;

  // 终态
  rec
    .begin({ zh: '排序完成', en: 'Sorted' })
    .setBars(a.map((v) => ({ value: v, role: 'final' as BarRole })))
    .commit();

  return rec.build();
}
