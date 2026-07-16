// =============================================================================
// Huffman + 算术混合 · 录制帧序列
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { hybridEncode, hybridDecode, type HybridHooks } from './impl.ts';

export const DEFAULT_INPUT = [97, 97, 97, 97, 98, 98, 99, 99, 100, 101, 102];

export function buildTrace(input: readonly number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const emitted: Array<{ sym: number; code: string; method: string }> = [];

  rec
    .begin({ zh: `输入 ${input.length} 字节，K=3`, en: `Input ${input.length} bytes, K=3` })
    .setAux(
      input.map((b, i) => ({
        label: `b${i}`,
        value: String.fromCharCode(b),
        role: 'default' as BarRole,
      })),
    )
    .commit();

  const hooks: HybridHooks = {
    onCode: (sym, code, method) => emitted.push({ sym, code, method }),
  };

  const result = hybridEncode(input, 3, hooks);
  const decoded = hybridDecode(result, result.bitstream, input.length);
  const ok = decoded.length === input.length && decoded.every((v, i) => v === input[i]);

  for (const e of emitted) {
    rec
      .begin({
        zh: `'${String.fromCharCode(e.sym)}' → [${e.method}] ${e.code}`,
        en: `'${String.fromCharCode(e.sym)}' → [${e.method}] ${e.code}`,
      })
      .setAux([
        { label: '符号', value: String.fromCharCode(e.sym), role: 'compare' as BarRole },
        { label: '方法', value: e.method, role: 'pivot' as BarRole },
        { label: '编码', value: e.code, role: 'final' as BarRole },
      ])
      .commit();
  }

  rec
    .begin({
      zh: `完成：${result.bitstream.length} bit，往返${ok ? '一致' : '不一致'}`,
      en: `Done: ${result.bitstream.length} bits, ${ok ? 'OK' : 'FAIL'}`,
    })
    .setAux([
      { label: 'Huffman 符号数', value: String(result.huffmanSyms.size), role: 'final' as BarRole },
      { label: '总位数', value: String(result.bitstream.length), role: 'pivot' as BarRole },
      { label: '往返一致', value: ok ? '是' : '否', role: 'final' as BarRole },
    ])
    .commit();

  return rec.build();
}
