// =============================================================================
// 希尔排序 · 录制帧序列
// 通过 shellSort 的钩子，把执行过程录成 Frame[]。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { shellSort, type ShellSortHooks } from './impl.ts';

export const DEFAULT_INPUT = [5, 2, 8, 1, 9, 3, 7, 4, 6];

/** 录制演示帧序列。 */
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const a = [...input];
  let gap = 1;
  let picked = -1; // 当前 gap-插入的起始下标 i
  const comparing = new Set<number>();
  let pendingShift: [number, number] | null = null;

  const snapshot = (note: { zh: string; en: string }): void => {
    const roles: Record<number, BarRole> = {};
    if (picked >= 0) roles[picked] = 'pivot';
    if (pendingShift) roles[pendingShift[1]] = 'swap';
    for (const c of comparing) if (!roles[c]) roles[c] = 'compare';
    rec.begin(note).setBars(rec.barsFrom(a, roles)).commit();
    comparing.clear();
    pendingShift = null;
  };

  snapshot({ zh: `初始数组：${a.join(', ')}`, en: `Initial array: ${a.join(', ')}` });

  const hooks: ShellSortHooks = {
    onGap: (g) => {
      gap = g;
      picked = -1;
      snapshot({
        zh: `使用 gap = ${g}：对相距 ${g} 的元素做插入排序`,
        en: `gap = ${g}: insertion-sort elements ${g} apart`,
      });
    },
    onCompare: (i, j) => {
      picked = i;
      comparing.add(j);
      comparing.add(i);
    },
    onShift: (from, to) => {
      a[to] = a[from]!;
      pendingShift = [from, to];
      snapshot({
        zh: `a[${from}]=${a[to]} > key，右移 ${gap} 到 ${to}`,
        en: `a[${from}]=${a[to]} > key, shift +${gap} to ${to}`,
      });
    },
    onPlace: (i, value) => {
      a[i] = value;
      picked = -1;
      snapshot({
        zh: `写入落点 ${i}（值 ${value}）`,
        en: `Place value ${value} at ${i}`,
      });
    },
  };

  shellSort(input, hooks);

  // 终态
  rec
    .begin({ zh: '排序完成', en: 'Sorted' })
    .setBars(a.map((v) => ({ value: v, role: 'final' as BarRole })))
    .commit();

  return rec.build();
}
