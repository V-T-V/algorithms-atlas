import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { responseTimeAnalysis, type RtaTask } from './impl.ts';

export const DEFAULT_TASKS: RtaTask[] = [
  { id: 'T1', period: 4, execution: 1, deadline: 4 },
  { id: 'T2', period: 6, execution: 2, deadline: 6 },
  { id: 'T3', period: 8, execution: 1, deadline: 8 },
];

export function buildTrace(opts: { tasks?: RtaTask[] } = {}): Frame[] {
  const tasks = opts.tasks ?? DEFAULT_TASKS;
  const rec = new TraceRecorder();

  const initRes = responseTimeAnalysis(tasks);
  rec
    .begin({
      zh: `初始化 ${tasks.length} 任务 U=${initRes.utilization.toFixed(2)}`,
      en: `Init ${tasks.length} tasks U=${initRes.utilization.toFixed(2)}`,
    })
    .setBars(
      tasks.map((t) => ({
        value: t.execution,
        role: 'default' as BarRole,
        label: `${t.id}(T${t.period})`,
      })),
    )
    .setAux([
      { label: '利用率', value: initRes.utilization.toFixed(2), role: 'compare' as BarRole },
      { label: 'LL界', value: initRes.liuLaylandBound.toFixed(2), role: 'final' as BarRole },
    ])
    .commit();

  responseTimeAnalysis(tasks, {
    onIterate: (taskId, iteration, rt) => {
      rec
        .begin({
          zh: `${taskId} 迭代${iteration}: R=${rt}`,
          en: `${taskId} iter${iteration}: R=${rt}`,
        })
        .setBars(
          tasks.map((t) => ({
            value: t.execution,
            role: (t.id === taskId ? 'pivot' : 'default') as BarRole,
            label: t.id,
          })),
        )
        .setAux([{ label: 'R', value: String(rt), role: 'compare' as BarRole }])
        .commit();
    },
    onTaskDone: (taskId, rt, schedulable) => {
      rec
        .begin({
          zh: `${taskId} 完成 R=${rt} ${schedulable ? '可调度' : '不可调度'}`,
          en: `${taskId} done R=${rt} ${schedulable ? 'schedulable' : 'unschedulable'}`,
        })
        .setBars(
          tasks.map((t) => ({
            value: t.execution,
            role: (t.id === taskId ? (schedulable ? 'sorted' : 'warn') : 'default') as BarRole,
            label: t.id,
          })),
        )
        .setAux([
          { label: 'R', value: String(rt), role: 'final' as BarRole },
          { label: '可调度', value: schedulable ? '是' : '否', role: 'compare' as BarRole },
        ])
        .commit();
    },
  });

  const res = responseTimeAnalysis(tasks);
  rec
    .begin({
      zh: `完成：${res.allSchedulable ? '全部可调度' : '存在不可调度'}`,
      en: `Done: ${res.allSchedulable ? 'all schedulable' : 'some unschedulable'}`,
    })
    .setAux([
      { label: '可调度', value: res.allSchedulable ? '是' : '否', role: 'final' as BarRole },
    ])
    .commit();
  return rec.build();
}
