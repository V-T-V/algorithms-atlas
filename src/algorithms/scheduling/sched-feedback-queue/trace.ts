import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { multilevelFeedbackQueue, type MlfqJob } from './impl.ts';

export const DEFAULT_JOBS: MlfqJob[] = [
  { id: 'A', arrival: 0, burst: 8 },
  { id: 'B', arrival: 0, burst: 3 },
  { id: 'C', arrival: 2, burst: 5 },
];

export function buildTrace(
  opts: { jobs?: MlfqJob[]; levels?: number; baseQuantum?: number } = {},
): Frame[] {
  const jobs = opts.jobs ?? DEFAULT_JOBS;
  const levels = opts.levels ?? 3;
  const baseQuantum = opts.baseQuantum ?? 2;
  const rec = new TraceRecorder();

  rec
    .begin({
      zh: `初始化 ${jobs.length} 进程，${levels} 级队列`,
      en: `Init ${jobs.length} jobs, ${levels} levels`,
    })
    .setBars(jobs.map((j) => ({ value: j.burst, role: 'default' as BarRole, label: j.id })))
    .setAux([{ label: 'baseQ', value: String(baseQuantum), role: 'compare' as BarRole }])
    .commit();

  multilevelFeedbackQueue(jobs, levels, baseQuantum, 100, {
    onDispatch: (id, level, q) => {
      rec
        .begin({ zh: `${id} 在 L${level} 运行 q=${q}`, en: `${id} runs at L${level} q=${q}` })
        .setBars(
          jobs.map((j) => ({
            value: j.burst,
            role: (j.id === id ? 'pivot' : 'default') as BarRole,
            label: j.id,
          })),
        )
        .setAux([
          { label: '层级', value: String(level), role: 'compare' as BarRole },
          { label: 'quantum', value: String(q), role: 'final' as BarRole },
        ])
        .commit();
    },
    onDemote: (id, from, to) => {
      rec
        .begin({ zh: `${id} 降级 L${from}→L${to}`, en: `${id} demoted L${from}→L${to}` })
        .setBars(
          jobs.map((j) => ({
            value: j.burst,
            role: (j.id === id ? 'warn' : 'default') as BarRole,
            label: j.id,
          })),
        )
        .setAux([{ label: '降级至', value: String(to), role: 'final' as BarRole }])
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

  const res = multilevelFeedbackQueue(jobs, levels, baseQuantum, 100);
  rec
    .begin({
      zh: `完成：平均等待 ${res.avgWaiting.toFixed(1)}`,
      en: `Done: avg wait ${res.avgWaiting.toFixed(1)}`,
    })
    .setAux([{ label: 'avgWait', value: res.avgWaiting.toFixed(1), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
