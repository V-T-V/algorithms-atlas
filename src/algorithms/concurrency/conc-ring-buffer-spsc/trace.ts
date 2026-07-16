import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { simulateSpsc } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'SPSC ring buffer (cap=4)', en: 'SPSC ring buffer (cap=4)' }).commit();
  simulateSpsc(
    4,
    [
      { action: 'produce', value: 1 },
      { action: 'produce', value: 2 },
      { action: 'consume' },
      { action: 'consume' },
    ],
    {
      onProduce: (v, h, t) =>
        rec
          .begin({
            zh: `生产 ${v} (head=${h},tail=${t})`,
            en: `produce ${v} (head=${h},tail=${t})`,
          })
          .setAux([{ label: 'value', value: String(v), role: 'compare' as BarRole }])
          .commit(),
      onConsume: (v, h, t) =>
        rec
          .begin({
            zh: `消费 ${v} (head=${h},tail=${t})`,
            en: `consume ${v} (head=${h},tail=${t})`,
          })
          .setAux([{ label: 'value', value: String(v), role: 'final' as BarRole }])
          .commit(),
    },
  );
  return rec.build();
}
