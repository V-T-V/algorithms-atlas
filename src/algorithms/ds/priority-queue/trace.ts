// =============================================================================
// 优先队列 · 录制帧序列
// 用 setArray 展示堆数组，pointers 标堆顶；setAux 展示弹出序列。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { PriorityQueue, type PriorityQueueHooks } from './impl.ts';

export const DEFAULT_INPUT = {
  build: [9, 4, 7, 1, 5, 3, 8],
  push: [2],
  pop: 4,
};

/** 录制演示帧序列。 */
export function buildTrace(
  input: { build: readonly number[]; push?: readonly number[]; pop?: number } = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();
  const pq = new PriorityQueue(); // 最小堆
  const popped: number[] = [];

  let arr: number[] = [];
  const compare = new Set<number>();
  const swapped = new Set<number>();

  const snapshot = (note: { zh: string; en: string }): void => {
    const roles: BarRole[] = arr.map(() => 'default');
    swapped.forEach((i) => {
      if (i < roles.length) roles[i] = 'swap';
    });
    compare.forEach((i) => {
      if (i < roles.length && roles[i] !== 'swap') roles[i] = 'compare';
    });
    const pointers: Array<{ index: number; label: string }> = [];
    if (arr.length > 0) pointers.push({ index: 0, label: 'top' });
    rec
      .begin(note)
      .setArray(arr, roles, pointers)
      .setAux([
        {
          label: '弹出序列',
          value: `[${popped.join(', ')}]`,
          role: popped.length ? 'final' : 'default',
        },
        { label: '堆性质', value: '最小堆：父 ≤ 子' },
      ])
      .commit();
    compare.clear();
    swapped.clear();
  };

  const hooks: PriorityQueueHooks = {
    onCompare: (i, j) => {
      arr = pq.toArray();
      compare.add(i);
      compare.add(j);
    },
    onSwap: (i, j) => {
      arr = pq.toArray();
      swapped.add(i);
      swapped.add(j);
      snapshot({ zh: `交换 ${i} ↔ ${j}`, en: `Swap ${i} ↔ ${j}` });
    },
    onInsertDone: (idx, value) => {
      arr = pq.toArray();
      swapped.add(idx);
      snapshot({ zh: `插入 ${value}（上浮落点 ${idx}）`, en: `Push ${value} (settled at ${idx})` });
    },
    onExtractDone: (value) => {
      arr = pq.toArray();
      popped.push(value);
      snapshot({ zh: `弹出堆顶 ${value}`, en: `Pop top ${value}` });
    },
  };

  // 阶段 1：建堆
  arr = [...input.build];
  snapshot({ zh: `初始数组：${arr.join(', ')}`, en: `Initial array: ${arr.join(', ')}` });
  pq.buildHeap(input.build, hooks);
  arr = pq.toArray();
  snapshot({ zh: '建堆完成（最小堆）', en: 'Heap built (min-heap)' });

  // 阶段 2：插入
  for (const v of input.push ?? []) {
    pq.push(v, hooks);
    arr = pq.toArray();
  }

  // 阶段 3：弹出
  for (let k = 0; k < (input.pop ?? 0); k++) {
    if (pq.isEmpty()) break;
    pq.pop(hooks);
    arr = pq.toArray();
  }

  // 终态
  arr = pq.toArray();
  rec
    .begin({
      zh: `完成；堆内：[${arr.join(', ')}]，弹出序列：[${popped.join(', ')}]`,
      en: `Done; heap: [${arr.join(', ')}], popped: [${popped.join(', ')}]`,
    })
    .setArray(
      arr,
      arr.map(() => 'final' as BarRole),
      arr.length > 0 ? [{ index: 0, label: 'top' }] : [],
    )
    .setAux([
      { label: '弹出序列', value: `[${popped.join(', ')}]`, role: 'final' },
      { label: '堆性质', value: '最小堆：父 ≤ 子' },
    ])
    .commit();

  return rec.build();
}
