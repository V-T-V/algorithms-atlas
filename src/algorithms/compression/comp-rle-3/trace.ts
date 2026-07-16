import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { rleEncode } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const data = 'AAAAAABCDEF'.split('').map((c) => c.charCodeAt(0));
  rec
    .begin({ zh: 'RLE v3', en: 'RLE v3' })
    .setBars(data.map((v) => ({ value: v, role: 'default' as BarRole })))
    .commit();
  rleEncode(data, 3, {
    onToken: (t) =>
      rec
        .begin({
          zh:
            t.kind === 'run'
              ? `run len=${t.len} char=${String.fromCharCode(t.char!)}`
              : `lit len=${t.len}`,
          en: '',
        })
        .setAux([
          {
            label: t.kind,
            value: String(t.len),
            role: t.kind === 'run' ? 'final' : ('compare' as BarRole),
          },
        ])
        .commit(),
  });
  return rec.build();
}
