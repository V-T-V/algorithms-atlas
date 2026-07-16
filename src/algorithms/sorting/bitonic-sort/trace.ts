// =============================================================================
// 双调排序 · 录制帧序列
// 通过 bitonicSort 的钩子，把执行过程录成 Frame[]。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { bitonicSort, type BitonicSortHooks } from './impl.ts';

// 长度取 2 的幂，避免填充干扰可视化
export const DEFAULT_INPUT = [5, 2, 8, 1, 9, 3, 7, 4];

/** 录制演示帧序列。 */
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const a = [...input];
  let len = 1;
  while (len < a.length) len <<= 1;
  for (let k = a.length; k < len; k++) a.push(Infinity);
  const realN = input.length;

  const comparing = new Set<number>();
  let pendingSwap: [number, number] | null = null;

  const snapshot = (note: { zh: string; en: string }): void => {
    const roles: Record<number, BarRole> = {};
    if (pendingSwap) {
      roles[pendingSwap[0]] = 'swap';
      roles[pendingSwap[1]] = 'swap';
    }
    for (const c of comparing) if (!roles[c]) roles[c] = 'compare';
    const bars = a.map((v, i) => ({
      value: v === Infinity ? Math.max(...input, 0) + 1 : v,
      role: i >= realN ? ('warn' as BarRole) : (roles[i] ?? ('default' as BarRole)),
      label: i >= realN ? '∞' : undefined,
    }));
    rec.begin(note).setBars(bars).commit();
    comparing.clear();
    pendingSwap = null;
  };

  snapshot({ zh: `初始数组：${input.join(', ')}`, en: `Initial array: ${input.join(', ')}` });

  const hooks: BitonicSortHooks = {
    onCompare: (i, j) => {
      comparing.add(i);
      comparing.add(j);
    },
    onSwap: (i, j) => {
      const t = a[i]!;
      a[i] = a[j]!;
      a[j] = t;
      pendingSwap = [i, j];
      snapshot({ zh: `交换下标 ${i} 和 ${j}`, en: `Swap indices ${i} ↔ ${j}` });
    },
  };

  bitonicSort(input, hooks);

  rec
    .begin({ zh: '排序完成', en: 'Sorted' })
    .setBars(
      input
        .slice()
        .sort((x, y) => x - y)
        .map((v) => ({ value: v, role: 'final' as BarRole })),
    )
    .commit();

  return rec.build();
}
