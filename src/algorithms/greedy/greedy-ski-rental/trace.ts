import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { skiRental } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '租雪板: rent=1 buy=10', en: 'Ski rental: rent=1 buy=10' }).commit();
  const r = skiRental(15, 1, 10, {
    onDay: (d, a, t) =>
      rec
        .begin({ zh: `day${d} ${a} 累计${t}`, en: `day${d} ${a} total${t}` })
        .setBars([{ value: t, role: a === 'buy' ? ('final' as BarRole) : ('pivot' as BarRole) }])
        .commit(),
  });
  rec
    .begin({ zh: `总花费 ${r.total}`, en: `total ${r.total}` })
    .setAux([{ label: 'total', value: String(r.total), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
