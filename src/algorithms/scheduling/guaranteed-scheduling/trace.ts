// 保证调度 · 录制帧序列

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { guaranteedScheduling, type GsHooks, type GsProcess } from './impl.ts';

export const DEFAULT_INPUT: GsProcess[] = [
  { id: 'P1', burst: 4 },
  { id: 'P2', burst: 4 },
  { id: 'P3', burst: 4 },
];

export function buildTrace(input: GsProcess[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const done: Array<{ id: string; start: number; finish: number }> = [];
  let curSeg: { id: string; start: number; finish: number } | null = null;
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
        label: `${curSeg.id}[${curSeg.start}-` + `${curSeg.finish}]`,
      });
    }
    rec
      .begin(note)
      .setBars(bars)
      .setAux([
        { label: 'time', value: `t=${time}`, role: 'pivot' as BarRole },
        {
          label: '已调度',
          value: done.map((d) => d.id).join('→') || '∅',
          role: 'frontier' as BarRole,
        },
      ])
      .commit();
    curSeg = null;
  };

  snapshot({
    zh: `保证调度：共 ${input.length} 进程`,
    en: `Guaranteed scheduling: ${input.length} procs`,
  });

  const hooks: GsHooks = {
    onPick: (p, _r, _ac, t) => {
      time = t;
      curSeg = { id: p.id, start: t, finish: t + 1 };
    },
  };

  const result = guaranteedScheduling(input, hooks);
  done.length = 0;
  for (const seg of result.segments)
    done.push({ id: seg.id, start: seg.start, finish: seg.finish });

  rec
    .begin({ zh: `完成`, en: `Done` })
    .setBars(
      done.map((d) => ({
        value: d.finish - d.start,
        role: 'final' as BarRole,
        label: `${d.id}[${d.start}-${d.finish}]`,
      })),
    )
    .setAux([
      { label: '平均等待', value: result.avgWait.toFixed(2), role: 'frontier' as BarRole },
      { label: '平均周转', value: result.avgTurnaround.toFixed(2), role: 'frontier' as BarRole },
    ])
    .commit();

  return rec.build();
}
