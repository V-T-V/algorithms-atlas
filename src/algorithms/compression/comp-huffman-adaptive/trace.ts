// =============================================================================
// 自适应 Huffman · 录制帧序列
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { AdaptiveHuffman, type AdaptiveHuffHooks } from './impl.ts';

export const DEFAULT_INPUT = [97, 97, 98, 97, 99, 97, 98, 97];

export function buildTrace(input: readonly number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const events: Array<{ sym: number; code: string; isNew: boolean }> = [];

  rec
    .begin({
      zh: `输入 ${input.length} 字节，逐符号自适应编码`,
      en: `Input ${input.length} bytes, adaptive coding`,
    })
    .setAux(
      input.map((b, i) => ({
        label: `b${i}`,
        value: String.fromCharCode(b),
        role: 'default' as BarRole,
      })),
    )
    .commit();

  const hooks: AdaptiveHuffHooks = {
    onSymbol: (sym, code, isNew) => events.push({ sym, code, isNew }),
  };

  const coder = new AdaptiveHuffman(hooks);
  const bits = coder.encode(input);
  const decoded = coder.decode(bits);
  const ok = decoded.length === input.length && decoded.every((v, i) => v === input[i]);

  // 每个符号一帧
  for (let i = 0; i < events.length; i++) {
    const e = events[i]!;
    rec
      .begin({
        zh: `[${i}] sym='${String.fromCharCode(e.sym)}' ${e.isNew ? '(新)' : '(已知)'} → ${e.code}`,
        en: `[${i}] sym='${String.fromCharCode(e.sym)}' ${e.isNew ? '(new)' : '(known)'} → ${e.code}`,
      })
      .setAux([
        { label: '符号', value: String.fromCharCode(e.sym), role: 'compare' as BarRole },
        { label: '编码', value: e.code, role: 'final' as BarRole },
        { label: '类型', value: e.isNew ? 'NYT+字节' : '已编码', role: 'pivot' as BarRole },
      ])
      .commit();
  }

  rec
    .begin({
      zh: `完成：共 ${bits.length} bit，往返${ok ? '一致' : '不一致'}`,
      en: `Done: ${bits.length} bits, roundtrip ${ok ? 'OK' : 'FAIL'}`,
    })
    .setAux([
      { label: '总位数', value: String(bits.length), role: 'final' as BarRole },
      { label: '往返一致', value: ok ? '是' : '否', role: 'final' as BarRole },
    ])
    .commit();

  return rec.build();
}
