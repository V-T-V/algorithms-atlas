// 哨兵线性查找 · 录制帧序列

import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { sentinelSearch } from './impl.ts';

export const DEFAULT_INPUT = { arr: [4, 2, 7, 1, 9, 3, 8, 5, 6], target: 8 };

export function buildTrace(input: { arr: number[]; target: number } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { arr, target } = input;

  rec
    .begin({ zh: `哨兵线性查找 target=${target}`, en: `Sentinel linear search target=${target}` })
    .setArray(
      [...arr],
      arr.map(() => 'default' as const),
      [],
    )
    .setAux([{ label: '目标', value: String(target), role: 'frontier' }])
    .commit();

  const idx = sentinelSearch(arr, target, {
    onCompare: (i, value) => {
      rec
        .begin({ zh: `比较 i=${i} → ${value}`, en: `Compare i=${i} → ${value}` })
        .setArray(
          [...arr],
          arr.map((_, k) => {
            if (k === i) return 'pivot' as const;
            if (k < i) return 'compare' as const;
            return 'default' as const;
          }),
          [{ index: i, label: 'i' }],
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
