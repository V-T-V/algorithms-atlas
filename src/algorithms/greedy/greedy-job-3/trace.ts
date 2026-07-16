// 作业调度 · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { greedyJob3, type Job } from './impl.ts';
const JOBS: Job[] = [
  { id: 'a', profit: 100, deadline: 2 },
  { id: 'b', profit: 19, deadline: 1 },
  { id: 'c', profit: 27, deadline: 2 },
  { id: 'd', profit: 25, deadline: 1 },
];
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '作业调度：按利润降序', en: 'Job sequencing: by profit desc' }).commit();
  const r = greedyJob3(JOBS, {
    onSchedule: (j, s) =>
      rec
        .begin({ zh: `安排 ${j.id} 到槽 ${s}`, en: `Schedule ${j.id} at slot ${s}` })
        .setAux([{ label: '利润', value: String(j.profit), role: 'final' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: `总利润 ${r.totalProfit}`, en: `Total profit ${r.totalProfit}` })
    .setBars(
      r.slots.map((s, i) => ({
        value: s ? s.profit : 0,
        role: 'final' as BarRole,
        label: `t${i}`,
      })),
    )
    .commit();
  return rec.build();
}
