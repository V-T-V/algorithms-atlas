import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { strideScheduling, type StrideTask } from './impl.ts';

export const DEFAULT_TASKS: StrideTask[] = [
  { id: 'A', weight: 3, tickets: 6 },
  { id: 'B', weight: 1, tickets: 2 },
  { id: 'C', weight: 2, tickets: 4 },
];

export function buildTrace(opts: { tasks?: StrideTask[] } = {}): Frame[] {
  const tasks = opts.tasks ?? DEFAULT_TASKS;
  const rec = new TraceRecorder();

  rec
    .begin({ zh: `初始化 ${tasks.length} 个进程`, en: `Init ${tasks.length} tasks` })
    .setBars(
      tasks.map((t) => ({
        value: t.weight,
        role: 'default' as BarRole,
        label: `${t.id}:w${t.weight}`,
      })),
    )
    .setAux([{ label: '说明', value: 'stride=L/weight', role: 'compare' as BarRole }])
    .commit();

  const res = strideScheduling(tasks, {
    onPick: (id, pass) => {
      rec
        .begin({
          zh: `选中 ${id} pass=${pass.toFixed(0)}`,
          en: `Pick ${id} pass=${pass.toFixed(0)}`,
        })
        .setBars(
          tasks.map((t) => ({
            value: t.weight,
            role: (t.id === id ? 'final' : 'default') as BarRole,
            label: `${t.id}`,
          })),
        )
        .setAux([{ label: '选中', value: id, role: 'final' as BarRole }])
        .commit();
    },
  });

  rec
    .begin({ zh: `完成：${res.order.length} 步`, en: `Done: ${res.order.length} steps` })
    .setAux(
      Object.entries(res.allocation).map(([k, v]) => ({
        label: k,
        value: String(v),
        role: 'final' as BarRole,
      })),
    )
    .commit();
  return rec.build();
}
