import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { scheduleCoScheduling, type CoTask } from './impl.ts';

export const DEFAULT_TASKS: CoTask[] = [
  { id: 'a1', group: 'A', burst: 3 },
  { id: 'a2', group: 'A', burst: 2 },
  { id: 'b1', group: 'B', burst: 2 },
  { id: 'b2', group: 'B', burst: 3 },
];
export const DEFAULT_WINDOW = 3;

export function buildTrace(opts: { tasks?: CoTask[]; window?: number } = {}): Frame[] {
  const tasks = opts.tasks ?? DEFAULT_TASKS;
  const window = opts.window ?? DEFAULT_WINDOW;
  const rec = new TraceRecorder();

  rec
    .begin({ zh: `初始化 ${tasks.length} 个进程`, en: `Init ${tasks.length} tasks` })
    .setBars(tasks.map((t) => ({ value: t.burst, role: 'default' as BarRole, label: `${t.id}` })))
    .setAux([{ label: '窗大小', value: String(window), role: 'compare' as BarRole }])
    .commit();

  const snap = (
    note: { zh: string; en: string },
    slot: { groupId: string; time: number; members: string[] },
  ): void => {
    rec
      .begin(note)
      .setBars(
        tasks.map((t) => ({
          value: t.burst,
          role: (slot.members.includes(t.id)
            ? 'final'
            : t.group === slot.groupId
              ? 'pivot'
              : 'default') as BarRole,
          label: `${t.id}`,
        })),
      )
      .setAux([
        { label: '时间', value: String(slot.time), role: 'compare' as BarRole },
        { label: '组', value: slot.groupId, role: 'final' as BarRole },
      ])
      .commit();
  };

  const windows = scheduleCoScheduling(tasks, window, {
    onWindow: (g, time, members) =>
      snap({ zh: `${g} 窗 t=${time}`, en: `${g} window t=${time}` }, { groupId: g, time, members }),
  });

  rec
    .begin({ zh: `完成：${windows.length} 个窗`, en: `Done: ${windows.length} windows` })
    .setAux([{ label: '总窗数', value: String(windows.length), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
