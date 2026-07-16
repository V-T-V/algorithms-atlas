// =============================================================================
// 奇偶排序 · 录制帧序列
// 通过 oddEvenSort 的钩子，把执行过程录成 Frame[]。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { oddEvenSort, type OddEvenSortHooks } from './impl.ts';

export const DEFAULT_INPUT = [5, 2, 8, 1, 9, 3, 7, 4, 6];

/** 录制演示帧序列。 */
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const a = [...input];
  const comparing = new Set<number>();
  let swapped: [number, number] | null = null;

  const snapshot = (note: { zh: string; en: string }): void => {
    const roles: Record<number, BarRole> = {};
    if (swapped) {
      roles[swapped[0]] = 'swap';
      roles[swapped[1]] = 'swap';
    }
    for (const c of comparing) if (!roles[c]) roles[c] = 'compare';
    rec.begin(note).setBars(rec.barsFrom(a, roles)).commit();
    comparing.clear();
    swapped = null;
  };

  snapshot({ zh: `初始数组：${a.join(', ')}`, en: `Initial array: ${a.join(', ')}` });

  const hooks: OddEvenSortHooks = {
    onPhase: (phase, pass) => {
      snapshot({
        zh: `第 ${pass + 1} 轮 · ${phase === 'even' ? '偶数' : '奇数'}阶段`,
        en: `Pass ${pass + 1} · ${phase} phase`,
      });
    },
    onCompare: (i, j) => {
      comparing.add(i);
      comparing.add(j);
    },
    onSwap: (i, j) => {
      const t = a[i]!;
      a[i] = a[j]!;
      a[j] = t;
      swapped = [i, j];
      snapshot({
        zh: `a[${i}] > a[${j}]，交换`,
        en: `a[${i}] > a[${j}], swap`,
      });
    },
  };

  oddEvenSort(input, hooks);

  // 终态
  rec
    .begin({ zh: '排序完成', en: 'Sorted' })
    .setBars(a.map((v) => ({ value: v, role: 'final' as BarRole })))
    .commit();

  return rec.build();
}
