import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { sprt } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const S = [1, 1, 0, 1, 1, 1, 0, 1];
  rec
    .begin({ zh: 'SPRT: H0 p=0.3 vs H1 p=0.6', en: 'SPRT: H0 p=0.3 vs H1 p=0.6' })
    .setAux([
      { label: 'alpha', value: '0.05', role: 'default' as BarRole },
      { label: 'beta', value: '0.05', role: 'default' as BarRole },
    ])
    .commit();
  const r = sprt(S, 0.3, 0.6, 0.05, 0.05, {
    onSample: (n, lr, lo, hi) =>
      rec
        .begin({
          zh: `n=${n} logΛ=${lr.toFixed(2)} 阈[${lo.toFixed(2)},${hi.toFixed(2)}]`,
          en: `n=${n} logΛ=${lr.toFixed(2)} [${lo.toFixed(2)},${hi.toFixed(2)}]`,
        })
        .setBars([
          { value: lr, role: 'pivot' as BarRole, label: 'logΛ' },
          { value: lo, role: 'default' as BarRole },
          { value: hi, role: 'default' as BarRole },
        ])
        .commit(),
    onDecide: (h1, n) =>
      rec
        .begin({
          zh: `${h1 ? '接受 H1' : '接受 H0'} @ n=${n}`,
          en: `${h1 ? 'accept H1' : 'accept H0'} @ n=${n}`,
        })
        .setAux([{ label: '决策', value: h1 ? 'H1' : 'H0', role: 'final' as BarRole }])
        .commit(),
  });
  return rec.build();
}
