import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { deflateEncode } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const input = 'abcabcabcabc';
  const codes = input.split('').map((c) => c.charCodeAt(0));
  rec
    .begin({ zh: 'DEFLATE', en: 'DEFLATE' })
    .setArray(
      codes,
      codes.map(() => 'default' as BarRole),
      [],
    )
    .commit();
  deflateEncode(input, 16, 3, {
    onEmit: (t) =>
      rec
        .begin({ zh: t.kind === 'match' ? `match ${t.len}` : `lit`, en: '' })
        .setAux([
          {
            label: t.kind,
            value: String(t.len),
            role: t.kind === 'match' ? 'final' : ('compare' as BarRole),
          },
        ])
        .commit(),
    onHuffman: (f) =>
      rec
        .begin({ zh: `Huffman: ${f.size} 符号`, en: `Huffman: ${f.size} symbols` })
        .setAux([{ label: 'symbols', value: String(f.size), role: 'final' as BarRole }])
        .commit(),
  });
  return rec.build();
}
