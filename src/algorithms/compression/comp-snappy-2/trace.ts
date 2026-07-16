import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { snappyEncode } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const input = 'ABCDEFGHIJKLMNOPABCDEFGHIJKLMNOP';
  const codes = input.split('').map((c) => c.charCodeAt(0));
  rec
    .begin({ zh: 'Snappy', en: 'Snappy' })
    .setArray(
      codes,
      codes.map(() => 'default' as BarRole),
      [],
    )
    .commit();
  snappyEncode(input, {
    onEmit: (t) =>
      rec
        .begin({
          zh: t.kind === 'copy' ? `copy len=${t.len} d=${t.distance}` : `literal len=${t.len}`,
          en: '',
        })
        .setAux([
          {
            label: t.kind,
            value: String(t.len),
            role: t.kind === 'copy' ? 'final' : ('compare' as BarRole),
          },
        ])
        .commit(),
  });
  return rec.build();
}
