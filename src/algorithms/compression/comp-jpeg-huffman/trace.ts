// =============================================================================
// JPEG Huffman 表 · 录制帧序列
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { deriveBits, buildJpegTable, jpegEncode, jpegDecode, type JpegHooks } from './impl.ts';

export const DEFAULT_FREQ = new Map<number, number>([
  [0, 50],
  [1, 20],
  [2, 15],
  [3, 8],
  [4, 4],
  [5, 2],
  [6, 1],
]);

export function buildTrace(freqs: Map<number, number> = DEFAULT_FREQ): Frame[] {
  const rec = new TraceRecorder();
  const codeTable: Array<{ sym: number; code: string }> = [];

  rec
    .begin({
      zh: `频率表 ${freqs.size} 符号 → 推导 JPEG BITS/HUFFVAL`,
      en: `Frequency table ${freqs.size} symbols → derive JPEG BITS/HUFFVAL`,
    })
    .setAux(
      [...freqs.entries()].map(([sym, f]) => ({
        label: `s${sym}`,
        value: `f=${f}`,
        role: 'pivot' as BarRole,
      })),
    )
    .commit();

  const { bits, huffval } = deriveBits(freqs);

  rec
    .begin({ zh: `BITS=[${bits.join(',')}]`, en: `BITS=[${bits.join(',')}]` })
    .setAux(
      bits.map((c, i) => ({
        label: `L${i + 1}`,
        value: String(c),
        role: 'compare' as BarRole,
      })),
    )
    .commit();

  const hooks: JpegHooks = {
    onSymbol: (sym, code) => codeTable.push({ sym, code }),
  };
  const table = buildJpegTable(bits, huffval, hooks);

  // 编码一段示例符号
  const sampleSyms = [...freqs.keys()].sort((a, b) => a - b);
  const encoded = jpegEncode(table.codes, sampleSyms);
  const decoded = jpegDecode(table.codes, encoded);
  const ok = decoded.length === sampleSyms.length && decoded.every((v, i) => v === sampleSyms[i]);

  rec
    .begin({
      zh: `规范码本（${table.codes.size} 项）`,
      en: `Canonical codes (${table.codes.size} entries)`,
    })
    .setAux(
      codeTable.map((e) => ({
        label: `s${e.sym}`,
        value: e.code,
        role: 'final' as BarRole,
      })),
    )
    .commit();

  rec
    .begin({
      zh: `编码 ${encoded.length} bit，往返${ok ? '一致' : '不一致'}`,
      en: `Encoded ${encoded.length} bits, ${ok ? 'OK' : 'FAIL'}`,
    })
    .setAux([
      { label: 'HUFFVAL', value: huffval.join(','), role: 'compare' as BarRole },
      { label: '位数', value: String(encoded.length), role: 'final' as BarRole },
      { label: '往返一致', value: ok ? '是' : '否', role: 'final' as BarRole },
    ])
    .commit();

  return rec.build();
}
