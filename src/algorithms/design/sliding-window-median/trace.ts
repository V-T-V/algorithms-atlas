// =============================================================================
// 滑动窗口中位数 · 录制帧序列
// 用 setArray 展示窗口与中位数，setAux 展示有序窗口。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { slidingWindowMedian, type SWMedianHooks } from './impl.ts';

export const DEFAULT_INPUT = { arr: [1, 3, -1, -3, 5, 3, 6, 7], k: 3 };

interface TraceOptions {
  arr: number[];
  k: number;
}

export function buildTrace(input: TraceOptions = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { arr, k } = input;
  const n = arr.length;
  let sorted: number[] = [];
  let winEnd = k - 2;
  const medians: Array<{ end: number; val: number }> = [];
  let curMed: number | null = null;

  const render = (note: { zh: string; en: string }): void => {
    const roles: BarRole[] = arr.map((_, i) => {
      const inWin = i <= winEnd && i >= winEnd - k + 1;
      if (!inWin) return 'sorted';
      if (curMed !== null && arr[i] === curMed && k % 2 === 1) return 'final';
      return 'default';
    });
    const pointers: Array<{ index: number; label: string }> = [];
    if (winEnd >= k - 1 && winEnd < n) {
      pointers.push({ index: winEnd - k + 1, label: 'L' });
      pointers.push({ index: winEnd, label: 'R' });
    }
    rec
      .begin(note)
      .setArray([...arr], roles, pointers)
      .setAux([
        { label: '窗口 k', value: String(k), role: 'pivot' as BarRole },
        {
          label: '有序窗口（升序）',
          value: `[${sorted.join(', ')}]`,
          role: 'compare' as BarRole,
        },
        {
          label: '当前中位数',
          value: curMed === null ? '-' : String(curMed),
          role: 'final' as BarRole,
        },
        {
          label: '已记录',
          value: `[${medians.map((m) => m.val).join(', ')}]`,
          role: 'sorted' as BarRole,
        },
      ])
      .commit();
  };

  render({
    zh: `大小 ${k} 的窗口在 [${arr.join(',')}] 上滑动`,
    en: `Window of size ${k} sliding over [${arr.join(',')}]`,
  });

  const hooks: SWMedianHooks = {
    onInsert: (i, _v, s) => {
      sorted = [...s];
      winEnd = i;
      render({
        zh: `插入 a[${i}]=${arr[i]}，保持有序`,
        en: `Insert a[${i}]=${arr[i]}, keep sorted`,
      });
    },
    onRemove: (j, v, s) => {
      sorted = [...s];
      render({ zh: `移除出窗 a[${j}]=${v}`, en: `Remove outgoing a[${j}]=${v}` });
    },
    onMedian: (i, m, s) => {
      sorted = [...s];
      curMed = m;
      medians.push({ end: i, val: m });
      render({
        zh: `窗口 [${i - k + 1},${i}] 中位数 = ${m}`,
        en: `Window [${i - k + 1},${i}] median = ${m}`,
      });
      curMed = null;
    },
  };

  slidingWindowMedian(arr, k, hooks);

  rec
    .begin({
      zh: `完成：中位数序列 [${medians.map((m) => m.val).join(', ')}]`,
      en: `Done: medians = [${medians.map((m) => m.val).join(', ')}]`,
    })
    .setArray(
      [...arr],
      arr.map(() => 'sorted' as BarRole),
      [],
    )
    .setAux([
      {
        label: '结果',
        value: `[${medians.map((m) => m.val).join(', ')}]`,
        role: 'final' as BarRole,
      },
    ])
    .commit();

  return rec.build();
}
