// =============================================================================
// Tim排序 · 录制帧序列
// 通过 timsort 的钩子，把执行过程录成 Frame[]。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { timsort, type TimSortHooks } from './impl.ts';

export const DEFAULT_INPUT = [5, 2, 8, 1, 9, 3, 7, 4, 6];

/** 录制演示帧序列。 */
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const a = [...input];
  const comparing = new Set<number>();
  const swapped = new Set<number>();
  const writing = new Set<number>();
  let runRange: { lo: number; hi: number } | null = null;
  let mergeRange: { lo: number; hi: number } | null = null;

  const snapshot = (note: { zh: string; en: string }): void => {
    const roles: Record<number, BarRole> = {};
    if (mergeRange) {
      for (let k = mergeRange.lo; k <= mergeRange.hi; k++) roles[k] = 'frontier';
    }
    if (runRange) {
      for (let k = runRange.lo; k <= runRange.hi; k++) if (!roles[k]) roles[k] = 'sorted';
    }
    for (const c of comparing) if (!roles[c]) roles[c] = 'compare';
    swapped.forEach((i) => {
      if (!roles[i]) roles[i] = 'swap';
    });
    writing.forEach((i) => {
      roles[i] = 'swap';
    });
    rec.begin(note).setBars(rec.barsFrom(a, roles)).commit();
    comparing.clear();
    swapped.clear();
    writing.clear();
  };

  snapshot({ zh: `初始数组：${a.join(', ')}`, en: `Initial array: ${a.join(', ')}` });

  const hooks: TimSortHooks = {
    onRun: (lo, hi) => {
      runRange = { lo, hi };
      snapshot({
        zh: `识别 run [${lo}, ${hi}]`,
        en: `Identified run [${lo}, ${hi}]`,
      });
      runRange = null;
    },
    onInsertionSort: (lo, hi) => {
      snapshot({
        zh: `段过短，插入排序补齐 [${lo}, ${hi}]`,
        en: `Run too short, insertion sort [${lo}, ${hi}]`,
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
      swapped.add(i);
      swapped.add(j);
      snapshot({
        zh: `翻转/位移：交换 ${i} ↔ ${j}`,
        en: `Reverse/shift: swap ${i} ↔ ${j}`,
      });
    },
    onMerge: (lo, mid, hi) => {
      runRange = null;
      mergeRange = { lo, hi };
      snapshot({
        zh: `归并 [${lo}, ${mid}] 与 [${mid + 1}, ${hi}]`,
        en: `Merge [${lo}, ${mid}] and [${mid + 1}, ${hi}]`,
      });
    },
    onWrite: (dest, value) => {
      a[dest] = value;
      writing.add(dest);
      snapshot({
        zh: `写入 ${value} → 下标 ${dest}`,
        en: `Write ${value} → index ${dest}`,
      });
    },
  };

  timsort(input, hooks);
  mergeRange = null;
  runRange = null;

  // 终态
  rec
    .begin({ zh: '排序完成', en: 'Sorted' })
    .setBars(a.map((v) => ({ value: v, role: 'final' as BarRole })))
    .commit();

  return rec.build();
}
