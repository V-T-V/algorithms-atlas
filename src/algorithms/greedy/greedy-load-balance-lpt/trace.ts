import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { lptSchedule } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const jobs = [8, 7, 6, 5, 4, 3];
  rec
    .begin({ zh: 'LPT: 6 作业 3 机', en: 'LPT: 6 jobs 3 machines' })
    .setBars([0, 0, 0].map(() => ({ value: 0, role: 'default' as BarRole })))
    .commit();
  const r = lptSchedule(jobs, 3, {
    onAssign: (job, mac, load) =>
      rec
        .begin({
          zh: `作业${job} -> 机${mac} (载${load})`,
          en: `job${job} -> m${mac} (load${load})`,
        })
        .setBars(r_loads(r).map((l) => ({ value: l, role: 'pivot' as BarRole })))
        .commit(),
  });
  rec
    .begin({ zh: `makespan ${r.makespan}`, en: `makespan ${r.makespan}` })
    .setBars(
      r.loads.map((l) => ({
        value: l,
        role: l === r.makespan ? ('final' as BarRole) : ('default' as BarRole),
      })),
    )
    .commit();
  return rec.build();
}
function r_loads(r: { loads: number[] }) {
  return r.loads;
}
