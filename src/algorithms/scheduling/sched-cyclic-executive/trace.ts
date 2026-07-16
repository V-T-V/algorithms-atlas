import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { cyclicExecutive, type CeTask } from './impl.ts';

export const DEFAULT_TASKS: CeTask[] = [
  { id: 'T1', period: 2, execution: 1 },
  { id: 'T2', period: 4, execution: 1 },
  { id: 'T3', period: 8, execution: 1 },
];

export function buildTrace(opts: { tasks?: CeTask[] } = {}): Frame[] {
  const tasks = opts.tasks ?? DEFAULT_TASKS;
  const rec = new TraceRecorder();

  rec
    .begin({ zh: `初始化 ${tasks.length} 任务`, en: `Init ${tasks.length} tasks` })
    .setBars(
      tasks.map((t) => ({
        value: t.execution,
        role: 'default' as BarRole,
        label: `${t.id}(P${t.period})`,
      })),
    )
    .setAux([{ label: '规则', value: '静态表驱动', role: 'compare' as BarRole }])
    .commit();

  const res = cyclicExecutive(tasks);
  rec
    .begin({
      zh: `帧长=${res.frameLength} 大循环=${res.majorCycle} ${res.frames.length}帧`,
      en: `frame=${res.frameLength} major=${res.majorCycle} ${res.frames.length} frames`,
    })
    .setAux([
      { label: '帧长', value: String(res.frameLength), role: 'compare' as BarRole },
      { label: '可行', value: res.feasible ? '是' : '否', role: 'final' as BarRole },
    ])
    .commit();

  cyclicExecutive(tasks, {
    onFrame: (index, startTime, ids) => {
      rec
        .begin({
          zh: `帧${index} t=${startTime}: ${ids.join(',') || '空'}`,
          en: `frame${index} t=${startTime}: ${ids.join(',') || 'idle'}`,
        })
        .setBars(
          tasks.map((t) => ({
            value: t.execution,
            role: (ids.includes(t.id) ? 'final' : 'default') as BarRole,
            label: t.id,
          })),
        )
        .setAux([{ label: '负载', value: ids.length.toString(), role: 'compare' as BarRole }])
        .commit();
    },
  });

  rec
    .begin({
      zh: `完成：${res.frames.length} 帧，可行=${res.feasible}`,
      en: `Done: ${res.frames.length} frames, feasible=${res.feasible}`,
    })
    .setAux([{ label: '可行', value: res.feasible ? '是' : '否', role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
