// 快速选择（双轴）· 录制帧序列

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { quickselectDualPivot, type QuickSelectDualPivotHooks } from './impl.ts';

export const DEFAULT_INPUT = { arr: [8, 3, 11, 7, 2, 9, 5, 12, 6, 4, 10, 1], k: 5 };

export function buildTrace(input: { arr: number[]; k: number } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { arr, k } = input;
  const a = [...arr];
  const pivots = new Set<number>();
  const comparing = new Set<number>();
  const segmentLeft = new Set<number>();
  const segmentMid = new Set<number>();
  const segmentRight = new Set<number>();
  let pendingSwap: [number, number] | null = null;

  const snapshot = (note: { zh: string; en: string }): void => {
    const roles: Record<number, BarRole> = {};
    for (const i of segmentLeft) roles[i] = 'frontier';
    for (const i of segmentMid) roles[i] = 'pivot';
    for (const i of segmentRight) roles[i] = 'warn';
    for (const p of pivots) roles[p] = 'final';
    if (pendingSwap) {
      roles[pendingSwap[0]] = 'swap';
      roles[pendingSwap[1]] = 'swap';
    }
    for (const c of comparing) if (!roles[c]) roles[c] = 'compare';
    rec.begin(note).setBars(rec.barsFrom(a, roles)).commit();
    comparing.clear();
    pendingSwap = null;
  };

  snapshot({ zh: `双轴快选找第 ${k + 1} 小`, en: `Dual-pivot quickselect for rank-${k + 1}` });

  const hooks: QuickSelectDualPivotHooks = {
    onPivots: (i1, i2, p1, p2) => {
      segmentLeft.clear();
      segmentMid.clear();
      segmentRight.clear();
      pivots.clear();
      pivots.add(i1);
      pivots.add(i2);
      snapshot({ zh: `双轴 p1=${p1}, p2=${p2}`, en: `Dual pivots p1=${p1}, p2=${p2}` });
    },
    onCompare: (i) => comparing.add(i),
    onSwap: (i, j) => {
      const t = a[i]!;
      a[i] = a[j]!;
      a[j] = t;
      pendingSwap = [i, j];
      snapshot({ zh: `交换 ${i} ↔ ${j}`, en: `Swap ${i} ↔ ${j}` });
    },
    onPartition: (lo, _hi, lt, gt) => {
      for (let i = lo; i < lt; i++) segmentLeft.add(i);
      for (let i = lt; i <= gt; i++) segmentMid.add(i);
      for (let i = gt + 1; i < a.length; i++) segmentRight.add(i);
      snapshot({
        zh: `分区完成：左<${a[lt]} 中[${a[lt]},${a[gt]}] 右>${a[gt]}`,
        en: `Partitioned: left<mid>right`,
      });
    },
    onRecurse: (seg) => {
      snapshot({ zh: `递归 ${seg} 段`, en: `Recurse into ${seg} segment` });
    },
    onBase: (_sz, v) => {
      snapshot({ zh: `基线命中 ${v}`, en: `Base case hit ${v}` });
    },
  };

  const ans = quickselectDualPivot(arr, k, hooks);
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
