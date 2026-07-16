import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { mtfEncode } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const data = 'banana'.split('').map((c) => c.charCodeAt(0));
  const alphabet = [...new Set(data)].sort((a, b) => a - b);
  rec
    .begin({ zh: 'MTF', en: 'MTF' })
    .setBars(data.map((v) => ({ value: v, role: 'default' as BarRole })))
    .commit();
  mtfEncode(data, alphabet, {
    onEncode: (s, idx) =>
      rec
        .begin({ zh: `'${String.fromCharCode(s)}' → idx=${idx}`, en: '' })
        .setAux([{ label: 'idx', value: String(idx), role: 'final' as BarRole }])
        .commit(),
  });
  return rec.build();
}
