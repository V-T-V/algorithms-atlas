// =============================================================================
// 中位数的中位数 · 录制帧序列
// 通过 medianOfMedians 的钩子，把执行过程录成 Frame[]。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { medianOfMedians, type MedianOfMediansHooks } from './impl.ts';

export const DEFAULT_INPUT = [5, 2, 8, 1, 9, 3, 7, 4, 6, 0, 12, 11];
/** 演示默认查找第几小（0-based）。 */
export const DEFAULT_K = 5;

/** 录制演示帧序列。返回查找第 k 小（0-based）的过程。 */
export function buildTrace(input: number[] = DEFAULT_INPUT, k: number = DEFAULT_K): Frame[] {
  const rec = new TraceRecorder();
  const a = [...input];
  let pivotIdx = -1;
  const pinned = new Set<number>();
  const comparing = new Set<number>();
  let pendingSwap: [number, number] | null = null;
  let doneIdx = -1;

  const snapshot = (note: { zh: string; en: string }): void => {
    const roles: Record<number, BarRole> = {};
    for (const p of pinned) roles[p] = 'final';
    if (pivotIdx >= 0 && !pinned.has(pivotIdx)) roles[pivotIdx] = 'pivot';
    if (pendingSwap) {
      roles[pendingSwap[0]] = 'swap';
      roles[pendingSwap[1]] = 'swap';
    }
    for (const c of comparing) if (!roles[c]) roles[c] = 'compare';
    rec.begin(note).setBars(rec.barsFrom(a, roles)).commit();
    comparing.clear();
    pendingSwap = null;
  };

  snapshot({
    zh: `初始数组，目标：第 ${k + 1} 小（rank=${k}）`,
    en: `Initial array, target: ${k + 1}-th smallest (rank=${k})`,
  });

  const hooks: MedianOfMediansHooks = {
    onPivotChosen: (lo, hi, pivotValue) => {
      snapshot({
        zh: `[${lo}, ${hi}] 选基准（中位数的中位数）= ${pivotValue}`,
        en: `[${lo}, ${hi}] pivot (median of medians) = ${pivotValue}`,
      });
    },
    onPartition: (lo, hi, p) => {
      pivotIdx = p;
      snapshot({
        zh: `划分 [${lo}, ${hi}]，基准 = ${a[p]}（下标 ${p}）`,
        en: `Partition [${lo}, ${hi}], pivot = ${a[p]} (idx ${p})`,
      });
    },
    onCompare: (i) => {
      comparing.add(i);
    },
    onSwap: (i, j) => {
      const tmp = a[i]!;
      a[i] = a[j]!;
      a[j] = tmp;
      pendingSwap = [i, j];
      snapshot({
        zh: `交换下标 ${i} 和 ${j}`,
        en: `Swap indices ${i} ↔ ${j}`,
      });
    },
    onPinned: (i, rank) => {
      pinned.add(i);
      doneIdx = i;
      pivotIdx = -1;
      snapshot({
        zh: `命中：下标 ${i}（值 ${a[i]}）即为第 ${rank + 1} 小`,
        en: `Found: index ${i} (value ${a[i]}) is the ${rank + 1}-th smallest`,
      });
    },
  };

  medianOfMedians(input, k, hooks);

  // 终态：高亮命中的元素
  rec
    .begin({
      zh: doneIdx >= 0 ? `第 ${k + 1} 小 = ${a[doneIdx]}` : '完成',
      en: doneIdx >= 0 ? `${k + 1}-th smallest = ${a[doneIdx]}` : 'Done',
    })
    .setBars(
      a.map((v, i) => ({ value: v, role: (i === doneIdx ? 'final' : 'default') as BarRole })),
    )
    .commit();

  return rec.build();
}
