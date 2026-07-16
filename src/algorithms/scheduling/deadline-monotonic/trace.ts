// 截止单调调度（DM）· 录制帧序列

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { deadlineMonotonic, type DmHooks, type DmTask } from './impl.ts';

export const DEFAULT_INPUT: DmTask[] = [
  { id: 'T1', period: 6, deadline: 4, execution: 2 },
  { id: 'T2', period: 10, deadline: 8, execution: 3 },
  { id: 'T3', period: 18, deadline: 12, execution: 3 },
];

export function buildTrace(input: DmTask[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const done: Array<{ id: string; start: number; finish: number }> = [];
  let curSeg: { id: string; start: number; finish: number } | null = null;
  let missInfo = '';
  let time = 0;

  const snapshot = (note: { zh: string; en: string }): void => {
    const bars = done.map((d) => ({
      value: d.finish - d.start,
      role: 'final' as BarRole,
      label: `${d.id}[${d.start}-${d.finish}]`,
    }));
    if (curSeg) {
      bars.push({
        value: curSeg.finish - curSeg.start,
        role: 'swap' as BarRole,
        label: `${curSeg.id}[${curSeg.start}-${curSeg.finish}]`,
      });
    }
    const aux: Array<{ label: string; value: string; role?: BarRole }> = [
      { label: 'time', value: `t=${time}`, role: 'pivot' as BarRole },
    ];
    if (missInfo) aux.push({ label: '错过', value: missInfo, role: 'warn' as BarRole });
    rec.begin(note).setBars(bars).setAux(aux).commit();
    curSeg = null;
    missInfo = '';
  };

  snapshot({ zh: `DM 仿真：${input.length} 任务`, en: `DM sim: ${input.length} tasks` });

  const hooks: DmHooks = {
    onStep: (t, id) => {
      time = t;
      if (id) curSeg = { id, start: t, finish: t + 1 };
    },
    onDeadlineMiss: (id, t) => {
      missInfo = `${id} @t=${t}`;
    },
  };

  const result = deadlineMonotonic(input, 20, hooks);
  done.length = 0;
  for (const seg of result.segments)
    done.push({ id: seg.id, start: seg.start, finish: seg.finish });

  rec
    .begin({ zh: `仿真结束`, en: `Sim ended` })
    .setBars(
      done.map((d) => ({
        value: d.finish - d.start,
        role: 'final' as BarRole,
        label: `${d.id}[${d.start}-${d.finish}]`,
      })),
    )
    .setAux([
      {
        label: '可行',
        value: String(result.feasible),
        role: result.feasible ? 'final' : ('warn' as BarRole),
      },
      { label: '错过次数', value: String(result.deadlineMisses), role: 'compare' as BarRole },
      { label: '仿真时长', value: String(result.simHorizon), role: 'frontier' as BarRole },
    ])
    .commit();

  return rec.build();
}
