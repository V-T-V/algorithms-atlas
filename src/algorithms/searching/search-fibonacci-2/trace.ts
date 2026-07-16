// 斐波那契查找 · 录制帧序列

import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { fibonacciSearch } from './impl.ts';

export const DEFAULT_INPUT = { arr: [1, 3, 5, 7, 9, 11, 13, 15, 17, 19], target: 13 };

export function buildTrace(input: { arr: number[]; target: number } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { arr, target } = input;

  rec
    .begin({ zh: `斐波那契查找 target=${target}`, en: `Fibonacci search target=${target}` })
    .setArray(
      [...arr],
      arr.map(() => 'default' as const),
      [],
    )
    .setAux([{ label: '目标', value: String(target), role: 'frontier' }])
    .commit();

  const idx = fibonacciSearch(arr, target, {
    onCompare: (mid, value) => {
      rec
        .begin({ zh: `比较 i=${mid} → ${value}`, en: `Compare i=${mid} → ${value}` })
        .setArray(
          [...arr],
          arr.map((_, i) => (i === mid ? ('pivot' as const) : ('default' as const))),
          [{ index: mid, label: 'i' }],
        )
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
