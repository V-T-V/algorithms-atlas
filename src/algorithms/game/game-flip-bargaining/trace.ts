import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { flipBargaining } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '硬币议价: 正面概率 0.5', en: 'Coin bargaining: heads prob 0.5' }).commit();
  // A 给 0.5 (恰好等于 fallback)
  const r = flipBargaining(0.5, 0.5, {
    onOffer: (x, acc) =>
      rec
        .begin({
          zh: `A 给 B ${x}, B ${acc ? '接受' : '拒绝'}`,
          en: `A offers B ${x}, B ${acc ? 'accepts' : 'rejects'}`,
        })
        .setBars([{ value: x, role: 'pivot' as BarRole, label: 'x' }])
        .commit(),
    onOutcome: (a, b) =>
      rec
        .begin({
          zh: `A=${a.toFixed(2)} B=${b.toFixed(2)}`,
          en: `A=${a.toFixed(2)} B=${b.toFixed(2)}`,
        })
        .setBars([
          { value: a, role: 'final' as BarRole, label: 'A' },
          { value: b, role: 'compare' as BarRole, label: 'B' },
        ])
        .commit(),
  });
  void r;
  return rec.build();
}
