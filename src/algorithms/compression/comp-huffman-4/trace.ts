import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { canonicalHuffman } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const freq = new Map([
    ['A'.charCodeAt(0), 5],
    ['B'.charCodeAt(0), 2],
    ['C'.charCodeAt(0), 1],
    ['D'.charCodeAt(0), 1],
  ]);
  rec.begin({ zh: '规范 Huffman', en: 'Canonical Huffman' }).commit();
  const codes = canonicalHuffman(freq, {
    onLengths: (l) =>
      rec
        .begin({
          zh: `码长: ${[...l.entries()].map(([s, n]) => String.fromCharCode(s) + ':' + n).join(' ')}`,
          en: 'lengths',
        })
        .setAux([{ label: 'syms', value: String(l.size), role: 'compare' as BarRole }])
        .commit(),
    onCodes: (cs) =>
      rec
        .begin({ zh: `码字生成`, en: 'codes built' })
        .setBars(
          cs.map((c) => ({
            value: c.len,
            role: 'final' as BarRole,
            label: String.fromCharCode(c.sym),
          })),
        )
        .commit(),
  });
  void codes;
  return rec.build();
}
