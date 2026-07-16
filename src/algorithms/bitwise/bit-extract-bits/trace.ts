// =============================================================================
// 位提取（PEXT）· 录制帧序列
// =============================================================================

import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { extractBits, type ExtractHooks } from './impl.ts';

export const DEFAULT_INPUT = { x: 0xff, m: 0xf0 };

function hex32(n: number): string {
  return '0x' + (n >>> 0).toString(16).padStart(8, '0');
}

export function buildTrace(input: { x: number; m: number } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { x, m } = input;

  rec
    .begin({
      zh: `位提取：把 x=${hex32(x)} 中 m=${hex32(m)} 为 1 的位压缩到低位`,
      en: `Extract: pack bits of x=${hex32(x)} at m=${hex32(m)} set positions into low bits`,
    })
    .setAux([
      { label: 'x', value: hex32(x), role: 'pivot' },
      { label: 'm', value: hex32(m), role: 'compare' },
    ])
    .commit();

  const hooks: ExtractHooks = {
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

  const result = extractBits(x, m, hooks);

  rec
    .begin({ zh: `完成：extract = ${hex32(result)}`, en: `Done: extract = ${hex32(result)}` })
    .setAux([{ label: 'extract 结果', value: hex32(result), role: 'final' }])
    .commit();

  return rec.build();
}
