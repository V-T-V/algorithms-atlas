// =============================================================================
// 速率单调调度 · 录制帧序列
// 用 setBars 展示利用率与甘特图段，用 setAux 展示每个任务的 C/T/优先级与可调度性。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { rateMonotonic, type RmHooks, type Task } from './impl.ts';

export type { Task };

export const DEFAULT_INPUT: Task[] = [
  { id: 'T1', period: 4, execution: 1 },
  { id: 'T2', period: 6, execution: 2 },
  { id: 'T3', period: 8, execution: 1 },
];

/** 录制演示帧序列。 */
export function buildTrace(input: Task[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  // 先算一遍拿到分析数据与最终甘特段
  const full = rateMonotonic(input);

  // 初始帧：任务参数与利用率分析
  rec
    .begin({
      zh: `共 ${input.length} 个周期任务，按「周期越短优先级越高」静态分配优先级`,
      en: `${input.length} periodic tasks; shorter period = higher static priority`,
    })
    .setBars(
      full.tasks.map((t) => ({
        value: t.utilization,
        role: (t.priority === 1 ? 'pivot' : 'compare') as BarRole,
        label: `${t.id}: C=${t.execution}/T=${t.period}`,
      })),
    )
    .setAux([
      { label: '总利用率 U', value: full.utilization.toFixed(4), role: 'frontier' as BarRole },
      { label: 'Liu-Layland 上界', value: full.bound.toFixed(4), role: 'frontier' as BarRole },
      {
        label: '充分可调度',
        value: full.schedulable ? '是' : '否',
        role: (full.schedulable ? 'final' : 'warn') as BarRole,
      },
    ])
    .commit();

  // 逐任务展示优先级
  for (const t of full.tasks) {
    rec
      .begin({
        zh: `${t.id}：周期 ${t.period}，执行 ${t.execution}，利用率 ${t.utilization.toFixed(3)}，优先级 ${t.priority}`,
        en: `${t.id}: period ${t.period}, exec ${t.execution}, utilization ${t.utilization.toFixed(3)}, priority ${t.priority}`,
      })
      .setBars(
        full.tasks.map((x) => ({
          value: x.utilization,
          role: (x.id === t.id ? 'pivot' : 'default') as BarRole,
          label: `${x.id}: C=${x.execution}/T=${x.period}`,
        })),
      )
      .setAux([
        { label: t.id, value: `优先级 ${t.priority}`, role: 'pivot' as BarRole },
        { label: 'C/T', value: `${t.execution}/${t.period}`, role: 'compare' as BarRole },
      ])
      .commit();
  }

  // 仿真：用钩子逐步推进；用「截至 time 已开始的段」渲染甘特图。
  // 由于完整段集在仿真结束后才有，这里维护一个截至当前时刻可见的甘特投影。
  const gantt = full.segments;
  let step = 0;

  const renderGantt = (time: number, taskId: string | null, remaining: number): void => {
    step++;
    // 截至当前 time 已完成或进行中的段（finish ≤ time）
    const visible = gantt.filter((d) => d.finish <= time);
    const bars = visible.map((d) => ({
      value: d.finish - d.start,
      role: 'final' as BarRole,
      label: `${d.id}[${d.start}-${d.finish}]`,
    }));
    if (taskId) {
      bars.push({
        value: 1,
        role: 'swap' as BarRole,
        label: `${taskId}(t=${time})`,
      });
    }
    rec
      .begin({
        zh: `t=${time}：${taskId ? `运行 ${taskId}（剩余 ${remaining}）` : '空闲'}`,
        en: `t=${time}: ${taskId ? `run ${taskId} (remaining ${remaining})` : 'idle'}`,
      })
      .setBars(bars)
      .setAux([
        { label: 'step', value: String(step), role: 'pivot' as BarRole },
        { label: '时间', value: `t = ${time}`, role: 'frontier' as BarRole },
        { label: '运行', value: taskId ?? 'idle', role: 'swap' as BarRole },
      ])
      .commit();
  };

  const hooks: RmHooks = {
    onStep: (time, taskId, remaining) => renderGantt(time, taskId, remaining),
    onDeadlineMiss: (taskId, time) => {
      rec
        .begin({
          zh: `错过截止期：${taskId} 在 t=${time}`,
          en: `Deadline miss: ${taskId} at t=${time}`,
        })
        .setAux([{ label: '错失', value: `${taskId} @ ${time}`, role: 'warn' as BarRole }])
        .commit();
    },
  };

  rateMonotonic(input, hooks);

  // 终态：完整甘特图 + 可调度性结论
  rec
    .begin({
      zh: `仿真完成（[0, ${full.simHorizon}]）：${full.feasible ? '所有作业均按时完成' : '存在截止期错失'}`,
      en: `Simulation done over [0, ${full.simHorizon}]: ${full.feasible ? 'all jobs meet deadlines' : 'deadline misses detected'}`,
    })
    .setBars(
      gantt.map((d) => ({
        value: d.finish - d.start,
        role: 'final' as BarRole,
        label: `${d.id}[${d.start}-${d.finish}]`,
      })),
    )
    .setAux([
      {
        label: '总利用率 U',
        value: full.utilization.toFixed(4),
        role: 'frontier' as BarRole,
      },
      {
        label: 'LL 上界',
        value: full.bound.toFixed(4),
        role: 'frontier' as BarRole,
      },
      {
        label: '充分可调度',
        value: full.schedulable ? '是' : '否',
        role: (full.schedulable ? 'final' : 'warn') as BarRole,
      },
      {
        label: '仿真可行',
        value: full.feasible ? '是' : '否',
        role: (full.feasible ? 'final' : 'warn') as BarRole,
      },
    ])
    .commit();

  return rec.build();
}
