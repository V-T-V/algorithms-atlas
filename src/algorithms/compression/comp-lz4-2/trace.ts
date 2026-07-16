import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { lz4Encode } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const input = 'ABCDEFGABCDEFGABCDEFG';
  const codes = input.split('').map((c) => c.charCodeAt(0));
  rec
    .begin({ zh: 'LZ4', en: 'LZ4' })
    .setArray(
      codes,
      codes.map(() => 'default' as BarRole),
      [{ index: 0, label: 'pos' }],
    )
    .commit();
  lz4Encode(input, 16, {
    onMatch: (p, d, l) =>
      rec
        .begin({ zh: `匹配 @${p} d=${d} len=${l}`, en: `match @${p} d=${d} len=${l}` })
        .setArray(
          codes,
          codes.map((_, i) => (i >= p && i < p + l ? 'swap' : 'default') as BarRole),
          [{ index: p, label: 'pos' }],
        )
        .setAux([{ label: '(d,l)', value: `${d},${l}`, role: 'final' as BarRole }])
        .commit(),
    onEmit: (t) =>
      rec
        .begin({
          zh: `emit lit=${t.litLen} match=${t.matchLen + 4} d=${t.distance}`,
          en: `emit lit=${t.litLen} match=${t.matchLen + 4} d=${t.distance}`,
        })
        .setAux([
          {
            label: 'token',
            value: `${t.litLen}/${t.matchLen + 4}/${t.distance}`,
            role: 'final' as BarRole,
          },
        ])
        .commit(),
  });
  return rec.build();
}
