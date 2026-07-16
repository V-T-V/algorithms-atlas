import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { simulateBinarySem } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec
    .begin({ zh: '二值信号量', en: 'Binary semaphore' })
    .setAux([{ label: 'value', value: '1', role: 'compare' as BarRole }])
    .commit();
  simulateBinarySem(
    [
      { thread: 0, action: 'wait' },
      { thread: 1, action: 'wait' },
      { thread: 0, action: 'signal' },
    ],
    {
      onAcquire: (t) =>
        rec
          .begin({ zh: `T${t} 获得`, en: `T${t} acquire` })
          .setAux([{ label: 'holder', value: 'T' + t, role: 'final' as BarRole }])
          .commit(),
      onBlock: (t) =>
        rec
          .begin({ zh: `T${t} 阻塞`, en: `T${t} blocked` })
          .setAux([{ label: 'block', value: 'T' + t, role: 'warn' as BarRole }])
          .commit(),
    },
  );
  return rec.build();
}
