import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { ppmStar } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const data = 'AABABCABAB'.split('').map((c) => c.charCodeAt(0));
  rec
    .begin({ zh: 'PPM*d', en: 'PPM*d' })
    .setBars(data.map((v) => ({ value: v, role: 'default' as BarRole })))
    .commit();
  ppmStar(data, {
    onBlend: (s, p) =>
      rec
        .begin({ zh: `'${String.fromCharCode(s)}' 混合 p=${p.toFixed(2)}`, en: '' })
        .setBars(data.map((v) => ({ value: v, role: (v === s ? 'final' : 'default') as BarRole })))
        .setAux([{ label: 'prob', value: p.toFixed(2), role: 'compare' as BarRole }])
        .commit(),
  });
  return rec.build();
}
