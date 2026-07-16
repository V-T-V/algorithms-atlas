import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { simulateCondVar } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '条件变量', en: 'Condition variable' }).commit();
  simulateCondVar(
    [
      { thread: 0, action: 'wait' },
      { thread: 1, action: 'wait' },
      { thread: 2, action: 'signal' },
      { thread: 3, action: 'broadcast' },
    ],
    {
      onWait: (t, w) =>
        rec
          .begin({ zh: `T${t} wait (共${w}等)`, en: `T${t} wait (${w} waiting)` })
          .setAux([{ label: 'waiting', value: String(w), role: 'warn' as BarRole }])
          .commit(),
      onSignal: (s, w) =>
        rec
          .begin({ zh: `T${s} signal → T${w}`, en: `T${s} signal → T${w}` })
          .setAux([{ label: 'wake', value: 'T' + w, role: 'final' as BarRole }])
          .commit(),
      onBroadcast: (s, n) =>
        rec
          .begin({ zh: `T${s} broadcast 唤醒${n}`, en: `T${s} broadcast wake ${n}` })
          .setAux([{ label: 'wake', value: String(n), role: 'final' as BarRole }])
          .commit(),
    },
  );
  return rec.build();
}
