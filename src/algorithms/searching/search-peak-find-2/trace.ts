// 寻找峰值 · 录制帧序列

import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { findPeak, isPeak } from './impl.ts';

export const DEFAULT_INPUT = { arr: [1, 3, 20, 4, 1, 0, 7, 12, 9] };

export function buildTrace(input: { arr: number[] } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { arr } = input;

  rec
    .begin({ zh: `寻找峰值，长度 ${arr.length}`, en: `Find peak, length ${arr.length}` })
    .setArray(
      [...arr],
      arr.map(() => 'default' as const),
      [],
    )
    .commit();

  const idx = findPeak(arr, {
    onCompare: (mid, midVal, nextVal, goRight) => {
      rec
        .begin({
          zh: `mid=${mid}（${midVal}）vs next（${nextVal}）→ ${goRight ? '向右' : '向左'}`,
          en: `mid=${mid} (${midVal}) vs next (${nextVal}) → ${goRight ? 'right' : 'left'}`,
        })
        .setArray(
          [...arr],
          arr.map((_, k) => {
            if (k === mid) return 'pivot' as const;
            if (k === mid + 1) return 'compare' as const;
            return 'default' as const;
          }),
          [
            { index: mid, label: 'mid' },
            { index: mid + 1, label: 'mid+1' },
          ],
        )
        .commit();
    },
  });

  rec
    .begin({
      zh: `找到峰值索引 ${idx}，值 ${arr[idx]}（验证：${isPeak(arr, idx)}）`,
      en: `Peak at index ${idx}, value ${arr[idx]} (valid: ${isPeak(arr, idx)})`,
    })
    .setArray(
      [...arr],
      arr.map((_, i) => (i === idx ? ('final' as const) : ('sorted' as const))),
      [],
    )
    .setAux([{ label: '峰值', value: `arr[${idx}]=${arr[idx]}`, role: 'final' }])
    .commit();

  return rec.build();
}
