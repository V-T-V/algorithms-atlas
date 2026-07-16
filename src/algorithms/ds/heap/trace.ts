// =============================================================================
// 二叉堆 · 录制帧序列
// 通过 BinaryHeap 的钩子，把执行过程录成 Frame[]。用 setBars 展示数组表示的堆。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { BinaryHeap, type HeapHooks } from './impl.ts';

/** 演示输入：先建堆，再插入一个值，再连续弹出（堆排序）。 */
export const DEFAULT_INPUT = {
  build: [9, 4, 7, 1, 5, 3, 8],
  insert: [2],
  extract: 4,
};

/** 录制演示帧序列。 */
export function buildTrace(
  input: { build: readonly number[]; insert?: readonly number[]; extract?: number } = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();
  const heap = new BinaryHeap(); // 最小堆

  let arr: number[] = [];
  const compare = new Set<number>();
  const swapped = new Set<number>();

  const snapshot = (note: { zh: string; en: string }): void => {
    const roles: Record<number, BarRole> = {};
    swapped.forEach((i) => {
      roles[i] = 'swap';
    });
    compare.forEach((i) => {
      if (!roles[i]) roles[i] = 'compare';
    });
    rec.begin(note).setBars(rec.barsFrom(arr, roles)).commit();
    compare.clear();
    swapped.clear();
  };

  // 钩子：每次比较/交换后，直接从堆刷新 arr，保证始终与内部数组一致
  // （insert 的 push、extract 的 pop 都已在内部完成，刷新即可对齐下标）。
  const hooks: HeapHooks = {
    onCompare: (i, j) => {
      arr = heap.toArray();
      compare.add(i);
      compare.add(j);
    },
    onSwap: (i, j) => {
      arr = heap.toArray();
      swapped.add(i);
      swapped.add(j);
      snapshot({ zh: `交换下标 ${i} ↔ ${j}`, en: `Swap ${i} ↔ ${j}` });
    },
  };

  // —— 阶段 1：建堆（Floyd，O(n)）——
  arr = [...input.build];
  snapshot({ zh: `初始数组：${arr.join(', ')}`, en: `Initial array: ${arr.join(', ')}` });
  heap.buildHeap(input.build, hooks);
  arr = heap.toArray();
  snapshot({ zh: '建堆完成（最小堆：父 ≤ 子）', en: 'Heap built (min-heap: parent ≤ child)' });

  // —— 阶段 2：插入（末尾加 + 上浮）——
  for (const v of input.insert ?? []) {
    heap.insert(v, hooks);
    arr = heap.toArray();
    snapshot({ zh: `插入 ${v}（上浮恢复堆序）`, en: `Insert ${v} (sift up)` });
  }

  // —— 阶段 3：弹出（堆顶取最小 + 末尾换顶 + 下沉 → 升序输出）——
  const popped: number[] = [];
  for (let k = 0; k < (input.extract ?? 0); k++) {
    const top = heap.peek();
    if (top === undefined) break;
    arr = heap.toArray();
    compare.add(0);
    snapshot({ zh: `准备弹出堆顶 ${top}`, en: `About to extract min ${top}` });
    compare.clear();
    const out = heap.extract(hooks);
    arr = heap.toArray();
    if (out !== undefined) popped.push(out);
    snapshot({ zh: `弹出 ${out}（末尾换顶后下沉）`, en: `Extracted ${out} (sift down)` });
  }

  // 终态
  arr = heap.toArray();
  rec
    .begin({
      zh: `完成；堆内：[${arr.join(', ')}]，弹出序列：[${popped.join(', ')}]`,
      en: `Done; heap: [${arr.join(', ')}], extracted: [${popped.join(', ')}]`,
    })
    .setBars(arr.map((v) => ({ value: v, role: 'final' as BarRole })))
    .commit();

  return rec.build();
}
