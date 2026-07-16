// 递归二分查找 · 录制帧序列

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { recursiveBinarySearch, type RbsHooks } from './impl.ts';

export const DEFAULT_INPUT = { arr: [1, 3, 5, 7, 9, 11, 13, 15, 17, 19], target: 11 };

export function buildTrace(input: { arr: number[]; target: number } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { arr, target } = input;
  let lo = 0;
  let hi = arr.length - 1;
  let mid = -1;
  let foundIdx = -1;

  const snapshot = (note: { zh: string; en: string }): void => {
    const roles: BarRole[] = new Array(arr.length).fill('default');
    for (let i = lo; i <= hi && i < arr.length; i++) if (i >= 0) roles[i] = 'frontier';
    if (mid >= 0) roles[mid] = 'compare';
    if (foundIdx >= 0) roles[foundIdx] = 'final';
    const ptrs = mid >= 0 ? [{ index: mid, label: 'mid' }] : [];
    if (lo >= 0 && lo < arr.length) ptrs.push({ index: lo, label: 'lo' });
    if (hi >= 0 && hi < arr.length) ptrs.push({ index: hi, label: 'hi' });
    rec
      .begin(note)
      .setArray(arr, roles, ptrs)
      .setAux([
        { label: 'lo', value: String(lo), role: 'frontier' as BarRole },
        { label: 'hi', value: String(hi), role: 'frontier' as BarRole },
        { label: 'mid', value: mid >= 0 ? String(mid) : '∅', role: 'pivot' as BarRole },
        { label: 'target', value: String(target), role: 'compare' as BarRole },
      ])
      .commit();
  };

  snapshot({ zh: `查找 ${target}`, en: `Search ${target}` });

  const hooks: RbsHooks = {
    onProbe: (l, h, m, mv) => {
      lo = l;
      hi = h;
      mid = m;
      snapshot({ zh: `比较 a[${m}]=${mv} 与 ${target}`, en: `Compare a[${m}]=${mv} vs ${target}` });
    },
    onFound: (m) => {
      foundIdx = m;
      snapshot({ zh: `命中 a[${m}]`, en: `Found at ${m}` });
    },
    onEmpty: (l, h) => {
      lo = l;
      hi = h;
      mid = -1;
      snapshot({ zh: `区间空，未找到`, en: `Empty interval, not found` });
    },
  };

  const result = recursiveBinarySearch(arr, target, hooks);
  void result;

  rec
    .begin({
      zh: result >= 0 ? `找到，下标 ${result}` : `未找到`,
      en: result >= 0 ? `Found at ${result}` : `Not found`,
    })
    .setArray(
      arr,
      foundIdx >= 0 ? arr.map((_, i) => (i === foundIdx ? 'final' : 'default') as BarRole) : [],
      [],
    )
    .setAux([
      {
        label: '结果',
        value: result >= 0 ? String(result) : '−1',
        role: result >= 0 ? ('final' as BarRole) : ('warn' as BarRole),
      },
      { label: '复杂度', value: 'O(log n)', role: 'frontier' as BarRole },
    ])
    .commit();

  return rec.build();
}
