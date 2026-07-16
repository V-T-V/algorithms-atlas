// 双调数组查找 · 录制帧序列

import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { bitonicSearch } from './impl.ts';

export const DEFAULT_INPUT = { arr: [1, 3, 8, 12, 9, 5, 2], target: 5 };

export function buildTrace(input: { arr: number[]; target: number } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { arr, target } = input;

  rec
    .begin({ zh: `双调查找 target=${target}`, en: `Bitonic search target=${target}` })
    .setArray(
      [...arr],
      arr.map(() => 'default' as const),
      [],
    )
    .setAux([{ label: '目标', value: String(target), role: 'frontier' }])
    .commit();

  const idx = bitonicSearch(arr, target, {
    onPeak: (peak) => {
      rec
        .begin({
          zh: `峰值索引 = ${peak}（值 ${arr[peak]}）`,
          en: `Peak index = ${peak} (value ${arr[peak]})`,
        })
        .setArray(
          [...arr],
          arr.map((_, k) => (k === peak ? ('pivot' as const) : ('default' as const))),
          [{ index: peak, label: 'peak' }],
        )
        .commit();
    },
    onAscSearch: (mid, value) => {
      rec
        .begin({ zh: `升序段：mid=${mid} → ${value}`, en: `Asc side: mid=${mid} → ${value}` })
        .setArray(
          [...arr],
          arr.map((_, k) => (k === mid ? ('compare' as const) : ('default' as const))),
          [{ index: mid, label: 'mid' }],
        )
        .commit();
    },
    onDescSearch: (mid, value) => {
      rec
        .begin({ zh: `降序段：mid=${mid} → ${value}`, en: `Desc side: mid=${mid} → ${value}` })
        .setArray(
          [...arr],
          arr.map((_, k) => (k === mid ? ('compare' as const) : ('default' as const))),
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
