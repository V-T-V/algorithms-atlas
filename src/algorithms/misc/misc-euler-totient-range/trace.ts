import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { eulerTotientRange } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const n = 20;
  rec.begin({ zh: `欧拉函数 1..${n}`, en: `Euler phi 1..${n}` }).commit();
  const phis = eulerTotientRange(n, {
    onConclude: (ps) =>
      rec
        .begin({ zh: ps.join(','), en: ps.join(',') })
        .setBars(ps.map((p) => ({ value: p, role: 'final' as BarRole })))
        .commit(),
  });
  void phis;
  return rec.build();
}
