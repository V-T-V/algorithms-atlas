import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { adaptiveFeedback, type AfJob } from './impl.ts';

export const DEFAULT_JOBS: AfJob[] = [
  { id: 'A', arrival: 0, burst: 8 },
  { id: 'B', arrival: 0, burst: 3 },
  { id: 'C', arrival: 1, burst: 6 },
];
export const DEFAULT_QUANTUM = 2;

export function buildTrace(opts: { jobs?: AfJob[]; baseQuantum?: number } = {}): Frame[] {
  const jobs = opts.jobs ?? DEFAULT_JOBS;
  const baseQuantum = opts.baseQuantum ?? DEFAULT_QUANTUM;
  const rec = new TraceRecorder();

  rec
    .begin({ zh: `初始化 ${jobs.length} 进程`, en: `Init ${jobs.length} jobs` })
    .setBars(jobs.map((j) => ({ value: j.burst, role: 'default' as BarRole, label: j.id })))
    .setAux([{ label: 'baseQ', value: String(baseQuantum), role: 'compare' as BarRole }])
    .commit();

  adaptiveFeedback(jobs, baseQuantum, {
    onDispatch: (id, q) => {
      rec
        .begin({ zh: `${id} 运行 q=${q}`, en: `${id} runs q=${q}` })
        .setBars(
          jobs.map((j) => ({
            value: j.burst,
            role: (j.id === id ? 'pivot' : 'default') as BarRole,
            label: j.id,
          })),
        )
        .setAux([{ label: 'quantum', value: String(q), role: 'compare' as BarRole }])
        .commit();
    },
    onTune: (id, oldQ, newQ) => {
      rec
        .begin({ zh: `${id} 调整 q ${oldQ}→${newQ}`, en: `${id} tuned q ${oldQ}→${newQ}` })
        .setBars(
          jobs.map((j) => ({
            value: j.burst,
            role: (j.id === id ? 'warn' : 'default') as BarRole,
            label: j.id,
          })),
        )
        .setAux([{ label: '新q', value: String(newQ), role: 'final' as BarRole }])
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

  const res = adaptiveFeedback(jobs, baseQuantum);
  rec
    .begin({
      zh: `完成：平均等待 ${res.avgWaiting.toFixed(1)}`,
      en: `Done: avg wait ${res.avgWaiting.toFixed(1)}`,
    })
    .setAux([{ label: 'avgWait', value: res.avgWaiting.toFixed(1), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
