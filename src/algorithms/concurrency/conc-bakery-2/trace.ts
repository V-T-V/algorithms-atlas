import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { simulateBakery } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'Bakery：3 线程取号', en: 'Bakery: 3 threads take tickets' }).commit();
  simulateBakery(
    3,
    [
      { thread: 0, action: 'enter' },
      { thread: 1, action: 'enter' },
      { thread: 2, action: 'enter' },
      { thread: 0, action: 'exit' },
      { thread: 1, action: 'exit' },
      { thread: 2, action: 'exit' },
    ],
    {
      onTicket: (t, tk) =>
        rec
          .begin({ zh: `T${t} 取号 ${tk}`, en: `T${t} ticket ${tk}` })
          .setAux([{ label: 'T' + t, value: String(tk), role: 'compare' as BarRole }])
          .commit(),
      onAcquire: (t) =>
        rec
          .begin({ zh: `T${t} 进入临界区`, en: `T${t} enter CS` })
          .setAux([{ label: 'CS', value: 'T' + t, role: 'final' as BarRole }])
          .commit(),
      onRelease: (t) =>
        rec
          .begin({ zh: `T${t} 退出`, en: `T${t} exit` })
          .setAux([{ label: 'exit', value: 'T' + t, role: 'swap' as BarRole }])
          .commit(),
    },
  );
  return rec.build();
}
