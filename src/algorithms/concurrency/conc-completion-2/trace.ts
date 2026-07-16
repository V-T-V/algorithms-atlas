import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { simulateCompletion } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '完成锁存器（count=2）', en: 'Completion latch (count=2)' }).commit();
  simulateCompletion(
    2,
    [
      { thread: 0, action: 'await' },
      { thread: 1, action: 'count_down' },
      { thread: 2, action: 'count_down' }, // 完成
    ],
    {
      onAwait: (t, c) =>
        rec
          .begin({ zh: `T${t} await (count=${c})`, en: `T${t} await (count=${c})` })
          .setAux([{ label: 'count', value: String(c), role: 'warn' as BarRole }])
          .commit(),
      onCountDown: (t, c) =>
        rec
          .begin({ zh: `T${t} countdown → ${c}`, en: `T${t} countdown → ${c}` })
          .setAux([{ label: 'count', value: String(c), role: 'compare' as BarRole }])
          .commit(),
      onComplete: (w) =>
        rec
          .begin({ zh: `完成！唤醒 ${w}`, en: `complete! wake ${w}` })
          .setAux([{ label: 'release', value: String(w), role: 'final' as BarRole }])
          .commit(),
    },
  );
  return rec.build();
}
