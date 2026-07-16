// 快速选择（Lomuto）· 录制帧序列

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { quickselectLomuto, type QuickSelectHooks } from './impl.ts';

export const DEFAULT_INPUT = { arr: [7, 2, 9, 4, 1, 8, 5, 3, 6], k: 4 };

export function buildTrace(input: { arr: number[]; k: number } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { arr, k } = input;
  const a = [...arr];
  let pivotIdx = -1;
  const pinned = new Set<number>();
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

  snapshot({ zh: `找第 ${k + 1} 小（0-based k=${k}）`, en: `Find rank-${k} (0-based)` });

  const hooks: QuickSelectHooks = {
    onPartition: (lo, hi, p) => {
      pivotIdx = p;
      snapshot({
        zh: `分区 [${lo}, ${hi}]，基准 = ${a[p]}`,
        en: `Partition [${lo}, ${hi}], pivot = ${a[p]}`,
      });
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

  const ans = quickselectLomuto(arr, k, hooks);
  const idx = a.indexOf(ans);
  const roles: Record<number, BarRole> = {};
  for (let i = 0; i < a.length; i++) roles[i] = 'final';
  rec
    .begin({
      zh: `第 ${k + 1} 小 = ${ans}（下标 ${idx}）`,
      en: `Rank-${k + 1} smallest = ${ans} (index ${idx})`,
    })
    .setBars(rec.barsFrom(a, roles))
    .commit();

  return rec.build();
}
