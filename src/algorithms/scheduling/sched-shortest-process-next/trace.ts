import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { shortestProcessNext, type SpnJob } from './impl.ts';

export const DEFAULT_JOBS: SpnJob[] = [
  { id: 'A', arrival: 0, burst: 6 },
  { id: 'B', arrival: 1, burst: 2 },
  { id: 'C', arrival: 2, burst: 4 },
];

export function buildTrace(opts: { jobs?: SpnJob[] } = {}): Frame[] {
  const jobs = opts.jobs ?? DEFAULT_JOBS;
  const rec = new TraceRecorder();

  rec
    .begin({ zh: `初始化 ${jobs.length} 进程`, en: `Init ${jobs.length} jobs` })
    .setBars(
      jobs.map((j) => ({
        value: j.burst,
        role: 'default' as BarRole,
        label: `${j.id}(${j.burst})`,
      })),
    )
    .setAux([{ label: '规则', value: '选最短', role: 'compare' as BarRole }])
    .commit();

  shortestProcessNext(jobs, false, {
    onPick: (id, burst, time) => {
      rec
        .begin({
          zh: `${id}(burst=${burst}) 被选 t=${time}`,
          en: `${id}(burst=${burst}) picked t=${time}`,
        })
        .setBars(
          jobs.map((j) => ({
            value: j.burst,
            role: (j.id === id ? 'pivot' : 'default') as BarRole,
            label: `${j.id}(${j.burst})`,
          })),
        )
        .setAux([{ label: '选中', value: id, role: 'final' as BarRole }])
        .commit();
    },
    onComplete: (id, finish) => {
      rec
        .begin({ zh: `${id} 完成 t=${finish}`, en: `${id} complete t=${finish}` })
        .setBars(
          jobs.map((j) => ({
            value: j.burst,
            role: (j.id === id ? 'sorted' : 'default') as BarRole,
            label: `${j.id}`,
          })),
        )
        .setAux([{ label: '完成', value: String(finish), role: 'final' as BarRole }])
        .commit();
    },
  });

  const res = shortestProcessNext(jobs);
  rec
    .begin({
      zh: `完成：平均等待 ${res.avgWaiting.toFixed(1)}`,
      en: `Done: avg wait ${res.avgWaiting.toFixed(1)}`,
    })
    .setAux([{ label: 'avgWait', value: res.avgWaiting.toFixed(1), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
