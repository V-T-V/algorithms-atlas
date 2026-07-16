// =============================================================================
// 煎饼排序 · 录制帧序列
// 通过 pancakeSort 的钩子，把执行过程录成 Frame[]。
// 翻转区间用 'pivot' 标记边界，已就位用 'final'。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { pancakeSort, type PancakeSortHooks } from './impl.ts';

export const DEFAULT_INPUT = [5, 2, 8, 1, 9, 3, 7, 4, 6];

/** 录制演示帧序列。 */
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const a = [...input];
  const pinned = new Set<number>();
  let flipRange: { lo: number; hi: number } | null = null;
  let maxIdx = -1;

  const snapshot = (note: { zh: string; en: string }): void => {
    const roles: Record<number, BarRole> = {};
    for (const p of pinned) roles[p] = 'final';
    if (flipRange) {
      for (let k = flipRange.lo; k <= flipRange.hi; k++) if (!roles[k]) roles[k] = 'swap';
      // 翻转区间的两端用 pivot 强调
      if (!roles[flipRange.lo]) roles[flipRange.lo] = 'pivot';
      else roles[flipRange.lo] = 'pivot';
      if (!roles[flipRange.hi]) roles[flipRange.hi] = 'pivot';
      else roles[flipRange.hi] = 'pivot';
    }
    if (maxIdx >= 0 && !roles[maxIdx]) roles[maxIdx] = 'compare';
    rec.begin(note).setBars(rec.barsFrom(a, roles)).commit();
    flipRange = null;
    maxIdx = -1;
  };

  snapshot({ zh: `初始数组：${a.join(', ')}`, en: `Initial array: ${a.join(', ')}` });

  const hooks: PancakeSortHooks = {
    onFindMax: (hi, idx) => {
      maxIdx = idx;
      snapshot({
        zh: `在 [0, ${hi}] 中找最大值 a[${idx}]=${a[idx]}`,
        en: `Find max in [0, ${hi}]: a[${idx}]=${a[idx]}`,
      });
    },
    onFlip: (k) => {
      // 执行翻转 [0, k]
      let l = 0;
      let r = k;
      while (l < r) {
        const t = a[l]!;
        a[l] = a[r]!;
        a[r] = t;
        l++;
        r--;
      }
      flipRange = { lo: 0, hi: k };
      snapshot({
        zh: `翻转前缀 [0, ${k}]`,
        en: `Flip prefix [0, ${k}]`,
      });
    },
    onPinned: (i) => {
      pinned.add(i);
      snapshot({
        zh: `下标 ${i}（值 ${a[i]}）已就位`,
        en: `Index ${i} (value ${a[i]}) in final place`,
      });
    },
  };

  pancakeSort(input, hooks);
  flipRange = null;

  // 终态
  rec
    .begin({ zh: '排序完成', en: 'Sorted' })
    .setBars(a.map((v) => ({ value: v, role: 'final' as BarRole })))
    .commit();

  return rec.build();
}
