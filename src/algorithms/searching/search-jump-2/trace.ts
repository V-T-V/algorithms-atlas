// 跳跃查找 · 录制帧序列

import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { jumpSearch } from './impl.ts';

export const DEFAULT_INPUT = {
  arr: [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29, 31],
  target: 19,
};

export function buildTrace(input: { arr: number[]; target: number } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { arr, target } = input;

  rec
    .begin({
      zh: `跳跃查找 target=${target}，步长 √${arr.length}`,
      en: `Jump search target=${target}, step √${arr.length}`,
    })
    .setArray(
      [...arr],
      arr.map(() => 'default' as const),
      [],
    )
    .setAux([{ label: '目标', value: String(target), role: 'frontier' }])
    .commit();

  const idx = jumpSearch(arr, target, {
    onJump: (i, value) => {
      rec
        .begin({
          zh: `跳到 ${i} → ${value === null ? '越界' : value}`,
          en: `Jump to ${i} → ${value === null ? 'OOB' : value}`,
        })
        .setArray(
          [...arr],
          arr.map((_, k) => (k === i ? ('pivot' as const) : ('default' as const))),
          [{ index: i, label: 'jump' }],
        )
        .commit();
    },
    onLinear: (i, value) => {
      rec
        .begin({ zh: `线性扫描 ${i} → ${value}`, en: `Linear scan ${i} → ${value}` })
        .setArray(
          [...arr],
          arr.map((_, k) => (k === i ? ('pivot' as const) : ('default' as const))),
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
