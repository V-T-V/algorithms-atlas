import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { bertrandDuopoly } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '伯特兰: a=10 c=2', en: 'Bertrand: a=10 c=2' }).commit();
  const r = bertrandDuopoly(10, 2, {
    onEquilibrium: (p) =>
      rec
        .begin({ zh: `均衡价格 = 边际成本 ${p}`, en: `Eq price = marginal cost ${p}` })
        .setBars([{ value: p, role: 'final' as BarRole, label: 'p*' }])
        .commit(),
  });
  rec
    .begin({ zh: `每方利润 ${r.profit}`, en: `each profit ${r.profit}` })
    .setAux([{ label: '利润', value: String(r.profit), role: 'warn' as BarRole }])
    .commit();
  return rec.build();
}
