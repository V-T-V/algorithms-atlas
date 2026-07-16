import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { BoundedMonitor } from './impl.ts';
export const DEFAULT_INPUT: any = { cap: 2, items: [1, 2, 3] };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '监视器', en: 'Monitor' }).commit();
  const m = new BoundedMonitor(input.cap);
  for (const x of input.items) {
    m.put(x, {
      onSignal: () =>
        rec
          .begin({ zh: 'put ' + x + ' size=' + m.size(), en: 'put' })
          .setAux([{ label: 'x', value: String(x), role: 'compare' as BarRole }])
          .commit(),
    });
  }
  rec
    .begin({ zh: 'size ' + m.size(), en: 'size' })
    .setAux([{ label: 'size', value: String(m.size()), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
