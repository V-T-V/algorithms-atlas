// =============================================================================
// 滑动窗口聚合 · 录制帧序列
// 默认演示 sum / max / min 三种聚合在同一数组上的输出对比。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { slidingSum, slidingMax, slidingMin } from './impl.ts';

export const DEFAULT_INPUT = { arr: [1, 3, -1, -3, 5, 3, 6, 7], k: 3 };

interface TraceOptions {
  arr: number[];
  k: number;
}

export function buildTrace(input: Partial<TraceOptions> = {}): Frame[] {
  const arr = input.arr ?? DEFAULT_INPUT.arr;
  const k = input.k ?? DEFAULT_INPUT.k;
  const rec = new TraceRecorder();

  let winEnd = k - 2;
  const sums: number[] = [];
  const maxes: number[] = [];
  const mins: number[] = [];

  const render = (note: { zh: string; en: string }): void => {
    const roles: BarRole[] = arr.map((_, i) => {
      const inWin = i <= winEnd && i >= winEnd - k + 1;
      return inWin ? 'compare' : 'sorted';
    });
    const pointers: Array<{ index: number; label: string }> = [];
    if (winEnd >= k - 1 && winEnd < arr.length) {
      pointers.push({ index: winEnd - k + 1, label: 'L' });
      pointers.push({ index: winEnd, label: 'R' });
    }
    rec
      .begin(note)
      .setArray([...arr], roles, pointers)
      .setAux([
        { label: '窗口 k', value: String(k), role: 'pivot' as BarRole },
        { label: '和', value: `[${sums.join(', ')}]`, role: 'compare' as BarRole },
        { label: '最大', value: `[${maxes.join(', ')}]`, role: 'final' as BarRole },
        { label: '最小', value: `[${mins.join(', ')}]`, role: 'warn' as BarRole },
      ])
      .commit();
  };

  render({
    zh: `大小 ${k} 的窗口在 [${arr.join(',')}] 上滑动`,
    en: `Window of size ${k} sliding over [${arr.join(',')}]`,
  });

  slidingSum(arr, k, {
    onSlide: (i, _w, s) => {
      winEnd = i;
      sums.push(s);
      render({
        zh: `窗口 [${i - k + 1},${i}] sum = ${s}`,
        en: `Window [${i - k + 1},${i}] sum = ${s}`,
      });
    },
  });
  slidingMax(arr, k, { onSlide: (_i, _w, m) => maxes.push(m) });
  slidingMin(arr, k, { onSlide: (_i, _w, m) => mins.push(m) });

  render({ zh: '完成：三种聚合结果对比', en: 'Done: compare three aggregates' });

  rec
    .begin({ zh: '完成', en: 'Done' })
    .setArray(
      [...arr],
      arr.map(() => 'sorted' as BarRole),
      [],
    )
    .setAux([
      { label: 'sum 结果', value: `[${sums.join(', ')}]`, role: 'final' as BarRole },
      { label: 'max 结果', value: `[${maxes.join(', ')}]`, role: 'final' as BarRole },
      { label: 'min 结果', value: `[${mins.join(', ')}]`, role: 'final' as BarRole },
    ])
    .commit();

  return rec.build();
}
