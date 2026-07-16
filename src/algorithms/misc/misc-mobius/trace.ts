import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { mobius } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const ns = [1, 2, 6, 10, 12, 30];
  rec.begin({ zh: 'Möbius 函数', en: 'Mobius' }).commit();
  const mus = ns.map((n) => mobius(n));
  rec
    .begin({
      zh: ns.map((n, i) => `μ(${n})=${mus[i]}`).join(' '),
      en: ns.map((n, i) => `mu(${n})=${mus[i]}`).join(' '),
    })
    .setBars(mus.map((mu) => ({ value: mu, role: 'final' as BarRole })))
    .commit();
  return rec.build();
}
