// 滑动窗口最大值（单调队列）· 录制帧序列

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { slidingWindowMax, type SlidingWindowMaxHooks } from './impl.ts';

export const DEFAULT_INPUT = { arr: [1, 3, -1, -3, 5, 3, 6, 7], k: 3 };

export function buildTrace(input: { arr: number[]; k: number } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { arr, k } = input;
  const n = arr.length;
  let deque: number[] = [];
  let winEnd = k - 2; // 当前窗口右端（未满时 < k-1）
  const maxima: Array<{ end: number; idx: number; val: number }> = [];
  let curMax = -1;

  const render = (note: { zh: string; en: string }): void => {
    const roles: BarRole[] = arr.map((_, i) => {
      const inWin = i <= winEnd && i >= winEnd - k + 1;
      if (!inWin) return 'sorted';
      if (i === curMax) return 'final';
      if (deque.includes(i)) return 'frontier';
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
        { label: '单调队列（下标）', value: `[${deque.join(', ')}]`, role: 'compare' as BarRole },
        {
          label: '队列对应值',
          value: `[${deque.map((i) => arr[i]).join(', ')}]`,
          role: 'frontier' as BarRole,
        },
        {
          label: '当前最大',
          value: curMax >= 0 ? String(arr[curMax]) : '-',
          role: 'final' as BarRole,
        },
        {
          label: '已记录最大值',
          value: `[${maxima.map((m) => m.val).join(', ')}]`,
          role: 'sorted' as BarRole,
        },
      ])
      .commit();
  };

  render({
    zh: `大小 ${k} 的窗口在 [${arr.join(',')}] 上滑动`,
    en: `Window of size ${k} sliding over [${arr.join(',')}]`,
  });

  const hooks: SlidingWindowMaxHooks = {
    onEnqueue: (i, _v, d) => {
      deque = [...d];
      winEnd = i;
      render({ zh: `入队 a[${i}]=${arr[i]}`, en: `Enqueue a[${i}]=${arr[i]}` });
    },
    onPopBack: (i, popped) => {
      deque = deque.filter((x) => x !== popped);
      render({
        zh: `队尾弹出 a[${popped}]=${arr[popped]}（<= a[${i}]）`,
        en: `Pop back a[${popped}]=${arr[popped]} (<= a[${i}])`,
      });
    },
    onPopFront: (_i, popped) => {
      deque = deque.filter((x) => x !== popped);
      curMax = deque[0] ?? -1;
      render({ zh: `队头过期弹出 a[${popped}]`, en: `Front expired, pop a[${popped}]` });
    },
    onWindowMax: (i, idx) => {
      curMax = idx;
      maxima.push({ end: i, idx, val: arr[idx]! });
      render({
        zh: `窗口 [${i - k + 1},${i}] 最大值 = a[${idx}]=${arr[idx]}`,
        en: `Window [${i - k + 1},${i}] max = a[${idx}]=${arr[idx]}`,
      });
    },
  };

  slidingWindowMax(arr, k, hooks);

  rec
    .begin({
      zh: `完成：最大值序列 [${maxima.map((m) => m.val).join(', ')}]`,
      en: `Done: maxima = [${maxima.map((m) => m.val).join(', ')}]`,
    })
    .setArray(
      [...arr],
      arr.map(() => 'sorted' as BarRole),
      [],
    )
    .setAux([
      {
        label: '结果',
        value: `[${maxima.map((m) => m.val).join(', ')}]`,
        role: 'final' as BarRole,
      },
    ])
    .commit();

  return rec.build();
}
