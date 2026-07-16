// 快速选择（Hoare 双指针）· 录制帧序列

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { quickselectHoare, type HoareSelectHooks } from './impl.ts';

export const DEFAULT_INPUT = { arr: [7, 2, 9, 4, 1, 8, 5, 3, 6], k: 4 };

export function buildTrace(input: { arr: number[]; k: number } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { arr, k } = input;
  const a = [...arr];
  let ptrI = -1;
  let ptrJ = -1;
  let pendingSwap: [number, number] | null = null;
  // 当前活跃区间外的元素置为 sorted（已脱离搜索）
  let activeLo = 0;
  let activeHi = a.length - 1;

  const snapshot = (note: { zh: string; en: string }): void => {
    const roles: Record<number, BarRole> = {};
    for (let idx = 0; idx < a.length; idx++) {
      if (idx < activeLo || idx > activeHi) roles[idx] = 'sorted';
    }
    if (pendingSwap) {
      roles[pendingSwap[0]] = 'swap';
      roles[pendingSwap[1]] = 'swap';
    }
    if (ptrI >= 0 && roles[ptrI] === undefined) roles[ptrI] = 'compare';
    if (ptrJ >= 0 && roles[ptrJ] === undefined) roles[ptrJ] = 'pivot';
    rec.begin(note).setBars(rec.barsFrom(a, roles)).commit();
    pendingSwap = null;
  };

  snapshot({ zh: `找第 ${k + 1} 小（0-based k=${k}）`, en: `Find rank-${k} (0-based)` });

  const hooks: HoareSelectHooks = {
    onPartition: (lo, hi, pv) => {
      activeLo = lo;
      activeHi = hi;
      ptrI = -1;
      ptrJ = -1;
      snapshot({
        zh: `划分 [${lo}, ${hi}]，基准值 = ${pv}`,
        en: `Partition [${lo}, ${hi}], pivot value = ${pv}`,
      });
    },
    onScan: (i, j) => {
      ptrI = i;
      ptrJ = j;
    },
    onSwap: (i, j) => {
      const t = a[i]!;
      a[i] = a[j]!;
      a[j] = t;
      pendingSwap = [i, j];
      snapshot({ zh: `交换 ${i} ↔ ${j}`, en: `Swap ${i} ↔ ${j}` });
    },
    onPinned: (p) => {
      ptrI = -1;
      ptrJ = -1;
      snapshot({
        zh: `划分点 = ${p}（左段 [${activeLo},${p}]，右段 [${p + 1},${activeHi}]）`,
        en: `Split at ${p} (left [${activeLo},${p}], right [${p + 1},${activeHi}])`,
      });
    },
  };

  const ans = quickselectHoare(arr, k, hooks);
  const roles: Record<number, BarRole> = {};
  for (let i = 0; i < a.length; i++) roles[i] = 'final';
  rec
    .begin({ zh: `第 ${k + 1} 小 = ${ans}`, en: `Rank-${k + 1} smallest = ${ans}` })
    .setBars(rec.barsFrom(a, roles))
    .commit();

  return rec.build();
}
