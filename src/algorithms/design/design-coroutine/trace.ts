import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { CoroutineScheduler } from './impl.ts';

interface TraceInput {
  tasks: Array<[string, number]>;
}
export const DEFAULT_INPUT: TraceInput = {
  tasks: [
    ['A', 3],
    ['B', 2],
    ['C', 4],
  ],
};

export function buildTrace(input: TraceInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const progress = new Map<string, number>();
  const scheduler = new CoroutineScheduler({
    onSchedule: (running, done) =>
      rec
        .begin({
          zh: `调度：运行中 ${running}，已完成 ${done}`,
          en: `Schedule: ${running} running, ${done} done`,
        })
        .setAux([
          { label: '运行中', value: String(running), role: 'pivot' as BarRole },
          { label: '完成', value: String(done), role: 'sorted' as BarRole },
        ])
        .commit(),
    onYield: (task, step, value) => {
      progress.set(task, value);
      const snap = [...progress.entries()].map(([k, v]) => `${k}:${v}`).join(' ');
      rec
        .begin({
          zh: `任务 ${task} 让出，进度=${value}/当前各任务 [${snap}]`,
          en: `Task ${task} yields, progress=${value}`,
        })
        .setAux([
          { label: '任务', value: task, role: 'compare' as BarRole },
          { label: '进度', value: String(value), role: 'frontier' as BarRole },
        ])
        .commit();
    },
    onComplete: (task, totalSteps) =>
      rec
        .begin({
          zh: `任务 ${task} 完成（${totalSteps} 步）`,
          en: `Task ${task} done (${totalSteps} steps)`,
        })
        .setAux([{ label: '完成', value: task, role: 'final' as BarRole }])
        .commit(),
  });
  rec
    .begin({
      zh: `添加 ${input.tasks.length} 个协程任务`,
      en: `Add ${input.tasks.length} coroutine tasks`,
    })
    .setAux([{ label: '任务数', value: String(input.tasks.length), role: 'default' as BarRole }])
    .commit();
  for (const [name, steps] of input.tasks) scheduler.add(name, steps);
  const { completed, totalSteps } = scheduler.run();
  rec
    .begin({
      zh: `全部完成：${completed.join('→')}（总 ${totalSteps} 步）`,
      en: `All done: ${completed.join('→')} (${totalSteps} steps)`,
    })
    .setAux([
      { label: '顺序', value: completed.join('→'), role: 'final' as BarRole },
      { label: '步数', value: String(totalSteps), role: 'sorted' as BarRole },
    ])
    .commit();
  return rec.build();
}
