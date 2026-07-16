import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { pollardRho } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const n = 8051;
  rec.begin({ zh: `Pollard Rho ${n}`, en: `Pollard Rho ${n}` }).commit();
  const f = pollardRho(n, {
    onFactor: (ff) =>
      rec
        .begin({ zh: `因子 ${ff}`, en: `factor ${ff}` })
        .setBars([{ value: ff, role: 'final' as BarRole }])
        .commit(),
  });
  void f;
  return rec.build();
}
