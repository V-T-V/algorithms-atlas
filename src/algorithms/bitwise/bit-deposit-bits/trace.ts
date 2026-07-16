// =============================================================================
// 位放置（PDEP）· 录制帧序列
// =============================================================================

import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { depositBits, type DepositHooks } from './impl.ts';

export const DEFAULT_INPUT = { x: 0xf, m: 0xf0 };

function hex32(n: number): string {
  return '0x' + (n >>> 0).toString(16).padStart(8, '0');
}

export function buildTrace(input: { x: number; m: number } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { x, m } = input;

  rec
    .begin({
      zh: `位放置：把 x=${hex32(x)} 的低位散布到 m=${hex32(m)} 为 1 的位置`,
      en: `Deposit: scatter low bits of x=${hex32(x)} into m=${hex32(m)} set positions`,
    })
    .setAux([
      { label: 'x', value: hex32(x), role: 'pivot' },
      { label: 'm', value: hex32(m), role: 'compare' },
    ])
    .commit();

  const hooks: DepositHooks = {
    onBit: (srcPos, dstPos, acc) => {
      rec
        .begin({
          zh: `源位 ${srcPos} → 目标位 ${dstPos}，当前结果 = ${hex32(acc)}`,
          en: `src bit ${srcPos} → dst bit ${dstPos}, result = ${hex32(acc)}`,
        })
        .setAux([
          { label: '源位 pos', value: String(srcPos), role: 'frontier' },
          { label: '目标位 pos', value: String(dstPos), role: 'frontier' },
          { label: '当前结果', value: hex32(acc), role: 'compare' },
        ])
        .commit();
    },
  };

  const result = depositBits(x, m, hooks);

  rec
    .begin({ zh: `完成：deposit = ${hex32(result)}`, en: `Done: deposit = ${hex32(result)}` })
    .setAux([{ label: 'deposit 结果', value: hex32(result), role: 'final' }])
    .commit();

  return rec.build();
}
