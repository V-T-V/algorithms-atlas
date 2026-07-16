// 二分查找最左位置 · 录制帧序列

import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { binarySearchLeftmost } from './impl.ts';

export const DEFAULT_INPUT = { arr: [1, 3, 3, 3, 5, 7, 7, 7, 7, 9], target: 7 };

export function buildTrace(input: { arr: number[]; target: number } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { arr, target } = input;

  rec
    .begin({ zh: `二分找最左 ${target}`, en: `Binary search leftmost ${target}` })
    .setArray(
      [...arr],
      arr.map(() => 'default' as const),
      [],
    )
    .setAux([{ label: '目标', value: String(target), role: 'frontier' }])
    .commit();

  const idx = binarySearchLeftmost(arr, target, {
    onCompare: (mid, value, lo, hi) => {
      rec
        .begin({
          zh: `lo=${lo} hi=${hi} mid=${mid} → ${value}`,
          en: `lo=${lo} hi=${hi} mid=${mid} → ${value}`,
        })
        .setArray(
          [...arr],
          arr.map((_, k) => {
            if (k < lo || k >= hi) return 'sorted' as const;
            if (k === mid) return 'pivot' as const;
            return 'default' as const;
          }),
          [
            { index: lo, label: 'lo' },
            { index: mid, label: 'mid' },
            { index: Math.min(hi - 1, arr.length - 1), label: 'hi' },
          ],
        )
        .commit();
    },
  });

  rec
    .begin({
      zh: idx === -1 ? `未找到` : `最左位置 = ${idx}`,
      en: idx === -1 ? `not found` : `leftmost = ${idx}`,
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
