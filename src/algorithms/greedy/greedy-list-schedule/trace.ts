import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { listSchedule } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const dur = [3, 5, 2, 8, 4];
  const pri = [1, 2, 0, 3, 1];
  rec.begin({ zh: '列表调度 m=2', en: 'List scheduling m=2' }).commit();
  const r = listSchedule(dur, pri, 2, {
    onAssign: (t, mi) =>
      rec
        .begin({ zh: `任务${t} -> 机${mi}`, en: `task${t} -> m${mi}` })
        .setBars(r_loads(r).map((l) => ({ value: l, role: 'pivot' as BarRole })))
        .commit(),
  });
  rec
    .begin({ zh: `makespan ${r.makespan}`, en: `makespan ${r.makespan}` })
    .setBars(r.loads.map((l) => ({ value: l, role: 'final' as BarRole })))
    .commit();
  return rec.build();
}
function r_loads(r: { loads: number[] }) {
  return r.loads;
}
