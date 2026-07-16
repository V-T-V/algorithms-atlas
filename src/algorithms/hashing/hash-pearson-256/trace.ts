import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { pearsonHash } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const s = 'pearson';
  rec.begin({ zh: `Pearson "${s}"`, en: `Pearson "${s}"` }).commit();
  const h = pearsonHash(s, {
    onByte: (i, b, hh) =>
      rec
        .begin({ zh: `${b}: ${hh}`, en: `${b}: ${hh}` })
        .setBars([{ value: hh, role: 'pivot' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: `hash=${h}`, en: `hash=${h}` })
    .setAux([{ label: 'hash', value: String(h), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
