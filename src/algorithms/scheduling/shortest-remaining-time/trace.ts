// 最短处理时间（非抢占 SPT）· 录制帧序列

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { shortestProcessingTime, type SptHooks, type SptJob } from './impl.ts';

export const DEFAULT_INPUT: SptJob[] = [
  { id: 'P1', arrival: 0, burst: 7 },
  { id: 'P2', arrival: 2, burst: 4 },
  { id: 'P3', arrival: 4, burst: 1 },
  { id: 'P4', arrival: 5, burst: 4 },
];

export function buildTrace(input: SptJob[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const done: Array<{ id: string; start: number; finish: number }> = [];
  let curSeg: { id: string; start: number; finish: number } | null = null;
  let now = 0;
  let readySize = 0;

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
    rec
      .begin(note)
      .setBars(bars)
      .setAux([
        { label: 'time', value: `t=${now}`, role: 'pivot' as BarRole },
        { label: '就绪队列', value: String(readySize), role: 'compare' as BarRole },
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
    zh: `非抢占 SPT：${input.length} 作业`,
    en: `Non-preemptive SPT: ${input.length} jobs`,
  });

  const hooks: SptHooks = {
    onDispatch: (job, time, rs) => {
      now = time;
      readySize = rs;
      curSeg = { id: job.id, start: time, finish: time + job.burst };
      snapshot({
        zh: `选 ${job.id}（burst=${job.burst}），就绪 ${rs} 个`,
        en: `Pick ${job.id} (burst=${job.burst}), ready=${rs}`,
      });
    },
    onComplete: (s) => {
      done.push({ id: s.id, start: s.start, finish: s.completion });
      now = s.completion;
      snapshot({ zh: `${s.id} 完成（等待 ${s.wait}）`, en: `${s.id} done (wait ${s.wait})` });
    },
  };

  const result = shortestProcessingTime(input, hooks);

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
