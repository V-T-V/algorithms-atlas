// =============================================================================
// 字节序交换 · 录制帧序列
// =============================================================================

import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { bswap, type BswapHooks } from './impl.ts';

export const DEFAULT_INPUT = 0x12345678;

function bytes32(n: number): number[] {
  return [(n >>> 24) & 0xff, (n >>> 16) & 0xff, (n >>> 8) & 0xff, n & 0xff];
}

export function buildTrace(x: number = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();

  rec
    .begin({
      zh: `输入 x = 0x${(x >>> 0).toString(16).padStart(8, '0')}，反转字节顺序`,
      en: `Input x = 0x${(x >>> 0).toString(16).padStart(8, '0')}, reverse byte order`,
    })
    .setArray(bytes32(x), undefined, [])
    .setAux([
      { label: '输入 x', value: '0x' + (x >>> 0).toString(16).padStart(8, '0'), role: 'pivot' },
    ])
    .commit();

  const bytes: number[] = [];
  const hooks: BswapHooks = {
    onByte: (_b, v) => {
      bytes.push(v);
    },
  };

  const result = bswap(x, hooks);

  rec
    .begin({
      zh: `字节 [${bytes32(x)
        .map((b) => '0x' + b.toString(16).padStart(2, '0'))
        .join(', ')}] 反转后拼接 → 0x${(result >>> 0).toString(16).padStart(8, '0')}`,
      en: `Bytes reversed and concatenated → 0x${(result >>> 0).toString(16).padStart(8, '0')}`,
    })
    .setArray(bytes32(result), undefined, [])
    .setAux([
      { label: '结果', value: '0x' + (result >>> 0).toString(16).padStart(8, '0'), role: 'final' },
    ])
    .commit();

  rec
    .begin({
      zh: `完成：bswap(x) = 0x${(result >>> 0).toString(16).padStart(8, '0')}`,
      en: `Done: bswap(x) = 0x${(result >>> 0).toString(16).padStart(8, '0')}`,
    })
    .setAux([
      {
        label: 'bswap 结果',
        value: '0x' + (result >>> 0).toString(16).padStart(8, '0'),
        role: 'final',
      },
    ])
    .commit();

  return rec.build();
}
