// =============================================================================
// PEXT · 录制帧序列
// =============================================================================

import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { pext, type PextHooks } from './impl.ts';

export const DEFAULT_INPUT = { x: 0xdeadbeef, m: 0x0f0f0f0f };

function hex32(n: number): string {
  return '0x' + (n >>> 0).toString(16).padStart(8, '0');
}

export function buildTrace(input: { x: number; m: number } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { x, m } = input;

  rec
    .begin({
      zh: `PEXT：从 x=${hex32(x)} 提取 m=${hex32(m)} 为 1 的位到低位`,
      en: `PEXT: extract bits of x=${hex32(x)} at m=${hex32(m)} into low bits`,
    })
    .setAux([
      { label: 'x', value: hex32(x), role: 'pivot' },
      { label: 'm', value: hex32(m), role: 'compare' },
    ])
    .commit();

  const hooks: PextHooks = {
    onPick: (srcPos, dstPos, acc) => {
      rec
        .begin({
          zh: `取 x 的位 ${srcPos} → 结果位 ${dstPos}：当前 = ${hex32(acc)}`,
          en: `take x bit ${srcPos} → result bit ${dstPos}: now = ${hex32(acc)}`,
        })
        .setAux([
          { label: '源位', value: String(srcPos), role: 'frontier' },
          { label: '目标位', value: String(dstPos), role: 'frontier' },
          { label: '当前结果', value: hex32(acc), role: 'compare' },
        ])
        .commit();
    },
  };

  const result = pext(x, m, hooks);

  rec
    .begin({ zh: `完成：pext = ${hex32(result)}`, en: `Done: pext = ${hex32(result)}` })
    .setAux([{ label: 'pext 结果', value: hex32(result), role: 'final' }])
    .commit();

  return rec.build();
}
