// =============================================================================
// 查表位反转 · 录制帧序列
// =============================================================================

import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { reverseLookup, type ReverseHooks } from './impl.ts';

export const DEFAULT_INPUT = 0x12345678;

function bytes32(n: number): number[] {
  return [(n >>> 24) & 0xff, (n >>> 16) & 0xff, (n >>> 8) & 0xff, n & 0xff];
}

export function buildTrace(x: number = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();

  rec
    .begin({
      zh: `输入 x = 0x${(x >>> 0).toString(16).padStart(8, '0')}，逐字节反转`,
      en: `Input x = 0x${(x >>> 0).toString(16).padStart(8, '0')}, reverse byte-by-byte`,
    })
    .setArray(bytes32(x), undefined, [])
    .setAux([
      { label: '输入 x', value: '0x' + (x >>> 0).toString(16).padStart(8, '0'), role: 'pivot' },
    ])
    .commit();

  const hooks: ReverseHooks = {
    onByte: (b, acc) => {
      rec
        .begin({
          zh: `处理第 ${b} 字节后累加 r = 0x${(acc >>> 0).toString(16).padStart(8, '0')}`,
          en: `After byte ${b}: accumulated r = 0x${(acc >>> 0).toString(16).padStart(8, '0')}`,
        })
        .setArray(bytes32(acc), undefined, [])
        .setAux([
          {
            label: '当前 r (hex)',
            value: '0x' + (acc >>> 0).toString(16).padStart(8, '0'),
            role: 'compare',
          },
          { label: '已处理字节', value: String(b + 1), role: 'frontier' },
        ])
        .commit();
    },
  };

  const result = reverseLookup(x, hooks);

  rec
    .begin({
      zh: `完成：reverse(x) = 0x${(result >>> 0).toString(16).padStart(8, '0')}`,
      en: `Done: reverse(x) = 0x${(result >>> 0).toString(16).padStart(8, '0')}`,
    })
    .setAux([
      {
        label: '反转结果',
        value: '0x' + (result >>> 0).toString(16).padStart(8, '0'),
        role: 'final',
      },
    ])
    .commit();

  return rec.build();
}
