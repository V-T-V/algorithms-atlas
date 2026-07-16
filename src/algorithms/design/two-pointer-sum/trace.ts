// 两数之和（双指针·有序）· 录制帧序列

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { twoSum, type TwoSumHooks } from './impl.ts';

export const DEFAULT_INPUT = { arr: [1, 2, 3, 4, 5, 6, 7, 8, 9], target: 12 };

export function buildTrace(input: { arr: number[]; target: number } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { arr, target } = input;
  let L = 0;
  let R = arr.length - 1;
  let resultPair: [number, number] | null = null;

  const render = (note: { zh: string; en: string }): void => {
    const roles: BarRole[] = arr.map(() => 'default');
    if (L >= 0 && L < arr.length) roles[L] = 'compare';
    if (R >= 0 && R < arr.length && R !== L) roles[R] = 'swap';
    else if (R === L && R >= 0 && R < arr.length) roles[R] = 'pivot';
    if (resultPair) {
      roles[resultPair[0]] = 'final';
      roles[resultPair[1]] = 'final';
    }
    const pointers: Array<{ index: number; label: string }> = [];
    if (L >= 0 && L < arr.length) pointers.push({ index: L, label: 'L' });
    if (R >= 0 && R < arr.length && R !== L) pointers.push({ index: R, label: 'R' });
    rec
      .begin(note)
      .setArray([...arr], roles, pointers)
      .setAux([
        { label: 'target', value: String(target), role: 'pivot' as BarRole },
        { label: 'L', value: `${L} (值 ${arr[L] ?? '-'})`, role: 'compare' as BarRole },
        { label: 'R', value: `${R} (值 ${arr[R] ?? '-'})`, role: 'swap' as BarRole },
      ])
      .commit();
  };

  render({ zh: `升序数组找两数之和 = ${target}`, en: `Find two numbers summing to ${target}` });

  const hooks: TwoSumHooks = {
    onCompare: (l, r, sum) => {
      L = l;
      R = r;
      const cmp = sum === target ? '== 目标' : sum < target ? '< 目标（增 L）' : '> 目标（减 R）';
      render({
        zh: `a[${l}]+a[${r}] = ${arr[l]}+${arr[r]} = ${sum} ${cmp}`,
        en: `a[${l}]+a[${r}] = ${arr[l]}+${arr[r]} = ${sum} ${sum === target ? '== target' : sum < target ? '< target (L++)' : '> target (R--)'}`,
      });
    },
    onMove: (which, from, to) => {
      if (which === 'L') L = to;
      else R = to;
    },
    onFound: (l, r) => {
      resultPair = [l, r];
      L = l;
      R = r;
      render({ zh: `命中：a[${l}]+a[${r}] = ${target}`, en: `Hit: a[${l}]+a[${r}] = ${target}` });
    },
  };

  const { pair } = twoSum(arr, target, hooks);
  resultPair = pair;

  const roles: BarRole[] = arr.map(() => 'default');
  if (pair) {
    roles[pair[0]] = 'final';
    roles[pair[1]] = 'final';
  }
  rec
    .begin({
      zh: pair ? `完成：(${arr[pair[0]]}, ${arr[pair[1]]})` : '完成：无解',
      en: pair ? `Done: (${arr[pair[0]]}, ${arr[pair[1]]})` : 'Done: no pair',
    })
    .setArray([...arr], roles, [])
    .setAux([
      {
        label: '结果',
        value: pair ? `a[${pair[0]}]+a[${pair[1]}]=${target}` : '无解',
        role: (pair ? 'final' : 'warn') as BarRole,
      },
    ])
    .commit();

  return rec.build();
}
