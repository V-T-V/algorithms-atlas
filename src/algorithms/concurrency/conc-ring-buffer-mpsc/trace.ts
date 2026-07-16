import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { simulateMpsc } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'MPSC ring buffer (cap=4)', en: 'MPSC ring buffer (cap=4)' }).commit();
  simulateMpsc(
    4,
    [
      { thread: 1, action: 'produce', value: 10 },
      { thread: 2, action: 'produce', value: 20 },
      { thread: 0, action: 'consume' },
      { thread: 0, action: 'consume' },
    ],
    {
      onProduce: (t, v) =>
        rec
          .begin({ zh: `生产者 T${t} 入队 ${v}`, en: `producer T${t} enq ${v}` })
          .setAux([{ label: 'value', value: String(v), role: 'compare' as BarRole }])
          .commit(),
      onConsume: (t, v) =>
        rec
          .begin({ zh: `消费者 T${t} 取 ${v}`, en: `consumer T${t} got ${v}` })
          .setAux([{ label: 'value', value: String(v), role: 'final' as BarRole }])
          .commit(),
    },
  );
  return rec.build();
}
