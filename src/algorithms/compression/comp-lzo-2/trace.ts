import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { lzoEncode } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const input = 'AAAAAAABCABABCAB';
  const codes = input.split('').map((c) => c.charCodeAt(0));
  rec
    .begin({ zh: 'LZO', en: 'LZO' })
    .setArray(
      codes,
      codes.map(() => 'default' as BarRole),
      [],
    )
    .commit();
  lzoEncode(input, {
    onRun: (p, l) =>
      rec
        .begin({ zh: `run @${p} len=${l}`, en: `run @${p} len=${l}` })
        .setAux([{ label: 'run', value: String(l), role: 'final' as BarRole }])
        .commit(),
    onEmit: (t) =>
      rec
        .begin({ zh: `emit ${t.kind}`, en: `emit ${t.kind}` })
        .setAux([{ label: t.kind, value: String(t.len), role: 'compare' as BarRole }])
        .commit(),
  });
  return rec.build();
}
