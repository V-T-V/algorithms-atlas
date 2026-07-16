// =============================================================================
// 侏儒排序 · 录制帧序列
// 通过 gnomeSort 的钩子，把执行过程录成 Frame[]。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { gnomeSort, type GnomeSortHooks } from './impl.ts';

export const DEFAULT_INPUT = [5, 2, 8, 1, 9, 3, 7, 4, 6];

/** 录制演示帧序列。 */
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const a = [...input];
  const n = a.length;
  let cursor = 1; // 当前游标
  const comparing = new Set<number>();
  let swapped: [number, number] | null = null;
  // [0, boundary] 视为已整理好的前缀
  let boundary = 0;

  const snapshot = (note: { zh: string; en: string }): void => {
    const roles: Record<number, BarRole> = {};
    for (let k = 0; k <= boundary && k < n; k++) roles[k] = 'sorted';
    if (swapped) {
      roles[swapped[0]] = 'swap';
      roles[swapped[1]] = 'swap';
    }
    for (const c of comparing) if (!roles[c]) roles[c] = 'compare';
    if (cursor >= 0 && cursor < n && !roles[cursor]) roles[cursor] = 'pivot';
    rec.begin(note).setBars(rec.barsFrom(a, roles)).commit();
    comparing.clear();
    swapped = null;
  };

  snapshot({ zh: `初始数组：${a.join(', ')}`, en: `Initial array: ${a.join(', ')}` });

  const hooks: GnomeSortHooks = {
    onCompare: (i) => {
      comparing.add(i);
      comparing.add(i - 1);
    },
    onSwap: (i, prev) => {
      const t = a[i]!;
      a[i] = a[prev]!;
      a[prev] = t;
      swapped = [i, prev];
      boundary = Math.max(0, prev - 1); // 后退后前缀缩小
      snapshot({
        zh: `a[${i}] < a[${prev}]，交换并后退`,
        en: `a[${i}] < a[${prev}], swap and step back`,
      });
    },
    onMove: (i) => {
      cursor = i;
      if (i > boundary) boundary = i - 1; // 前进则前缀增长
      snapshot({
        zh: `游标移动到 ${i}`,
        en: `Cursor moves to ${i}`,
      });
    },
  };

  gnomeSort(input, hooks);
  boundary = n - 1;

  // 终态
  rec
    .begin({ zh: '排序完成', en: 'Sorted' })
    .setBars(a.map((v) => ({ value: v, role: 'final' as BarRole })))
    .commit();

  return rec.build();
}
