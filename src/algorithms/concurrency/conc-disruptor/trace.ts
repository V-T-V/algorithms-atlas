import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { simulateDisruptor } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'Disruptor (cap=4, 2 消费者)', en: 'Disruptor (cap=4, 2 consumers)' }).commit();
  simulateDisruptor(
    4,
    2,
    [
      { thread: 1, action: 'publish', value: 11 },
      { thread: 1, action: 'publish', value: 22 },
      { thread: 1, action: 'publish', value: 33 },
    ],
    {
      onPublish: (t, v, s) =>
        rec
          .begin({
            zh: `生产者 T${t} 发布 ${v} (seq=${s})`,
            en: `producer T${t} publish ${v} (seq=${s})`,
          })
          .setAux([{ label: 'seq', value: String(s), role: 'compare' as BarRole }])
          .commit(),
      onConsume: (c, v) =>
        rec
          .begin({ zh: `消费者 C${c} 收 ${v}`, en: `consumer C${c} got ${v}` })
          .setAux([{ label: 'C' + c, value: String(v), role: 'final' as BarRole }])
          .commit(),
    },
  );
  return rec.build();
}
