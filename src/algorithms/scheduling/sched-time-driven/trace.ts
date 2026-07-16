import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { timeDriven, type TdTask } from './impl.ts';

export const DEFAULT_TASKS: TdTask[] = [
  { id: 'T1', execution: 2 },
  { id: 'T2', execution: 3 },
  { id: 'T3', execution: 1 },
];
export const DEFAULT_SLOT = 2;
export const DEFAULT_SLOTS = 5;

export function buildTrace(
  opts: { tasks?: TdTask[]; slotLength?: number; slotsPerPeriod?: number } = {},
): Frame[] {
  const tasks = opts.tasks ?? DEFAULT_TASKS;
  const slotLength = opts.slotLength ?? DEFAULT_SLOT;
  const slotsPerPeriod = opts.slotsPerPeriod ?? DEFAULT_SLOTS;
  const rec = new TraceRecorder();

  rec
    .begin({
      zh: `初始化 槽长=${slotLength} 槽数=${slotsPerPeriod}`,
      en: `Init slot=${slotLength} count=${slotsPerPeriod}`,
    })
    .setBars(tasks.map((t) => ({ value: t.execution, role: 'default' as BarRole, label: t.id })))
    .setAux([
      { label: '总容量', value: String(slotLength * slotsPerPeriod), role: 'compare' as BarRole },
    ])
    .commit();

  timeDriven(tasks, slotLength, slotsPerPeriod, {
    onSlot: (index, taskId, used, slack) => {
      rec
        .begin({
          zh: `槽${index}: ${taskId ?? '空闲'} 用${used} 余${slack}`,
          en: `slot${index}: ${taskId ?? 'idle'} used${used} slack${slack}`,
        })
        .setBars(
          tasks.map((t) => ({
            value: t.execution,
            role: (t.id === taskId ? 'final' : 'default') as BarRole,
            label: t.id,
          })),
        )
        .setAux([
          { label: '槽', value: String(index), role: 'compare' as BarRole },
          { label: 'slack', value: String(slack), role: 'final' as BarRole },
        ])
        .commit();
    },
  });

  const res = timeDriven(tasks, slotLength, slotsPerPeriod);
  rec
    .begin({
      zh: `完成：负载${res.totalLoad} slack${res.totalSlack} 可行=${res.feasible}`,
      en: `Done: load${res.totalLoad} slack${res.totalSlack} feasible=${res.feasible}`,
    })
    .setAux([
      { label: '负载', value: String(res.totalLoad), role: 'compare' as BarRole },
      { label: '可行', value: res.feasible ? '是' : '否', role: 'final' as BarRole },
    ])
    .commit();
  return rec.build();
}
