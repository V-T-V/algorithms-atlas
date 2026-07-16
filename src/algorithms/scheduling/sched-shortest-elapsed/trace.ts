import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { shortestElapsed, type SetJob } from './impl.ts';

export const DEFAULT_JOBS: SetJob[] = [
  { id: 'A', arrival: 0, burst: 5 },
  { id: 'B', arrival: 0, burst: 5 },
  { id: 'C', arrival: 0, burst: 5 },
];
export const DEFAULT_QUANTUM = 2;

export function buildTrace(opts: { jobs?: SetJob[]; quantum?: number } = {}): Frame[] {
  const jobs = opts.jobs ?? DEFAULT_JOBS;
  const quantum = opts.quantum ?? DEFAULT_QUANTUM;
  const rec = new TraceRecorder();

  rec
    .begin({ zh: `初始化 ${jobs.length} 进程`, en: `Init ${jobs.length} jobs` })
    .setBars(jobs.map((j) => ({ value: j.burst, role: 'default' as BarRole, label: j.id })))
    .setAux([{ label: 'quantum', value: String(quantum), role: 'compare' as BarRole }])
    .commit();

  shortestElapsed(jobs, quantum, {
    onPick: (id, elapsed, time) => {
      rec
        .begin({
          zh: `${id} 被选 elapsed=${elapsed} t=${time}`,
          en: `${id} picked elapsed=${elapsed} t=${time}`,
        })
        .setBars(
          jobs.map((j) => ({
            value: j.burst,
            role: (j.id === id ? 'pivot' : 'default') as BarRole,
            label: j.id,
          })),
        )
        .setAux([{ label: 'elapsed', value: String(elapsed), role: 'compare' as BarRole }])
        .commit();
    },
    onComplete: (id, finish) => {
      rec
        .begin({ zh: `${id} 完成 t=${finish}`, en: `${id} complete t=${finish}` })
        .setBars(
          jobs.map((j) => ({
            value: j.burst,
            role: (j.id === id ? 'sorted' : 'default') as BarRole,
            label: j.id,
          })),
        )
        .setAux([{ label: '完成', value: String(finish), role: 'final' as BarRole }])
        .commit();
    },
  });

  const res = shortestElapsed(jobs, quantum);
  rec
    .begin({
      zh: `完成：平均等待 ${res.avgWaiting.toFixed(1)}`,
      en: `Done: avg wait ${res.avgWaiting.toFixed(1)}`,
    })
    .setAux([{ label: 'avgWait', value: res.avgWaiting.toFixed(1), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
