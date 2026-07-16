// 飞奔查找 · 录制帧序列

import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { gallopSearch } from './impl.ts';

export const DEFAULT_INPUT = {
  arr: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
  target: 10,
};

export function buildTrace(input: { arr: number[]; target: number } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { arr, target } = input;

  rec
    .begin({ zh: `飞奔查找 target=${target}`, en: `Gallop search target=${target}` })
    .setArray(
      [...arr],
      arr.map(() => 'default' as const),
      [],
    )
    .setAux([{ label: '目标', value: String(target), role: 'frontier' }])
    .commit();

  const idx = gallopSearch(arr, target, {
    onGallop: (i, value) => {
      rec
        .begin({
          zh: `飞奔到 ${i} → ${value === null ? '越界' : value}`,
          en: `Gallop to ${i} → ${value === null ? 'OOB' : value}`,
        })
        .setArray(
          [...arr],
          arr.map((_, k) =>
            k === Math.min(i, arr.length - 1) ? ('pivot' as const) : ('default' as const),
          ),
          [{ index: Math.min(i, arr.length - 1), label: 'i' }],
        )
        .commit();
    },
    onHalt: (lo, hi) => {
      rec
        .begin({ zh: `二分区间 [${lo}, ${hi}]`, en: `Binary range [${lo}, ${hi}]` })
        .setArray(
          [...arr],
          arr.map((_, k) => (k >= lo && k <= hi ? ('compare' as const) : ('sorted' as const))),
          [],
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
