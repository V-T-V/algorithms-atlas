import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { zlibWrap } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const input = 'hellohello';
  rec.begin({ zh: 'zlib 包装', en: 'zlib wrap' }).commit();
  zlibWrap(input, {
    onHeader: (h) =>
      rec
        .begin({ zh: `头部 ${h.map((x) => x.toString(16)).join(' ')}`, en: `header` })
        .setBars(h.map((b) => ({ value: b, role: 'compare' as BarRole })))
        .commit(),
    onAdler: (a) =>
      rec
        .begin({ zh: `Adler32=${a.toString(16)}`, en: `Adler32=${a.toString(16)}` })
        .setAux([{ label: 'Adler', value: a.toString(16), role: 'final' as BarRole }])
        .commit(),
  });
  return rec.build();
}
