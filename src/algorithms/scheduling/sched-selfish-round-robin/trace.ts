import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { selfishRoundRobin, type SrrJob } from './impl.ts';

export const DEFAULT_JOBS: SrrJob[] = [
  { id: 'A', arrival: 0, burst: 5 },
  { id: 'B', arrival: 0, burst: 4 },
  { id: 'C', arrival: 1, burst: 3 },
];
export const DEFAULT_QUANTUM = 2;
export const DEFAULT_CAPACITY = 2;

export function buildTrace(
  opts: { jobs?: SrrJob[]; quantum?: number; capacity?: number } = {},
): Frame[] {
  const jobs = opts.jobs ?? DEFAULT_JOBS;
  const quantum = opts.quantum ?? DEFAULT_QUANTUM;
  const capacity = opts.capacity ?? DEFAULT_CAPACITY;
  const rec = new TraceRecorder();

  rec
    .begin({
      zh: `初始化 ${jobs.length} 进程，容量 ${capacity}`,
      en: `Init ${jobs.length} jobs, capacity ${capacity}`,
    })
    .setBars(jobs.map((j) => ({ value: j.burst, role: 'default' as BarRole, label: j.id })))
    .setAux([{ label: 'quantum', value: String(quantum), role: 'compare' as BarRole }])
    .commit();

  selfishRoundRobin(jobs, quantum, capacity, {
    onAdmit: (id) => {
      rec
        .begin({ zh: `${id} 被接纳进池`, en: `${id} admitted to pool` })
        .setBars(
          jobs.map((j) => ({
            value: j.burst,
            role: (j.id === id ? 'final' : 'default') as BarRole,
            label: j.id,
          })),
        )
        .setAux([{ label: '接纳', value: id, role: 'final' as BarRole }])
        .commit();
    },
    onDispatch: (id, poolSize) => {
      rec
        .begin({ zh: `${id} 运行，池大小 ${poolSize}`, en: `${id} runs, pool ${poolSize}` })
        .setBars(
          jobs.map((j) => ({
            value: j.burst,
            role: (j.id === id ? 'pivot' : 'default') as BarRole,
            label: j.id,
          })),
        )
        .setAux([{ label: '池大小', value: String(poolSize), role: 'compare' as BarRole }])
        .commit();
    },
  });

  const res = selfishRoundRobin(jobs, quantum, capacity);
  rec
    .begin({
      zh: `完成：平均等待 ${res.avgWaiting.toFixed(1)}`,
      en: `Done: avg wait ${res.avgWaiting.toFixed(1)}`,
    })
    .setAux([{ label: 'avgWait', value: res.avgWaiting.toFixed(1), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
