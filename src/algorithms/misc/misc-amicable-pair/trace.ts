import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { amicablePairs } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '亲和数 limit=300', en: 'Amicable limit=300' }).commit();
  const pairs = amicablePairs(300, {
    onConclude: (ps) =>
      rec
        .begin({ zh: `找到 ${ps.length} 对`, en: `found ${ps.length} pairs` })
        .setBars(ps.map(() => ({ value: 1, role: 'final' as BarRole })))
        .commit(),
  });
  rec
    .begin({
      zh: pairs.map((p) => `(${p[0]},${p[1]})`).join(' '),
      en: pairs.map((p) => `(${p[0]},${p[1]})`).join(' '),
    })
    .setAux(
      pairs.length
        ? [
            {
              label: 'pairs',
              value: pairs.map((p) => p.join(',')).join('; '),
              role: 'final' as BarRole,
            },
          ]
        : [],
    )
    .commit();
  return rec.build();
}
