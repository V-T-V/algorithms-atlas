// 任务调度器 · 录制帧序列

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { taskScheduler, type TaskSchedulerHooks } from './impl.ts';

export interface TsInput {
  tasks: string[];
  n: number;
}

export const DEFAULT_INPUT: TsInput = { tasks: ['A', 'A', 'A', 'B', 'B', 'B'], n: 2 };

/** 录制演示帧序列。 */
export function buildTrace(input: TsInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { tasks, n } = input;

  const freq = new Map<string, number>();
  for (const t of tasks) freq.set(t, (freq.get(t) ?? 0) + 1);
  const entries = [...freq.entries()].sort((a, b) => b[1] - a[1]);

  rec
    .begin({
      zh: `任务 ${tasks.join('')}，冷却 ${n}`,
      en: `Tasks ${tasks.join('')}, cooldown ${n}`,
    })
    .setBars(entries.map((e) => ({ value: e[1], role: 'pivot' as BarRole })))
    .commit();

  const hooks: TaskSchedulerHooks = {
    onResult: () => {
      void 0;
    },
  };
  const { total } = taskScheduler(tasks, n, hooks);

  rec
    .begin({ zh: `完成：最少时间片 ${total}`, en: `Done: ${total} slots` })
    .setMap([
      { key: '最高频', value: String(entries[0]?.[1] ?? 0), role: 'pivot' as BarRole },
      { key: '冷却 n', value: String(n), role: 'default' as BarRole },
      { key: '总时间', value: String(total), role: 'final' as BarRole },
    ])
    .commit();

  return rec.build();
}
