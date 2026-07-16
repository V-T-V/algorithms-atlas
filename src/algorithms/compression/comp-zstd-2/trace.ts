import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { zstdEncode } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const input = 'ABABABABABABABCDCDCDCD';
  const codes = input.split('').map((c) => c.charCodeAt(0));
  rec
    .begin({ zh: 'Zstd', en: 'Zstd' })
    .setArray(
      codes,
      codes.map(() => 'default' as BarRole),
      [],
    )
    .commit();
  zstdEncode(input, 16, 3, {
    onEmit: (t) =>
      rec
        .begin({
          zh: t.kind === 'match' ? `match len=${t.len} d=${t.distance}` : `lit ${t.literal}`,
          en: '',
        })
        .setAux([
          {
            label: t.kind,
            value: String(t.len),
            role: t.kind === 'match' ? 'final' : ('compare' as BarRole),
          },
        ])
        .commit(),
    onStats: (f) =>
      rec
        .begin({ zh: `频率表 ${f.size} 项`, en: `freq ${f.size} entries` })
        .setAux([{ label: 'symbols', value: String(f.size), role: 'final' as BarRole }])
        .commit(),
  });
  return rec.build();
}
