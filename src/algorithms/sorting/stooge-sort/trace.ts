// =============================================================================
// Stooge 排序 · 录制帧序列
// 通过 stoogeSort 的钩子，把执行过程录成 Frame[]。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { stoogeSort, type StoogeSortHooks } from './impl.ts';

export const DEFAULT_INPUT = [3, 1, 4, 2];

/** 录制演示帧序列。 */
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const a = [...input];
  const comparing = new Set<number>();
  let pendingSwap: [number, number] | null = null;

  const snapshot = (note: { zh: string; en: string }): void => {
    const roles: Record<number, BarRole> = {};
    if (pendingSwap) {
      roles[pendingSwap[0]] = 'swap';
      roles[pendingSwap[1]] = 'swap';
    }
    for (const c of comparing) if (!roles[c]) roles[c] = 'compare';
    rec.begin(note).setBars(rec.barsFrom(a, roles)).commit();
    comparing.clear();
    pendingSwap = null;
  };

  snapshot({ zh: `初始数组：${a.join(', ')}`, en: `Initial array: ${a.join(', ')}` });

  const hooks: StoogeSortHooks = {
    onCompare: (lo, hi) => {
      comparing.add(lo);
      comparing.add(hi);
    },
    onSwap: (lo, hi) => {
      const t = a[lo]!;
      a[lo] = a[hi]!;
      a[hi] = t;
      pendingSwap = [lo, hi];
      snapshot({ zh: `a[${lo}] > a[${hi}]，交换两端`, en: `a[${lo}] > a[${hi}], swap ends` });
    },
  };

  stoogeSort(input, hooks);

  rec
    .begin({ zh: '排序完成', en: 'Sorted' })
    .setBars(a.map((v) => ({ value: v, role: 'final' as BarRole })))
    .commit();

  return rec.build();
}
