import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { lz2Encode } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const input = 'ABABABABABC';
  const codes = input.split('').map((c) => c.charCodeAt(0));
  rec
    .begin({ zh: 'LZ v2', en: 'LZ v2' })
    .setArray(
      codes,
      codes.map(() => 'default' as BarRole),
      [{ index: 0, label: 'pos' }],
    )
    .commit();
  let pos = 0;
  lz2Encode(input, 8, 3, {
    onMatch: (p, d, l) => {
      pos = p;
      rec
        .begin({ zh: `匹配 @${p} d=${d} len=${l}`, en: `match @${p} d=${d} len=${l}` })
        .setArray(
          codes,
          codes.map((_, i) => (i >= p && i < p + l ? 'swap' : 'default') as BarRole),
          [{ index: p, label: 'pos' }],
        )
        .setAux([{ label: '(d,l)', value: `${d},${l}`, role: 'final' as BarRole }])
        .commit();
    },
    onEmit: (t) =>
      rec
        .begin({ zh: `emit (${t.distance},${t.length})`, en: `emit (${t.distance},${t.length})` })
        .setAux([{ label: 'emit', value: `${t.distance},${t.length}`, role: 'final' as BarRole }])
        .commit(),
  });
  void pos;
  return rec.build();
}
