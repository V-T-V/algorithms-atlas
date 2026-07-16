import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { simulateEventCount } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec
    .begin({ zh: '事件计数器', en: 'Event count' })
    .setAux([{ label: 'count', value: '0', role: 'compare' as BarRole }])
    .commit();
  simulateEventCount(
    [
      { thread: 0, action: 'await', ticket: 2 },
      { thread: 1, action: 'advance' },
      { thread: 2, action: 'advance' }, // 唤醒 T0
    ],
    {
      onAwait: (t, tk, c) =>
        rec
          .begin({ zh: `T${t} await(${tk}), count=${c}`, en: `T${t} await(${tk}), count=${c}` })
          .setAux([{ label: 'await', value: 'T' + t, role: 'warn' as BarRole }])
          .commit(),
      onAdvance: (t, c, w) =>
        rec
          .begin({ zh: `T${t} advance→${c}, 唤醒${w}`, en: `T${t} advance→${c}, wake ${w}` })
          .setAux([{ label: 'count', value: String(c), role: 'final' as BarRole }])
          .commit(),
      onWake: (t) =>
        rec
          .begin({ zh: `T${t} 被唤醒`, en: `T${t} woken` })
          .setAux([{ label: 'wake', value: 'T' + t, role: 'final' as BarRole }])
          .commit(),
    },
  );
  return rec.build();
}
