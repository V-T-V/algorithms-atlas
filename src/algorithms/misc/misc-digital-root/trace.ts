import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { digitalRoot } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const ns = [0, 9, 38, 12345, 999999];
  rec.begin({ zh: '数根', en: 'Digital root' }).commit();
  const roots = ns.map((n) => digitalRoot(n));
  rec
    .begin({
      zh: ns.map((n, i) => `${n}->${roots[i]}`).join(' '),
      en: ns.map((n, i) => `${n}->${roots[i]}`).join(' '),
    })
    .setBars(roots.map((r) => ({ value: r, role: 'final' as BarRole })))
    .commit();
  return rec.build();
}
