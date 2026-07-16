import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { deadlineMonotonic, type DmJob } from './impl.ts';
export const DEFAULT_INPUT: DmJob[] = [
  { id: 'A', period: 10, burst: 2, deadline: 8 },
  { id: 'B', period: 8, burst: 1, deadline: 5 },
  { id: 'C', period: 12, burst: 2, deadline: 10 },
];
export function buildTrace(input: DmJob[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '截止时间单调', en: 'Deadline monotonic' }).commit();
  const out = deadlineMonotonic(input, {
    onAssign: (id, pri) =>
      rec
        .begin({ zh: id + ' P=' + pri, en: id + ' P=' + pri })
        .setBars([{ value: pri, role: 'pivot' as BarRole, label: id }])
        .commit(),
  });
  rec
    .begin({ zh: '完成', en: 'Done' })
    .setBars(out.map((o) => ({ value: o.priority, role: 'final' as BarRole, label: o.id })))
    .commit();
  return rec.build();
}
