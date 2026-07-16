import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { adaptiveHuffman } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const data = 'AABCBBCA'.split('').map((c) => c.charCodeAt(0));
  rec
    .begin({ zh: '自适应 Huffman', en: 'Adaptive Huffman' })
    .setBars(data.map((v) => ({ value: v, role: 'default' as BarRole })))
    .commit();
  adaptiveHuffman(data, {
    onEncode: (s, c) =>
      rec
        .begin({
          zh: `编码 '${String.fromCharCode(s)}' → ${c}`,
          en: `encode '${String.fromCharCode(s)}' → ${c}`,
        })
        .setAux([{ label: 'code', value: c, role: 'compare' as BarRole }])
        .commit(),
    onUpdate: (f) =>
      rec
        .begin({ zh: `频率更新 ${f.size} 符号`, en: `freq ${f.size}` })
        .setAux([{ label: 'syms', value: String(f.size), role: 'final' as BarRole }])
        .commit(),
  });
  return rec.build();
}
