// =============================================================================
// 归并排序 · 录制帧序列
// 通过 mergeSort 的钩子，把执行过程录成 Frame[]。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { mergeSort, type MergeSortHooks } from './impl.ts';

export const DEFAULT_INPUT = [5, 2, 8, 1, 9, 3, 7, 4, 6];

/** 录制演示帧序列。 */
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const a = [...input];
  const comparing = new Set<number>();
  let writing: number | null = null;
  let mergeRange: { lo: number; hi: number } | null = null;

  const snapshot = (note: { zh: string; en: string }): void => {
    const roles: Record<number, BarRole> = {};
    if (mergeRange) {
      for (let k = mergeRange.lo; k <= mergeRange.hi; k++) roles[k] = 'frontier';
    }
    for (const c of comparing) if (!roles[c] || roles[c] === 'frontier') roles[c] = 'compare';
    if (writing !== null) roles[writing] = 'swap';
    rec.begin(note).setBars(rec.barsFrom(a, roles)).commit();
    comparing.clear();
    writing = null;
  };

  snapshot({ zh: `初始数组：${a.join(', ')}`, en: `Initial array: ${a.join(', ')}` });

  const hooks: MergeSortHooks = {
    onSplit: (lo, mid, hi) => {
      snapshot({
        zh: `分割 [${lo}, ${hi}] → [${lo}, ${mid}] + [${mid + 1}, ${hi}]`,
        en: `Split [${lo}, ${hi}] → [${lo}, ${mid}] + [${mid + 1}, ${hi}]`,
      });
    },
    onMergeStart: (lo, mid, hi) => {
      mergeRange = { lo, hi };
      snapshot({
        zh: `合并 [${lo}, ${mid}] 与 [${mid + 1}, ${hi}]`,
        en: `Merging [${lo}, ${mid}] and [${mid + 1}, ${hi}]`,
      });
    },
    onCompare: (i, j) => {
      comparing.add(i);
      comparing.add(j);
    },
    onWrite: (dest, value) => {
      a[dest] = value;
      writing = dest;
      snapshot({
        zh: `写入值 ${value} 到下标 ${dest}`,
        en: `Write value ${value} to index ${dest}`,
      });
    },
  };

  mergeSort(input, hooks);
  mergeRange = null;

  // 终态
  rec
    .begin({ zh: '排序完成', en: 'Sorted' })
    .setBars(a.map((v) => ({ value: v, role: 'final' as BarRole })))
    .commit();

  return rec.build();
}
