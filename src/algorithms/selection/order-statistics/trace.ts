// =============================================================================
// 顺序统计量 · 录制帧序列
// 通过 quickselect 的钩子，把执行过程录成 Frame[]。
// 可视化：setBars 渲染数组，role 标分区基准/比较/命中元素。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { quickselect, type OrderStatisticsHooks } from './impl.ts';

export const DEFAULT_INPUT = [5, 2, 8, 1, 9, 3, 7, 4, 6];
/** 演示默认查找第几小（0-based）。 */
export const DEFAULT_K = 4;

/** 录制演示帧序列。返回查找第 k 小（0-based）的过程。 */
export function buildTrace(input: number[] = DEFAULT_INPUT, k: number = DEFAULT_K): Frame[] {
  const rec = new TraceRecorder();
  const a = [...input];
  let pivotIdx = -1;
  const comparing = new Set<number>();
  let pendingSwap: [number, number] | null = null;
  let doneIdx = -1;
  // 当前关注的区间（用于高亮）
  let curLo = 0;
  let curHi = a.length - 1;

  const snapshot = (note: { zh: string; en: string }): void => {
    const roles: Record<number, BarRole> = {};
    // 区间外的标 sorted（已确定无关）
    for (let i = 0; i < a.length; i++) {
      if (i < curLo || i > curHi) roles[i] = 'sorted';
    }
    if (pivotIdx >= 0) roles[pivotIdx] = 'pivot';
    if (pendingSwap) {
      roles[pendingSwap[0]] = 'swap';
      roles[pendingSwap[1]] = 'swap';
    }
    for (const c of comparing) if (!roles[c]) roles[c] = 'compare';
    if (doneIdx >= 0) roles[doneIdx] = 'final';
    rec.begin(note).setBars(rec.barsFrom(a, roles)).commit();
    comparing.clear();
    pendingSwap = null;
  };

  snapshot({
    zh: `初始数组，目标：第 ${k + 1} 小（rank=${k}）`,
    en: `Initial array, target: ${k + 1}-th smallest (rank=${k})`,
  });

  const hooks: OrderStatisticsHooks = {
    onPartition: (lo, hi, p) => {
      curLo = lo;
      curHi = hi;
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
      doneIdx = i;
      pivotIdx = -1;
      snapshot({
        zh: `命中：下标 ${i}（值 ${a[i]}）即为第 ${rank + 1} 小`,
        en: `Found: index ${i} (value ${a[i]}) is the ${rank + 1}-th smallest`,
      });
    },
  };

  const result = quickselect(input, k, hooks);

  // 终态
  rec
    .begin({
      zh: doneIdx >= 0 ? `第 ${k + 1} 小 = ${result}` : '完成',
      en: doneIdx >= 0 ? `${k + 1}-th smallest = ${result}` : 'Done',
    })
    .setBars(
      a.map((v, i) => ({ value: v, role: (i === doneIdx ? 'final' : 'default') as BarRole })),
    )
    .commit();

  return rec.build();
}
