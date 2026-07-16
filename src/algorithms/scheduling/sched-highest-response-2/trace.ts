import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { preemptiveHrrn, type Job } from './impl.ts';

export const DEFAULT_JOBS: Job[] = [
  { id: 'A', arrival: 0, burst: 6 },
  { id: 'B', arrival: 2, burst: 3 },
  { id: 'C', arrival: 4, burst: 2 },
];

export function buildTrace(opts: { jobs?: Job[] } = {}): Frame[] {
  const jobs = opts.jobs ?? DEFAULT_JOBS;
  const rec = new TraceRecorder();

  rec
    .begin({ zh: `初始化 ${jobs.length} 进程`, en: `Init ${jobs.length} jobs` })
    .setBars(jobs.map((j) => ({ value: j.burst, role: 'default' as BarRole, label: j.id })))
    .setAux([{ label: '规则', value: 'R=(w+r)/r', role: 'compare' as BarRole }])
    .commit();

  preemptiveHrrn(jobs, {
    onPick: (id, ratio, time) => {
      rec
        .begin({
          zh: `${id} 被选 R=${ratio.toFixed(2)} t=${time}`,
          en: `${id} picked R=${ratio.toFixed(2)} t=${time}`,
        })
        .setBars(
          jobs.map((j) => ({
            value: j.burst,
            role: (j.id === id ? 'pivot' : 'default') as BarRole,
            label: j.id,
          })),
        )
        .setAux([{ label: 'R', value: ratio.toFixed(2), role: 'final' as BarRole }])
        .commit();
    },
    onPreempt: (from, to, time) => {
      rec
        .begin({
          zh: `${from} 被 ${to} 抢占 t=${time}`,
          en: `${from} preempted by ${to} t=${time}`,
        })
        .setBars(
          jobs.map((j) => ({
            value: j.burst,
            role: (j.id === to ? 'final' : j.id === from ? 'warn' : 'default') as BarRole,
            label: j.id,
          })),
        )
        .setAux([{ label: '抢占', value: `${from}→${to}`, role: 'compare' as BarRole }])
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

  const res = preemptiveHrrn(jobs);
  rec
    .begin({
      zh: `完成：平均等待 ${res.avgWaiting.toFixed(1)}`,
      en: `Done: avg wait ${res.avgWaiting.toFixed(1)}`,
    })
    .setAux([{ label: 'avgWait', value: res.avgWaiting.toFixed(1), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
