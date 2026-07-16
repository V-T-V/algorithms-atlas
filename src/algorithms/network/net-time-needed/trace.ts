import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { numOfMinutes } from './impl.ts';
export const DEFAULT_INPUT = {
  n: 6,
  headID: 2,
  manager: [2, 2, -1, 2, 2, 2],
  informTime: [0, 0, 1, 0, 0, 0],
};
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '通知所有员工', en: 'Inform all' }).commit();
  const t = numOfMinutes(input.n, input.headID, input.manager, input.informTime, {
    onNode: (v, tt) =>
      rec
        .begin({ zh: '员工 ' + v + ' 时间 ' + tt, en: 'emp ' + v + ' t=' + tt })
        .setAux([{ label: 'time', value: String(tt), role: 'pivot' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: '总时间 = ' + t, en: 'total = ' + t })
    .setAux([{ label: 'total', value: String(t), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
