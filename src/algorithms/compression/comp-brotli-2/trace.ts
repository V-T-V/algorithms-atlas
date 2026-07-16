import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { brotliEncode } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const input = 'www.html.body.div';
  const codes = input.split('').map((c) => c.charCodeAt(0));
  rec
    .begin({ zh: 'Brotli', en: 'Brotli' })
    .setArray(
      codes,
      codes.map(() => 'default' as BarRole),
      [],
    )
    .commit();
  brotliEncode(input, 16, {
    onEmit: (t) =>
      rec
        .begin({ zh: `emit ${t.kind} len=${t.len}`, en: `emit ${t.kind}` })
        .setAux([
          {
            label: t.kind,
            value: String(t.len),
            role: t.kind === 'dict' ? 'final' : ('compare' as BarRole),
          },
        ])
        .commit(),
  });
  return rec.build();
}
