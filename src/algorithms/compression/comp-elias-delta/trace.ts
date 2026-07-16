// =============================================================================
// Elias Delta · 录制帧序列
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { eliasDeltaEncodeAll, eliasDeltaDecodeAll, type EliasDeltaHooks } from './impl.ts';

export const DEFAULT_INPUT = [1, 2, 3, 5, 8, 13];

export function buildTrace(input: readonly number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const codes: Array<{ n: number; bits: string }> = [];

  rec
    .begin({ zh: `输入：[${input.join(', ')}]`, en: `Input: [${input.join(', ')}]` })
    .setAux(input.map((n, i) => ({ label: `n${i}`, value: String(n), role: 'pivot' as BarRole })))
    .commit();

  const hooks: EliasDeltaHooks = {
    onEncode: (n, bits) => codes.push({ n, bits }),
  };

  const bitstream = eliasDeltaEncodeAll(input, hooks);
  const decoded = eliasDeltaDecodeAll(bitstream);
  const ok = decoded.length === input.length && decoded.every((v, i) => v === input[i]);

  // 每个编码
  for (const c of codes) {
    rec
      .begin({ zh: `编码 n=${c.n} → ${c.bits}`, en: `Encode n=${c.n} → ${c.bits}` })
      .setAux([
        { label: '当前 n', value: String(c.n), role: 'compare' as BarRole },
        { label: '编码', value: c.bits, role: 'final' as BarRole },
      ])
      .commit();
  }

  rec
    .begin({
      zh: `完成：共 ${bitstream.length} bit，往返${ok ? '一致' : '不一致'}`,
      en: `Done: ${bitstream.length} bits total, roundtrip ${ok ? 'OK' : 'FAIL'}`,
    })
    .setAux([
      { label: '总位数', value: String(bitstream.length), role: 'final' as BarRole },
      { label: '编码串', value: bitstream, role: 'pivot' as BarRole },
      { label: '往返一致', value: ok ? '是' : '否', role: 'final' as BarRole },
    ])
    .commit();

  return rec.build();
}
