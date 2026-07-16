// 最小松弛度优先（LLF）· 录制帧序列

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { leastLaxityFirst, type LlfHooks, type LlfTask } from './impl.ts';

export const DEFAULT_INPUT: LlfTask[] = [
  { id: 'T1', period: 8, deadline: 8, execution: 3 },
  { id: 'T2', period: 12, deadline: 12, execution: 3 },
];

export function buildTrace(input: LlfTask[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const done: Array<{ id: string; start: number; finish: number }> = [];
  let curSeg: { id: string; start: number; finish: number } | null = null;
  let curLax: Array<{ id: string; laxity: number }> = [];
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
    for (const l of curLax) {
      aux.push({
        label: `${l.id} lax`,
        value: String(l.laxity),
        role: l.laxity <= 1 ? ('warn' as BarRole) : ('compare' as BarRole),
      });
    }
    rec.begin(note).setBars(bars).setAux(aux).commit();
    curSeg = null;
  };

  snapshot({ zh: `LLF 仿真：${input.length} 任务`, en: `LLF sim: ${input.length} tasks` });

  const hooks: LlfHooks = {
    onStep: (t, lax, picked) => {
      time = t;
      curLax = lax;
      if (picked) curSeg = { id: picked, start: t, finish: t + 1 };
    },
  };

  const result = leastLaxityFirst(input, 24, hooks);
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
    ])
    .commit();

  return rec.build();
}
