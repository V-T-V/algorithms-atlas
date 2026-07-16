// 三分查找（递归）· 录制帧序列

import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { ternarySearchRecursive } from './impl.ts';

export const DEFAULT_INPUT = { arr: [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21], target: 13 };

export function buildTrace(input: { arr: number[]; target: number } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { arr, target } = input;

  rec
    .begin({ zh: `递归三分查找 target=${target}`, en: `Recursive ternary search target=${target}` })
    .setArray(
      [...arr],
      arr.map(() => 'default' as const),
      [],
    )
    .setAux([{ label: '目标', value: String(target), role: 'frontier' }])
    .commit();

  const idx = ternarySearchRecursive(arr, target, {
    onCompare: (m1, m2, lo, hi) => {
      const roles = arr.map((_, i) => {
        if (i < lo || i > hi) return 'sorted' as const;
        if (i === m1 || i === m2) return 'pivot' as const;
        return 'default' as const;
      });
      rec
        .begin({
          zh: `lo=${lo} hi=${hi} m1=${m1} m2=${m2} → ${arr[m1]} / ${arr[m2]}`,
          en: `lo=${lo} hi=${hi} m1=${m1} m2=${m2} → ${arr[m1]} / ${arr[m2]}`,
        })
        .setArray([...arr], roles, [
          { index: lo, label: 'lo' },
          { index: m1, label: 'm1' },
          { index: m2, label: 'm2' },
          { index: hi, label: 'hi' },
        ])
        .commit();
    },
  });

  rec
    .begin({
      zh: idx === -1 ? `未找到` : `找到 ${target} 于索引 ${idx}`,
      en: idx === -1 ? `not found` : `found ${target} at ${idx}`,
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
