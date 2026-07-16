import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { priorityCeiling, type PcTask, type PcResource, type PcEvent } from './impl.ts';

export const DEFAULT_TASKS: PcTask[] = [
  { id: 'L', basePriority: 1 },
  { id: 'M', basePriority: 5 },
  { id: 'H', basePriority: 9 },
];
export const DEFAULT_RESOURCES: PcResource[] = [
  { id: 'R1', users: ['L', 'H'] }, // ceiling = 9
  { id: 'R2', users: ['M'] }, // ceiling = 5
];
export const DEFAULT_EVENTS: PcEvent[] = [
  { type: 'lock', taskId: 'L', resourceId: 'R1', time: 0 }, // L 升至 9
  { type: 'unlock', taskId: 'L', resourceId: 'R1', time: 2 },
];

export function buildTrace(
  opts: {
    tasks?: PcTask[];
    resources?: PcResource[];
    events?: PcEvent[];
  } = {},
): Frame[] {
  const tasks = opts.tasks ?? DEFAULT_TASKS;
  const resources = opts.resources ?? DEFAULT_RESOURCES;
  const events = opts.events ?? DEFAULT_EVENTS;
  const rec = new TraceRecorder();

  rec
    .begin({
      zh: `初始化 ${tasks.length} 任务 ${resources.length} 资源`,
      en: `Init ${tasks.length} tasks ${resources.length} resources`,
    })
    .setBars(tasks.map((t) => ({ value: t.basePriority, role: 'default' as BarRole, label: t.id })))
    .setAux(
      resources.map((r) => ({ label: `ceil(${r.id})`, value: '?', role: 'compare' as BarRole })),
    )
    .commit();

  const res0 = priorityCeiling(tasks, resources, []);
  rec
    .begin({ zh: '天花板计算', en: 'Ceilings computed' })
    .setAux(
      Object.entries(res0.ceilings).map(([k, v]) => ({
        label: `ceil(${k})`,
        value: String(v),
        role: 'final' as BarRole,
      })),
    )
    .commit();

  priorityCeiling(tasks, resources, events, {
    onEvent: (snap) => {
      rec
        .begin({
          zh: `t=${snap.time} ${snap.taskId} ${snap.type} ${snap.resourceId} ${snap.blocked ? '阻塞' : ''}`,
          en: `t=${snap.time} ${snap.taskId} ${snap.type} ${snap.resourceId} ${snap.blocked ? 'blocked' : ''}`,
        })
        .setBars(
          tasks.map((t) => ({
            value: t.basePriority,
            role: (t.id === snap.taskId ? (snap.blocked ? 'warn' : 'final') : 'default') as BarRole,
            label: t.id,
          })),
        )
        .setAux([
          { label: '天花板', value: String(snap.ceiling), role: 'compare' as BarRole },
          { label: '提升至', value: String(snap.boostedPriority), role: 'final' as BarRole },
        ])
        .commit();
    },
  });

  const res = priorityCeiling(tasks, resources, events);
  rec
    .begin({ zh: `完成：${res.blockCount} 次阻塞`, en: `Done: ${res.blockCount} blocks` })
    .setAux([{ label: '阻塞', value: String(res.blockCount), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
