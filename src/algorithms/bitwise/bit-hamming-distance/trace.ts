// =============================================================================
// 汉明距离 · 录制帧序列
// =============================================================================

import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { hammingDistance, type HammingHooks } from './impl.ts';

export const DEFAULT_INPUT = { x: 0x55555555, y: 0xaaaaaaaa };

function hex32(n: number): string {
  return '0x' + (n >>> 0).toString(16).padStart(8, '0');
}

function bytes32(n: number): number[] {
  return [(n >>> 24) & 0xff, (n >>> 16) & 0xff, (n >>> 8) & 0xff, n & 0xff];
}

export function buildTrace(input: { x: number; y: number } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { x, y } = input;

  const d = (x ^ y) >>> 0;
  rec
    .begin({
      zh: `汉明距离：x=${hex32(x)} XOR y=${hex32(y)} = ${hex32(d)}，统计其中 1`,
      en: `Hamming: x=${hex32(x)} XOR y=${hex32(y)} = ${hex32(d)}, count 1-bits`,
    })
    .setArray(bytes32(d), undefined, [])
    .setAux([
      { label: 'x', value: hex32(x), role: 'pivot' },
      { label: 'y', value: hex32(y), role: 'pivot' },
      { label: 'x XOR y', value: hex32(d), role: 'compare' },
    ])
    .commit();

  const hooks: HammingHooks = {
    onClear: (remD, count) => {
      rec
        .begin({
          zh: `清掉一个差异位（Kernighan）→ 剩余 d = ${hex32(remD)}，已计数 ${count}`,
          en: `Cleared one differing bit (Kernighan) → remaining d = ${hex32(remD)}, count ${count}`,
        })
        .setArray(bytes32(remD), undefined, [])
        .setAux([
          { label: '剩余 d', value: hex32(remD), role: 'frontier' },
          { label: '已计数', value: String(count), role: 'final' },
        ])
        .commit();
    },
  };

  const result = hammingDistance(x, y, hooks);

  rec
    .begin({ zh: `完成：汉明距离 = ${result}`, en: `Done: Hamming distance = ${result}` })
    .setAux([{ label: '汉明距离', value: String(result), role: 'final' }])
    .commit();

  return rec.build();
}
