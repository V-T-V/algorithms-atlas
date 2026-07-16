// 插值查找 · 录制帧序列

import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { interpolationSearch } from './impl.ts';

export const DEFAULT_INPUT = { arr: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100], target: 70 };

export function buildTrace(input: { arr: number[]; target: number } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { arr, target } = input;

  rec
    .begin({ zh: `插值查找 target=${target}`, en: `Interpolation search target=${target}` })
    .setArray(
      [...arr],
      arr.map(() => 'default' as const),
      [],
    )
    .setAux([{ label: '目标', value: String(target), role: 'frontier' }])
    .commit();

  const idx = interpolationSearch(arr, target, {
    onProbe: (pos, value, lo, hi) => {
      const roles = arr.map((_, i) => {
        if (i < lo || i > hi) return 'sorted' as const;
        if (i === pos) return 'pivot' as const;
        return 'default' as const;
      });
      rec
        .begin({ zh: `插值估计 pos=${pos} → ${value}`, en: `Probe pos=${pos} → ${value}` })
        .setArray([...arr], roles, [
          { index: lo, label: 'lo' },
          { index: pos, label: 'pos' },
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
