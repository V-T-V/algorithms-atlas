// =============================================================================
// 完全公平调度器（CFS）· 录制帧序列
// 用 setBars 展示各任务 vruntime（柱高=vruntime，最小者高亮），setAux 展示就绪队列。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { cfs, type CfsHooks, type CfsOptions, type CfsTask } from './impl.ts';

export const DEFAULT_INPUT: { tasks: CfsTask[]; options: CfsOptions } = {
  tasks: [
    { id: 'A', arrival: 0, burst: 5, nice: 0 },
    { id: 'B', arrival: 0, burst: 5, nice: 0 },
    { id: 'C', arrival: 0, burst: 5, nice: -5 }, // 高权重，vruntime 增长慢，多分 CPU
  ],
  options: { targetLatency: 6, minGranularity: 1 },
};

export function buildTrace(
  input: { tasks: CfsTask[]; options: CfsOptions } = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();
  const { tasks, options } = input;

  const vruntime = new Map<string, number>();
  for (const t of tasks) vruntime.set(t.id, 0);
  const remaining = new Map<string, number>();
  for (const t of tasks) remaining.set(t.id, t.burst);
  const done = new Set<string>();
  let runningId = '';

  const snapshot = (note: { zh: string; en: string }): void => {
    // 柱高 = vruntime（放大显示），最小者高亮
    const minVr = Math.min(
      ...tasks.filter((t) => !done.has(t.id)).map((t) => vruntime.get(t.id) ?? 0),
    );
    const bars = tasks.map((t) => {
      const vr = vruntime.get(t.id) ?? 0;
      let role: BarRole = 'default';
      if (done.has(t.id)) role = 'final';
      else if (t.id === runningId) role = 'pivot';
      else if (vr === minVr) role = 'compare';
      return {
        value: Math.round(vr * 100) / 10,
        role,
        label: `${t.id}(nice=${t.nice ?? 0},vr=${vr.toFixed(1)})`,
      };
    });
    const aux = [
      ...tasks.map((t) => ({
        label: `${t.id} vruntime`,
        value: (vruntime.get(t.id) ?? 0).toFixed(2),
        role: (done.has(t.id) ? 'final' : t.id === runningId ? 'pivot' : 'default') as BarRole,
      })),
      {
        label: '就绪队列',
        value:
          tasks
            .filter((t) => !done.has(t.id))
            .map((t) => t.id)
            .join(',') || '∅',
        role: 'frontier' as BarRole,
      },
    ];
    rec.begin(note).setBars(bars).setAux(aux).commit();
    runningId = '';
  };

  snapshot({ zh: `共 ${tasks.length} 个任务`, en: `${tasks.length} tasks` });

  const wrappedHooks: CfsHooks = {
    onPick: (task) => {
      runningId = task.id;
      snapshot({
        zh: `选 vruntime 最小的 ${task.id} 运行`,
        en: `Pick smallest-vruntime ${task.id}`,
      });
    },
    onRun: (task, start, finish, vr) => {
      runningId = task.id;
      vruntime.set(task.id, vr);
      remaining.set(task.id, (remaining.get(task.id) ?? 0) - (finish - start));
      snapshot({
        zh: `运行 ${task.id}：t=${start} → ${finish}（vruntime=${vr.toFixed(2)}）`,
        en: `Run ${task.id}: t=${start} → ${finish} (vruntime=${vr.toFixed(2)})`,
      });
    },
    onComplete: (task, finish) => {
      remaining.set(task.id, 0);
      done.add(task.id);
      snapshot({ zh: `${task.id} 完成（t=${finish}）`, en: `${task.id} complete (t=${finish})` });
    },
  };

  const result = cfs(tasks, options, wrappedHooks);

  rec
    .begin({ zh: '调度完成', en: 'Scheduling complete' })
    .setBars(
      tasks.map((t) => ({
        value: Math.round((vruntime.get(t.id) ?? 0) * 10),
        role: 'final' as BarRole,
        label: `${t.id}(done,vr=${(vruntime.get(t.id) ?? 0).toFixed(1)})`,
      })),
    )
    .setAux([
      { label: '平均等待', value: result.avgWaiting.toFixed(2), role: 'frontier' as BarRole },
      { label: '平均周转', value: result.avgTurnaround.toFixed(2), role: 'frontier' as BarRole },
    ])
    .commit();

  return rec.build();
}
