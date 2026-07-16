// =============================================================================
// Brotli 熵编码 · 录制帧序列
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { brotliEntropyEncode, brotliEntropyDecode, type BrotliEntropyHooks } from './impl.ts';

export const DEFAULT_INPUT = [97, 97, 97, 98, 98, 99, 99, 99, 99, 100];

export function buildTrace(input: readonly number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const codeTable: Array<{ sym: number; code: string }> = [];

  rec
    .begin({ zh: `输入 ${input.length} 字节`, en: `Input ${input.length} bytes` })
    .setArray([...input], undefined, [])
    .setAux(
      input.map((b, i) => ({
        label: String(i),
        value: String.fromCharCode(b),
        role: 'default' as BarRole,
      })),
    )
    .commit();

  const hooks: BrotliEntropyHooks = {
    onCode: (sym, code) => codeTable.push({ sym, code }),
  };

  const { codes, bitstream } = brotliEntropyEncode(input, hooks);
  const decoded = brotliEntropyDecode(codes, bitstream);
  const ok = decoded.length === input.length && decoded.every((v, i) => v === input[i]);

  rec
    .begin({
      zh: `构建 Huffman 码本（${codes.size} 个符号）`,
      en: `Built Huffman codebook (${codes.size} symbols)`,
    })
    .setAux(
      codeTable.map((c) => ({
        label: String.fromCharCode(c.sym),
        value: c.code,
        role: 'pivot' as BarRole,
      })),
    )
    .commit();

  rec
    .begin({
      zh: `完成：${bitstream.length} bit，往返${ok ? '一致' : '不一致'}`,
      en: `Done: ${bitstream.length} bits, ${ok ? 'OK' : 'FAIL'}`,
    })
    .setAux([
      { label: '原始字节', value: String(input.length), role: 'compare' as BarRole },
      { label: '编码位数', value: String(bitstream.length), role: 'final' as BarRole },
      { label: '符号数', value: String(codes.size), role: 'pivot' as BarRole },
      { label: '往返一致', value: ok ? '是' : '否', role: 'final' as BarRole },
    ])
    .commit();

  return rec.build();
}
