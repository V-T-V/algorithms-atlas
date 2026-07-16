import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { Reactor } from './impl.ts';
export const DEFAULT_INPUT: any = [
  { fd: 1, data: 'a' },
  { fd: 2, data: 'b' },
  { fd: 1, data: 'c' },
];
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '反应器', en: 'Reactor' }).commit();
  const r = new Reactor();
  r.register(1, (fd, d) =>
    rec
      .begin({ zh: 'fd' + fd + ' <- ' + d, en: 'handle' })
      .setAux([{ label: 'fd', value: String(fd), role: 'compare' as BarRole }])
      .commit(),
  );
  r.register(2, (fd, d) =>
    rec
      .begin({ zh: 'fd' + fd + ' <- ' + d, en: 'handle' })
      .setAux([{ label: 'fd', value: String(fd), role: 'final' as BarRole }])
      .commit(),
  );
  r.fire(input, { onEvent: (fd) => void fd });
  rec
    .begin({ zh: '完成', en: 'done' })
    .setAux([{ label: 'done', value: 'ok', role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
