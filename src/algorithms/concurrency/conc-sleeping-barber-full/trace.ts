import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { sleepingBarberFull } from './impl.ts';
export const DEFAULT_INPUT = { chairs: 2, customers: 4 };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '理发师 chairs=' + input.chairs, en: 'Barber' }).commit();
  const r = sleepingBarberFull(input.chairs, input.customers, {
    onSit: (c) =>
      rec
        .begin({ zh: 'C' + c + ' 等候', en: 'sit' })
        .setAux([{ label: 'cust', value: 'C' + c, role: 'compare' as BarRole }])
        .commit(),
    onCut: (c) =>
      rec
        .begin({ zh: '理发 C' + c, en: 'cut' })
        .setAux([{ label: 'cut', value: 'C' + c, role: 'final' as BarRole }])
        .commit(),
    onLeave: (c) =>
      rec
        .begin({ zh: 'C' + c + ' 离开', en: 'leave' })
        .setAux([{ label: 'leave', value: 'C' + c, role: 'warn' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: '服务 ' + r.served + ' 流失 ' + r.lost, en: 'result' })
    .setAux([
      { label: 'served', value: String(r.served), role: 'final' as BarRole },
      { label: 'lost', value: String(r.lost), role: 'final' as BarRole },
    ])
    .commit();
  return rec.build();
}
