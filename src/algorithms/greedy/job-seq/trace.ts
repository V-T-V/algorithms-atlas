// 作业调度 · 录制帧序列

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { jobSeq, type Job, type JobSeqHooks } from './impl.ts';

export interface JsInput {
  jobs: Job[];
}

export const DEFAULT_INPUT: JsInput = {
  jobs: [
    { id: 'A', deadline: 4, profit: 20 },
    { id: 'B', deadline: 1, profit: 10 },
    { id: 'C', deadline: 1, profit: 40 },
    { id: 'D', deadline: 1, profit: 30 },
  ],
};

/** 录制演示帧序列。 */
export function buildTrace(input: JsInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { jobs } = input;

  rec
    .begin({ zh: `${jobs.length} 个作业`, en: `${jobs.length} jobs` })
    .setBars(jobs.map((j) => ({ value: j.profit, role: 'default' as BarRole })))
    .commit();

  const hooks: JobSeqHooks = {
    onSort: () => {
      rec
        .begin({ zh: `按利润降序排序`, en: `Sort by profit desc` })
        .setBars(jobs.map((j) => ({ value: j.profit, role: 'pivot' as BarRole })))
        .commit();
    },
    onSchedule: (jobIdx, slot) => {
      rec
        .begin({
          zh: `${jobs[jobIdx]!.id} 安排到时间槽 ${slot}`,
          en: `${jobs[jobIdx]!.id} scheduled at slot ${slot}`,
        })
        .setBars(
          jobs.map((_, i) => ({
            value: jobs[i]!.profit,
            role: (i === jobIdx ? 'final' : 'default') as BarRole,
          })),
        )
        .commit();
    },
  };
  const { profit, slots } = jobSeq(jobs, hooks);

  rec
    .begin({ zh: `完成：总利润 ${profit}`, en: `Done: profit ${profit}` })
    .setMap(
      slots.map((idx, s) => ({
        key: `slot ${s}`,
        value: idx === -1 ? '-' : jobs[idx]!.id,
        role: 'final' as BarRole,
      })),
    )
    .commit();

  return rec.build();
}
