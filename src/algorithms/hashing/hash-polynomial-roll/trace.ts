import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { polynomialRollHash } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const s = 'polyhash';
  rec.begin({ zh: `多项式滚动 "${s}"`, en: `Poly rolling "${s}"` }).commit();
  polynomialRollHash(s, {
    onChar: (i, c, h1, h2) =>
      rec
        .begin({ zh: `${c}: (${h1}, ${h2})`, en: `${c}: (${h1}, ${h2})` })
        .setAux([
          { label: 'h1', value: String(h1), role: 'pivot' as BarRole },
          { label: 'h2', value: String(h2), role: 'pivot' as BarRole },
        ])
        .commit(),
  });
  return rec.build();
}
