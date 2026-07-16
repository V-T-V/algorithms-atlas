import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { mrpValue } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const P = [
    [0.5, 0.5, 0],
    [0, 0.5, 0.5],
    [0, 0, 1],
  ];
  const R = [1, 2, 0];
  rec
    .begin({ zh: 'MRP: 3 状态 γ=0.9', en: 'MRP: 3 states γ=0.9' })
    .setBars(R.map((v) => ({ value: v, role: 'default' as BarRole, label: 'R' })))
    .commit();
  const V = mrpValue(P, R, 0.9, 50, {
    onIter: (k, Vs) =>
      rec
        .begin({ zh: `迭代 ${k}`, en: `iter ${k}` })
        .setBars(Vs.map((v) => ({ value: v, role: 'pivot' as BarRole, label: 'V' })))
        .commit(),
  });
  rec
    .begin({
      zh: `收敛 V=[${V.map((v) => v.toFixed(2)).join(',')}]`,
      en: `converged V=[${V.map((v) => v.toFixed(2)).join(',')}]`,
    })
    .setBars(V.map((v) => ({ value: v, role: 'final' as BarRole })))
    .commit();
  return rec.build();
}
