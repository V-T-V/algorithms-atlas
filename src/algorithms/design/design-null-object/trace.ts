import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { runWithLogger, NullLogger, type Logger } from './impl.ts';
export const DEFAULT_INPUT: any = { target: 'null', messages: ['a', 'b', 'c'] };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '空对象', en: 'Null Object' }).commit();
  const log: Logger =
    input.target === 'null' ? new NullLogger() : ({ log: (_m: string) => {} } as Logger);
  const n = runWithLogger(log, input.messages, {
    onLog: (t, m) =>
      rec
        .begin({ zh: t + ' <- ' + m, en: 'log' })
        .setAux([
          { label: 'target', value: t, role: 'compare' as BarRole },
          { label: 'msg', value: m, role: 'final' as BarRole },
        ])
        .commit(),
  });
  rec
    .begin({ zh: n + ' 条', en: n + ' msgs' })
    .setAux([{ label: 'count', value: String(n), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
