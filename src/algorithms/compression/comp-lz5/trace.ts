import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { lz5Encode } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const input = 'ABCDEFGHIJKLMNOPABCDEFGHIJKLMNOP';
  const codes = input.split('').map((c) => c.charCodeAt(0));
  rec
    .begin({ zh: 'LZ5（大窗口）', en: 'LZ5 (large window)' })
    .setArray(
      codes,
      codes.map(() => 'default' as BarRole),
      [],
    )
    .commit();
  lz5Encode(input, 32, {
    onEmit: (t) =>
      rec
        .begin({ zh: `emit lit=${t.litLen} match=${t.matchLen + 4} d=${t.distance}`, en: `emit` })
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
