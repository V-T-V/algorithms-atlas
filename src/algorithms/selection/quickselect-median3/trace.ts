// 快速选择（三数取中）· 录制帧序列

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { quickselectMedian3, type QuickSelectMedian3Hooks } from './impl.ts';

export const DEFAULT_INPUT = { arr: [9, 8, 7, 6, 5, 4, 3, 2, 1], k: 4 };

export function buildTrace(input: { arr: number[]; k: number } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { arr, k } = input;
  const a = [...arr];
  const pinned = new Set<number>();
  let pivotIdx = -1;
  const comparing = new Set<number>();
  let pendingSwap: [number, number] | null = null;

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
    zh: `三数取中快选，找第 ${k + 1} 小`,
    en: `Median-of-3 quickselect for rank-${k + 1}`,
  });

  const hooks: QuickSelectMedian3Hooks = {
    onPivotChoice: (_lo, _mid, _hi, pivot) => {
      pivotIdx = a.length - 1;
      snapshot({ zh: `三数取中 → 基准 ${pivot}`, en: `Median-of-3 → pivot ${pivot}` });
    },
    onPartition: (lo, hi) => {
      pivotIdx = hi;
      snapshot({ zh: `分区 [${lo}, ${hi}]`, en: `Partition [${lo}, ${hi}]` });
    },
    onCompare: (i) => comparing.add(i),
    onSwap: (i, j) => {
      const t = a[i]!;
      a[i] = a[j]!;
      a[j] = t;
      pendingSwap = [i, j];
      snapshot({ zh: `交换 ${i} ↔ ${j}`, en: `Swap ${i} ↔ ${j}` });
    },
    onPinned: (p) => {
      pinned.add(p);
      pivotIdx = -1;
      snapshot({ zh: `下标 ${p}（值 ${a[p]}）就位`, en: `Index ${p} (value ${a[p]}) placed` });
    },
  };

  const ans = quickselectMedian3(arr, k, hooks);
  const roles: Record<number, BarRole> = {};
  for (let i = 0; i < a.length; i++) roles[i] = 'final';
  rec
    .begin({ zh: `第 ${k + 1} 小 = ${ans}`, en: `Rank-${k + 1} smallest = ${ans}` })
    .setBars(rec.barsFrom(a, roles))
    .setAux([
      { label: '结果', value: String(ans), role: 'final' as BarRole },
      { label: 'k', value: String(k), role: 'pivot' as BarRole },
    ])
    .commit();

  return rec.build();
}
