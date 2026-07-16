// 指数查找 · 录制帧序列

import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { exponentialSearch } from './impl.ts';

export const DEFAULT_INPUT = {
  arr: [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29],
  target: 19,
};

export function buildTrace(input: { arr: number[]; target: number } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { arr, target } = input;

  rec
    .begin({ zh: `指数查找 target=${target}`, en: `Exponential search target=${target}` })
    .setArray(
      [...arr],
      arr.map(() => 'default' as const),
      [],
    )
    .setAux([{ label: '目标', value: String(target), role: 'frontier' }])
    .commit();

  const idx = exponentialSearch(arr, target, {
    onBound: (bound, value) => {
      rec
        .begin({
          zh: `倍增：bound=${bound}，值=${value === null ? '越界' : value}`,
          en: `Galloping: bound=${bound}, value=${value === null ? 'OOB' : value}`,
        })
        .setArray(
          [...arr],
          arr.map((_, i) => (i === bound ? ('pivot' as const) : ('default' as const))),
          [{ index: bound, label: 'bound' }],
        )
        .commit();
    },
    onBinary: (mid, value) => {
      rec
        .begin({ zh: `二分：mid=${mid} → ${value}`, en: `Binary: mid=${mid} → ${value}` })
        .setArray(
          [...arr],
          arr.map((_, i) => (i === mid ? ('pivot' as const) : ('default' as const))),
          [{ index: mid, label: 'mid' }],
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
