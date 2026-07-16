import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { cournotDuopoly } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec
    .begin({ zh: '古诺: a=10 b=1 c=2', en: 'Cournot: a=10 b=1 c=2' })
    .setAux([{ label: 'a', value: '10', role: 'default' as BarRole }])
    .commit();
  const r = cournotDuopoly(10, 1, 2, 2, {
    onEquilibrium: (q1, q2) =>
      rec
        .begin({
          zh: `均衡 q1=${q1.toFixed(2)} q2=${q2.toFixed(2)}`,
          en: `Eq q1=${q1.toFixed(2)} q2=${q2.toFixed(2)}`,
        })
        .setBars([
          { value: q1, role: 'final' as BarRole, label: 'q1' },
          { value: q2, role: 'final' as BarRole, label: 'q2' },
        ])
        .commit(),
  });
  rec
    .begin({
      zh: `利润 π1=${r.profit1.toFixed(2)} π2=${r.profit2.toFixed(2)}`,
      en: `profit π1=${r.profit1.toFixed(2)} π2=${r.profit2.toFixed(2)}`,
    })
    .setAux([
      { label: 'π1', value: r.profit1.toFixed(2), role: 'final' as BarRole },
      { label: 'π2', value: r.profit2.toFixed(2), role: 'final' as BarRole },
    ])
    .commit();
  return rec.build();
}
