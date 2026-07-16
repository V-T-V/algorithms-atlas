import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { openLock } from './impl.ts';
export const DEFAULT_INPUT = { deadends: ['0201', '0101', '0102', '1212', '2002'], target: '0202' };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '打开转盘锁 → ' + input.target, en: 'Open lock → ' + input.target }).commit();
  const steps = openLock(input.deadends, input.target, {
    onVisit: (s, d) =>
      rec
        .begin({ zh: s + ' (步 ' + d + ')', en: s + ' (step ' + d + ')' })
        .setAux([{ label: 'step', value: String(d), role: 'pivot' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: '步数 = ' + steps, en: 'steps = ' + steps })
    .setAux([{ label: 'steps', value: String(steps), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
