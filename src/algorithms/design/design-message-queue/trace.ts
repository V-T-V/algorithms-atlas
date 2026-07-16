import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { MessageQueue } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const mq = new MessageQueue<string>({
    onEnqueue: (_m, s) =>
      rec
        .begin({ zh: `enqueue size=${s}`, en: '' })
        .setBars(
          Array.from({ length: s }, (_, i) => ({ value: i + 1, role: 'compare' as BarRole })),
        )
        .commit(),
    onDequeue: (_m, s) =>
      rec
        .begin({ zh: `dequeue size=${s}`, en: '' })
        .setBars(Array.from({ length: s }, (_, i) => ({ value: i + 1, role: 'final' as BarRole })))
        .commit(),
  });
  mq.enqueue('A');
  mq.enqueue('B');
  mq.enqueue('C');
  mq.dequeue();
  mq.dequeue();
  return rec.build();
}
