import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { bayesianNash } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'BNE: 一阶拍卖 n=2', en: 'BNE: first-price auction n=2' }).commit();
  bayesianNash(2, [0.2, 0.4, 0.6, 0.8], {
    onValue: (v, b, ep) =>
      rec
        .begin({
          zh: `v=${v.toFixed(2)} 报价${b.toFixed(2)} 期望${ep.toFixed(3)}`,
          en: `v=${v.toFixed(2)} bid${b.toFixed(2)} exp${ep.toFixed(3)}`,
        })
        .setBars([
          { value: b, role: 'pivot' as BarRole, label: 'bid' },
          { value: ep, role: 'final' as BarRole, label: 'EP' },
        ])
        .commit(),
  });
  return rec.build();
}
