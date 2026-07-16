import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { Bulkhead } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const b = new Bulkhead({
    onAcquire: (p, n) =>
      rec
        .begin({ zh: `acquire ${p} inFlight=${n}`, en: '' })
        .setAux([{ label: p, value: String(n), role: 'compare' as BarRole }])
        .commit(),
    onReject: (p) =>
      rec
        .begin({ zh: `reject ${p}`, en: '' })
        .setAux([{ label: 'reject', value: p, role: 'warn' as BarRole }])
        .commit(),
    onRelease: (p, n) =>
      rec
        .begin({ zh: `release ${p} inFlight=${n}`, en: '' })
        .setAux([{ label: p, value: String(n), role: 'final' as BarRole }])
        .commit(),
  });
  void b.runInPool('A', 1, async () => 1);
  void b.runInPool('A', 1, async () => 2).catch(() => {});
  return rec.build();
}
