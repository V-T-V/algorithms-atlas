// 随机化快速选择 · 录制帧序列

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { quickselectRandomized, type RandomSelectHooks } from './impl.ts';

export const DEFAULT_INPUT = { arr: [7, 2, 9, 4, 1, 8, 5, 3, 6], k: 4, seed: 1 };

export function buildTrace(
  input: { arr: number[]; k: number; seed?: number } = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();
  const { arr, k, seed = 1 } = input;
  const a = [...arr];
  let pivotIdx = -1;
  let pickedIdx = -1;
  const pinned = new Set<number>();

  const snapshot = (note: { zh: string; en: string }): void => {
    const roles: Record<number, BarRole> = {};
    for (const p of pinned) roles[p] = 'final';
    if (pickedIdx >= 0 && !pinned.has(pickedIdx)) roles[pickedIdx] = 'frontier';
    if (pivotIdx >= 0 && !pinned.has(pivotIdx)) roles[pivotIdx] = 'pivot';
    rec.begin(note).setBars(rec.barsFrom(a, roles)).commit();
    pickedIdx = -1;
  };

  snapshot({
    zh: `找第 ${k + 1} 小（0-based k=${k}），种子=${seed}`,
    en: `Find rank-${k} (0-based), seed=${seed}`,
  });

  const hooks: RandomSelectHooks = {
    onPickPivot: (lo, hi, r) => {
      pickedIdx = r;
      snapshot({
        zh: `区间 [${lo}, ${hi}]，随机选中下标 ${r}（值 ${a[r]}）`,
        en: `Range [${lo}, ${hi}], random pick index ${r} (value ${a[r]})`,
      });
    },
    onSwap: (i, j) => {
      const t = a[i]!;
      a[i] = a[j]!;
      a[j] = t;
      if (i === pivotIdx || j === pivotIdx) pivotIdx = -1;
    },
    onCompare: () => {},
    onPinned: (p) => {
      pinned.add(p);
      pivotIdx = -1;
      snapshot({ zh: `下标 ${p}（值 ${a[p]}）就位`, en: `Index ${p} (value ${a[p]}) placed` });
    },
  };

  // 重新设置 pivotIdx 跟踪：onPickPivot 后基准被换到 hi
  const wrappedHooks: RandomSelectHooks = {
    ...hooks,
    onPickPivot: (lo, hi, r) => {
      pickedIdx = r;
      snapshot({
        zh: `区间 [${lo}, ${hi}]，随机选中下标 ${r}（值 ${a[r]}）`,
        en: `Range [${lo}, ${hi}], random pick index ${r} (value ${a[r]})`,
      });
      pivotIdx = hi; // 交换后基准在 hi
    },
  };

  const ans = quickselectRandomized(arr, k, seed, wrappedHooks);
  const roles: Record<number, BarRole> = {};
  for (let i = 0; i < a.length; i++) roles[i] = 'final';
  rec
    .begin({ zh: `第 ${k + 1} 小 = ${ans}`, en: `Rank-${k + 1} smallest = ${ans}` })
    .setBars(rec.barsFrom(a, roles))
    .commit();

  return rec.build();
}
