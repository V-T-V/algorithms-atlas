// =============================================================================
// 任务调度器（冷却期）· 录制帧序列
// 可视化：setAux 展示频次表与公式计算；setArray 渲染各任务频次。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { taskSchedulerCooldown, type TaskSchedulerCooldownHooks } from './impl.ts';

export interface TscInput {
  tasks: string[];
  n: number;
}
export const DEFAULT_INPUT: TscInput = {
  tasks: ['A', 'A', 'A', 'B', 'B', 'B'],
  n: 2,
};

/** 录制演示帧序列。 */
export function buildTrace(input: TscInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { tasks, n } = input;

  rec
    .begin({
      zh: `任务调度器：${tasks.length} 个任务，冷却期 n=${n}`,
      en: `Task Scheduler: ${tasks.length} tasks, cooldown n=${n}`,
    })
    .setArray(
      tasks.map((_, i) => i + 1),
      tasks.map(() => 'default' as BarRole),
      [],
    )
    .setAux([
      { label: '任务序列', value: tasks.join(' '), role: 'default' },
      { label: '冷却期 n', value: String(n), role: 'pivot' },
    ])
    .commit();

  const hooks: TaskSchedulerCooldownHooks = {
    onCount: (freq) => {
      rec
        .begin({ zh: `频次统计完成`, en: `Frequency counted` })
        .setArray(
          freq.map((f) => f.count),
          freq.map(() => 'compare' as BarRole),
          [],
        )
        .setAux(
          freq.map((f) => ({ label: f.task, value: String(f.count), role: 'default' as BarRole })),
        )
        .commit();
    },
    onMax: (maxFreq, maxCount) => {
      const bucket = (maxFreq - 1) * (n + 1) + maxCount;
      rec
        .begin({
          zh: `maxFreq=${maxFreq}, maxCount=${maxCount} → 桶时间=${bucket}`,
          en: `maxFreq=${maxFreq}, maxCount=${maxCount} → bucket=${bucket}`,
        })
        .setAux([
          { label: 'maxFreq', value: String(maxFreq), role: 'pivot' },
          { label: 'maxCount', value: String(maxCount), role: 'pivot' },
          { label: '(maxFreq-1)*(n+1)+maxCount', value: String(bucket), role: 'compare' },
          { label: 'tasks.length', value: String(tasks.length), role: 'compare' },
        ])
        .commit();
    },
  };

  const result = taskSchedulerCooldown(tasks, n, hooks);

  rec
    .begin({
      zh: `完成：最短时间 = max(${tasks.length}, ${(result.maxFreq - 1) * (n + 1) + result.maxCount}) = ${result.minTime}`,
      en: `Done: min time = max(${tasks.length}, ${(result.maxFreq - 1) * (n + 1) + result.maxCount}) = ${result.minTime}`,
    })
    .setAux([
      { label: '最短时间', value: String(result.minTime), role: 'final' },
      { label: 'maxFreq', value: String(result.maxFreq), role: 'default' },
      { label: 'maxCount', value: String(result.maxCount), role: 'default' },
    ])
    .commit();

  return rec.build();
}
