import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { periodicEdf, type EdfTask } from './impl.ts';

export const DEFAULT_TASKS: EdfTask[] = [
  { id: 'T1', period: 4, execution: 1, deadline: 4 },
  { id: 'T2', period: 6, execution: 2, deadline: 6 },
];

export function buildTrace(opts: { tasks?: EdfTask[]; horizon?: number } = {}): Frame[] {
  const tasks = opts.tasks ?? DEFAULT_TASKS;
  const horizon = opts.horizon ?? 12;
  const rec = new TraceRecorder();

  const util = tasks.reduce((s, t) => s + t.execution / t.period, 0);
  rec
    .begin({
      zh: `初始化 ${tasks.length} 任务 U=${util.toFixed(2)}`,
      en: `Init ${tasks.length} tasks U=${util.toFixed(2)}`,
    })
    .setBars(
      tasks.map((t) => ({ value: t.execution, role: 'default' as BarRole, label: `${t.id}` })),
    )
    .setAux([{ label: '利用率', value: util.toFixed(2), role: 'compare' as BarRole }])
    .commit();

  periodicEdf(tasks, horizon, {
    onStep: (time, taskId) => {
      if (taskId === null) return;
      rec
        .begin({ zh: `t=${time} 运行 ${taskId}`, en: `t=${time} run ${taskId}` })
        .setBars(
          tasks.map((t) => ({
            value: t.execution,
            role: (t.id === taskId ? 'pivot' : 'default') as BarRole,
            label: t.id,
          })),
        )
        .setAux([{ label: '时间', value: String(time), role: 'compare' as BarRole }])
        .commit();
    },
    onComplete: (taskId, jobNo, finish) => {
      rec
        .begin({
          zh: `${taskId}#${jobNo} 完成 t=${finish}`,
          en: `${taskId}#${jobNo} complete t=${finish}`,
        })
        .setBars(
          tasks.map((t) => ({
            value: t.execution,
            role: (t.id === taskId ? 'sorted' : 'default') as BarRole,
            label: t.id,
          })),
        )
        .setAux([{ label: '作业', value: `${taskId}#${jobNo}`, role: 'final' as BarRole }])
        .commit();
    },
    onDeadlineMiss: (taskId, jobNo, dl) => {
      rec
        .begin({
          zh: `${taskId}#${jobNo} 错过截止期 ${dl}`,
          en: `${taskId}#${jobNo} missed deadline ${dl}`,
        })
        .setBars(
          tasks.map((t) => ({
            value: t.execution,
            role: (t.id === taskId ? 'warn' : 'default') as BarRole,
            label: t.id,
          })),
        )
        .setAux([{ label: '错过', value: `${taskId}#${jobNo}`, role: 'final' as BarRole }])
        .commit();
    },
  });

  const res = periodicEdf(tasks, horizon);
  rec
    .begin({ zh: `完成：${res.deadlineMisses} 次错过`, en: `Done: ${res.deadlineMisses} misses` })
    .setAux([
      { label: '可行', value: res.feasible ? '是' : '否', role: 'final' as BarRole },
      { label: '错过', value: String(res.deadlineMisses), role: 'compare' as BarRole },
    ])
    .commit();
  return rec.build();
}
