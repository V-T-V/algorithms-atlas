import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { simulateCountingSem } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec
    .begin({ zh: '计数信号量（初值 2）', en: 'Counting semaphore (init 2)' })
    .setAux([{ label: 'count', value: '2', role: 'compare' as BarRole }])
    .commit();
  simulateCountingSem(
    2,
    [
      { thread: 0, action: 'wait' },
      { thread: 1, action: 'wait' },
      { thread: 2, action: 'wait' }, // 阻塞
      { thread: 0, action: 'signal' }, // 唤醒 T2
    ],
    {
      onAcquire: (t, c) =>
        rec
          .begin({ zh: `T${t} 获得（剩${c}）`, en: `T${t} acquire (${c} left)` })
          .setAux([{ label: 'count', value: String(c), role: 'final' as BarRole }])
          .commit(),
      onBlock: (t, w) =>
        rec
          .begin({ zh: `T${t} 阻塞`, en: `T${t} blocked` })
          .setAux([{ label: 'waiters', value: String(w), role: 'warn' as BarRole }])
          .commit(),
      onRelease: (t, c) =>
        rec
          .begin({ zh: `T${t} signal（剩${c}）`, en: `T${t} signal (${c} left)` })
          .setAux([{ label: 'count', value: String(c), role: 'swap' as BarRole }])
          .commit(),
    },
  );
  return rec.build();
}
