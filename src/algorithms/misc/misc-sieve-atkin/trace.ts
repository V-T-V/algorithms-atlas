import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { sieveAtkin } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const limit = 30;
  rec.begin({ zh: `Atkin 筛 ${limit}`, en: `Atkin sieve ${limit}` }).commit();
  const ps = sieveAtkin(limit, {
    onConclude: (c) =>
      rec
        .begin({ zh: `${c} 个素数`, en: `${c} primes` })
        .setBars([{ value: c, role: 'final' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: ps.join(', '), en: ps.join(', ') })
    .setBars(ps.map((p) => ({ value: p, role: 'final' as BarRole })))
    .commit();
  return rec.build();
}
