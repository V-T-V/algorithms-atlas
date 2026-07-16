// =============================================================================
// 规范 Huffman · 录制帧序列
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { canonicalHuffman, encodeWith, decodeWith, type CanonicalHuffmanHooks } from './impl.ts';

export const DEFAULT_INPUT = [97, 97, 97, 98, 98, 99, 99, 99, 99, 100];

export function buildTrace(input: readonly number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const lenTable: Array<{ sym: number; len: number }> = [];
  const codeTable: Array<{ sym: number; code: string }> = [];

  rec
    .begin({ zh: `输入 ${input.length} 字节`, en: `Input ${input.length} bytes` })
    .setAux(
      input.map((b, i) => ({
        label: String(i),
        value: String.fromCharCode(b),
        role: 'default' as BarRole,
      })),
    )
    .commit();

  const freqs = new Map<number, number>();
  for (const b of input) freqs.set(b, (freqs.get(b) ?? 0) + 1);

  const hooks: CanonicalHuffmanHooks = {
    onLength: (sym, len) => lenTable.push({ sym, len }),
    onCode: (sym, code) => codeTable.push({ sym, code }),
  };

  const { lengths, codes } = canonicalHuffman(freqs, hooks);
  const bits = encodeWith(codes, input);
  const decoded = decodeWith(codes, bits);
  const ok = decoded.length === input.length && decoded.every((v, i) => v === input[i]);

  rec
    .begin({ zh: `码长（${lengths.size} 符号）`, en: `Code lengths (${lengths.size} symbols)` })
    .setAux(
      lenTable.map((e) => ({
        label: String.fromCharCode(e.sym),
        value: `len=${e.len}`,
        role: 'pivot' as BarRole,
      })),
    )
    .commit();

  rec
    .begin({
      zh: `规范码本构建完成；编码 ${bits.length} bit`,
      en: `Canonical codes built; ${bits.length} bits`,
    })
    .setAux(
      codeTable.map((e) => ({
        label: String.fromCharCode(e.sym),
        value: e.code,
        role: 'final' as BarRole,
      })),
    )
    .commit();

  rec
    .begin({
      zh: `完成：往返${ok ? '一致' : '不一致'}`,
      en: `Done: roundtrip ${ok ? 'OK' : 'FAIL'}`,
    })
    .setAux([
      { label: '原始字节', value: String(input.length), role: 'compare' as BarRole },
      { label: '编码位数', value: String(bits.length), role: 'final' as BarRole },
      { label: '往返一致', value: ok ? '是' : '否', role: 'final' as BarRole },
    ])
    .commit();

  return rec.build();
}
