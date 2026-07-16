// =============================================================================
// 堆排序 · 录制帧序列
// 通过 heapSort 的钩子，把执行过程录成 Frame[]。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { heapSort, type HeapSortHooks } from './impl.ts';

export const DEFAULT_INPUT = [5, 2, 8, 1, 9, 3, 7, 4, 6];

/** 录制演示帧序列。 */
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const a = [...input];
  const pinned = new Set<number>(); // 末尾已就位段
  const heap = new Set<number>(); // 当前堆的有效下标
  let heapSize = a.length;
  let cur = -1; // 正在下沉的当前下标
  const comparing = new Set<number>();
  let pendingSwap: [number, number] | null = null;

  const refreshHeap = (): void => {
    heap.clear();
    for (let k = 0; k < heapSize; k++) heap.add(k);
  };
  refreshHeap();

  const snapshot = (note: { zh: string; en: string }): void => {
    const roles: Record<number, BarRole> = {};
    for (const p of pinned) roles[p] = 'final';
    if (pendingSwap) {
      if (!roles[pendingSwap[0]]) roles[pendingSwap[0]] = 'swap';
      if (!roles[pendingSwap[1]]) roles[pendingSwap[1]] = 'swap';
    }
    if (cur >= 0 && !roles[cur] && heap.has(cur)) roles[cur] = 'pivot';
    for (const c of comparing) if (!roles[c] && heap.has(c)) roles[c] = 'compare';
    rec.begin(note).setBars(rec.barsFrom(a, roles)).commit();
    comparing.clear();
    pendingSwap = null;
  };

  snapshot({ zh: `初始数组：${a.join(', ')}`, en: `Initial array: ${a.join(', ')}` });

  const hooks: HeapSortHooks = {
    onBuildPhase: () => {
      snapshot({ zh: '阶段 1：建立大顶堆', en: 'Phase 1: build a max-heap' });
    },
    onSortPhase: () => {
      snapshot({ zh: '阶段 2：反复取堆顶放到末尾', en: 'Phase 2: pop the heap top to the end' });
    },
    onSiftDown: (i) => {
      cur = i;
    },
    onCompare: (i, child) => {
      comparing.add(i);
      comparing.add(child);
    },
    onSwap: (i, j) => {
      const t = a[i]!;
      a[i] = a[j]!;
      a[j] = t;
      pendingSwap = [i, j];
      cur = j; // 下沉后的新位置
      snapshot({
        zh: `下沉：交换下标 ${i} 和 ${j}`,
        en: `Sift-down: swap indices ${i} ↔ ${j}`,
      });
    },
    onPinned: (end) => {
      pinned.add(end);
      heapSize = end; // 堆缩小
      refreshHeap();
      cur = -1;
      snapshot({
        zh: `堆顶最大值 ${a[end]} 就位于下标 ${end}`,
        en: `Heap top ${a[end]} placed at index ${end}`,
      });
    },
  };

  heapSort(input, hooks);

  // 终态
  rec
    .begin({ zh: '排序完成', en: 'Sorted' })
    .setBars(a.map((v) => ({ value: v, role: 'final' as BarRole })))
    .commit();

  return rec.build();
}
