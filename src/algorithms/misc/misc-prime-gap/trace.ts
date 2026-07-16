import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { primeGaps } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '素数间隙 limit=50', en: 'Prime gaps limit=50' }).commit();
  const r = primeGaps(50, {
    onGap: (p1, p2, g) =>
      rec
        .begin({ zh: `${p1}->${p2} gap=${g}`, en: `${p1}->${p2} gap=${g}` })
        .setBars([{ value: g, role: g === 2 ? ('final' as BarRole) : ('pivot' as BarRole) }])
        .commit(),
  });
  rec
    .begin({
      zh: `最大间隙 ${r.maxGap} 孪生 ${r.twinCount}`,
      en: `max ${r.maxGap} twins ${r.twinCount}`,
    })
    .setAux([
      { label: 'maxGap', value: String(r.maxGap), role: 'final' as BarRole },
      { label: 'twins', value: String(r.twinCount), role: 'final' as BarRole },
    ])
    .commit();
  return rec.build();
}
