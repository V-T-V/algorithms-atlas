// =============================================================================
// 扩展 Elias Gamma · 录制帧序列
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { extGammaEncodeAll, extGammaDecodeAll, type ExtGammaHooks } from './impl.ts';

export const DEFAULT_INPUT = [0, 1, -1, 3, -5, 8];

export function buildTrace(input: readonly number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const codes: Array<{ n: number; bits: string }> = [];

  rec
    .begin({ zh: `输入：[${input.join(', ')}]`, en: `Input: [${input.join(', ')}]` })
    .setAux(input.map((n, i) => ({ label: `n${i}`, value: String(n), role: 'pivot' as BarRole })))
    .commit();

  const hooks: ExtGammaHooks = {
    onEncode: (n, bits) => codes.push({ n, bits }),
  };

  const bitstream = extGammaEncodeAll(input, hooks);
  const decoded = extGammaDecodeAll(bitstream);
  const ok = decoded.length === input.length && decoded.every((v, i) => v === input[i]);

  for (const c of codes) {
    rec
      .begin({ zh: `n=${c.n} → ${c.bits}`, en: `n=${c.n} → ${c.bits}` })
      .setAux([
        { label: 'n', value: String(c.n), role: 'compare' as BarRole },
        { label: '编码', value: c.bits, role: 'final' as BarRole },
      ])
      .commit();
  }

  rec
    .begin({
      zh: `完成：${bitstream.length} bit，往返${ok ? '一致' : '不一致'}`,
      en: `Done: ${bitstream.length} bits, ${ok ? 'OK' : 'FAIL'}`,
    })
    .setAux([
      { label: '总位数', value: String(bitstream.length), role: 'final' as BarRole },
      { label: '往返一致', value: ok ? '是' : '否', role: 'final' as BarRole },
    ])
    .commit();

  return rec.build();
}
