// 二分查找（递归）· 录制帧序列

import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { binarySearchRecursive } from './impl.ts';

export const DEFAULT_INPUT = { arr: [1, 3, 5, 7, 9, 11, 13, 15, 17, 19], target: 13 };

export function buildTrace(input: { arr: number[]; target: number } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { arr, target } = input;

  rec
    .begin({
      zh: `递归二分查找 target=${target}，数组长度 ${arr.length}`,
      en: `Recursive binary search target=${target}, length ${arr.length}`,
    })
    .setArray(
      [...arr],
      arr.map(() => 'default' as const),
      [],
    )
    .setAux([{ label: '目标', value: String(target), role: 'frontier' }])
    .commit();

  const idx = binarySearchRecursive(arr, target, {
    onCompare: (mid, value, lo, hi) => {
      const roles = arr.map((_, i) => {
        if (i < lo || i > hi) return 'sorted' as const;
        if (i === mid) return 'pivot' as const;
        return 'default' as const;
      });
      rec
        .begin({
          zh: `lo=${lo} hi=${hi} mid=${mid} → arr[${mid}]=${value}`,
          en: `lo=${lo} hi=${hi} mid=${mid} → arr[${mid}]=${value}`,
        })
        .setArray([...arr], roles, [
          { index: lo, label: 'lo' },
          { index: mid, label: 'mid' },
          { index: hi, label: 'hi' },
        ])
        .setAux([{ label: '比较值', value: String(value), role: 'compare' }])
        .commit();
    },
  });

  rec
    .begin({
      zh: idx === -1 ? `未找到 ${target}` : `找到 ${target} 于索引 ${idx}`,
      en: idx === -1 ? `${target} not found` : `found ${target} at index ${idx}`,
    })
    .setArray(
      [...arr],
      arr.map((_, i) => (i === idx ? ('final' as const) : ('sorted' as const))),
      [],
    )
    .setAux([{ label: '结果', value: idx === -1 ? '未找到' : `索引 ${idx}`, role: 'final' }])
    .commit();

  return rec.build();
}
