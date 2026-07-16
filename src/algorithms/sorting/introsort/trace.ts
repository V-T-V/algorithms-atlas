// =============================================================================
// 内省排序 · 录制帧序列
// 通过 introsort 的钩子，把执行过程录成 Frame[]。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { introsort, type IntroPhase, type IntroSortHooks } from './impl.ts';

export const DEFAULT_INPUT = [5, 2, 8, 1, 9, 3, 7, 4, 6];

/** 录制演示帧序列。 */
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const a = [...input];
  const pinned = new Set<number>();
  const comparing = new Set<number>();
  const swapped = new Set<number>();
  let range: { lo: number; hi: number } | null = null;

  const phaseLabel = (p: IntroPhase): { zh: string; en: string } =>
    p === 'quicksort'
      ? { zh: '快排', en: 'quicksort' }
      : p === 'heapsort'
        ? { zh: '堆排', en: 'heapsort' }
        : { zh: '插入', en: 'insertion' };

  const snapshot = (note: { zh: string; en: string }): void => {
    const roles: Record<number, BarRole> = {};
    for (const p of pinned) roles[p] = 'final';
    if (range) {
      for (let k = range.lo; k <= range.hi; k++) {
        if (!roles[k]) roles[k] = 'frontier';
      }
    }
    for (const c of comparing) if (!roles[c]) roles[c] = 'compare';
    swapped.forEach((i) => {
      if (!roles[i]) roles[i] = 'swap';
    });
    rec.begin(note).setBars(rec.barsFrom(a, roles)).commit();
    comparing.clear();
    swapped.clear();
  };

  snapshot({ zh: `初始数组：${a.join(', ')}`, en: `Initial array: ${a.join(', ')}` });

  const hooks: IntroSortHooks = {
    onEnter: (lo, hi, phase) => {
      range = { lo, hi };
      const lbl = phaseLabel(phase);
      snapshot({
        zh: `处理 [${lo}, ${hi}] · 子算法：${lbl.zh}`,
        en: `Process [${lo}, ${hi}] · phase: ${lbl.en}`,
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
      swapped.add(i);
      swapped.add(j);
      snapshot({
        zh: `交换 ${i} ↔ ${j}`,
        en: `Swap ${i} ↔ ${j}`,
      });
    },
    onShift: (j, jNext) => {
      a[jNext] = a[j]!;
      swapped.add(jNext);
      snapshot({
        zh: `插入位移：a[${j}] → a[${jNext}]`,
        en: `Insertion shift: a[${j}] → a[${jNext}]`,
      });
    },
    onPlace: (i, value) => {
      a[i] = value;
      swapped.add(i);
      snapshot({
        zh: `插入落点 ${i}（值 ${value}）`,
        en: `Insertion place ${i} (value ${value})`,
      });
    },
    onPinned: (i) => {
      pinned.add(i);
    },
  };

  introsort(input, hooks);
  range = null;

  // 终态
  rec
    .begin({ zh: '排序完成', en: 'Sorted' })
    .setBars(a.map((v) => ({ value: v, role: 'final' as BarRole })))
    .commit();

  return rec.build();
}
