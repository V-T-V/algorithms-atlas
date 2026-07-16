// Meta 二分查找 · 录制帧序列

import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { metaBinarySearch } from './impl.ts';

export const DEFAULT_INPUT = { arr: [1, 3, 5, 7, 9, 11, 13, 15, 17, 19], target: 13 };

export function buildTrace(input: { arr: number[]; target: number } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { arr, target } = input;

  rec
    .begin({ zh: `Meta 二分查找 target=${target}`, en: `Meta binary search target=${target}` })
    .setArray(
      [...arr],
      arr.map(() => 'default' as const),
      [],
    )
    .setAux([{ label: '目标', value: String(target), role: 'frontier' }])
    .commit();

  const idx = metaBinarySearch(arr, target, {
    onBit: (bit, candidate, value, accepted) => {
      rec
        .begin({
          zh: `bit=${bit}：候选 ${candidate}（值 ${Number.isNaN(value) ? '越界' : value}）→ ${accepted ? '接受' : '拒绝'}`,
          en: `bit=${bit}: candidate ${candidate} (val ${Number.isNaN(value) ? 'OOB' : value}) → ${accepted ? 'accept' : 'reject'}`,
        })
        .setArray(
          [...arr],
          arr.map((_, k) => (k === candidate ? ('pivot' as const) : ('default' as const))),
          [{ index: Math.min(candidate, arr.length - 1), label: 'cand' }],
        )
        .setAux([{ label: '状态', value: accepted ? '接受' : '拒绝', role: 'compare' }])
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
