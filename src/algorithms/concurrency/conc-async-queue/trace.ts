import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { simulateAsyncQueue } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '异步队列', en: 'Async queue' }).commit();
  simulateAsyncQueue(
    [
      { thread: 0, action: 'dequeue' }, // 等待
      { thread: 1, action: 'enqueue', value: 42 }, // 唤醒 T0
      { thread: 2, action: 'enqueue', value: 7 },
      { thread: 3, action: 'dequeue' }, // 立即获得 7
    ],
    {
      onWait: (t) =>
        rec
          .begin({ zh: `T${t} 等待`, en: `T${t} waiting` })
          .setAux([{ label: 'wait', value: 'T' + t, role: 'warn' as BarRole }])
          .commit(),
      onEnqueue: (t, v, s) =>
        rec
          .begin({ zh: `T${t} 入队 ${v} (size=${s})`, en: `T${t} enqueue ${v} (size=${s})` })
          .setAux([{ label: 'value', value: String(v), role: 'compare' as BarRole }])
          .commit(),
      onDequeue: (t, v) =>
        rec
          .begin({ zh: `T${t} 取得 ${v}`, en: `T${t} got ${v}` })
          .setAux([{ label: 'value', value: String(v), role: 'final' as BarRole }])
          .commit(),
    },
  );
  return rec.build();
}
