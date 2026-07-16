// =============================================================================
// 最早截止时间优先（EDF）· 录制帧序列
// 用 setBars 展示各作业剩余执行时间与截止期，setAux 展示当前运行作业。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { earliestDeadlineFirst, type EdfHooks, type EdfJob } from './impl.ts';

export const DEFAULT_INPUT = {
  jobs: [
    { id: 'J1', arrival: 0, execution: 3, deadline: 5 },
    { id: 'J2', arrival: 0, execution: 2, deadline: 4 },
    { id: 'J3', arrival: 2, execution: 2, deadline: 8 },
  ] as EdfJob[],
};

export function buildTrace(input: { jobs: EdfJob[] } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { jobs } = input;

  const remaining = new Map<string, number>();
  for (const j of jobs) remaining.set(j.id, j.execution);
  const done = new Set<string>();
  let runningId = '';
  let now = 0;

  const snapshot = (note: { zh: string; en: string }): void => {
    const bars = jobs.map((j) => {
      const rem = remaining.get(j.id) ?? 0;
      let role: BarRole = 'default';
      if (done.has(j.id)) role = 'final';
      else if (j.id === runningId) role = 'pivot';
      else if (rem > 0) role = 'frontier';
      return { value: rem, role, label: `${j.id}(rem=${rem},d=${j.deadline})` };
    });
    const aux = [
      { label: '时刻', value: String(now), role: 'pivot' as BarRole },
      {
        label: '运行中',
        value: runningId || '空闲',
        role: (runningId ? 'pivot' : 'default') as BarRole,
      },
      ...jobs.map((j) => ({
        label: `${j.id} 截止期`,
        value: String(j.deadline),
        role: (done.has(j.id) ? 'final' : j.deadline - now <= 1 ? 'warn' : 'default') as BarRole,
      })),
    ];
    rec.begin(note).setBars(bars).setAux(aux).commit();
    runningId = '';
  };

  snapshot({ zh: `共 ${jobs.length} 个作业`, en: `${jobs.length} jobs` });

  const wrappedHooks: EdfHooks = {
    onSchedule: (t, jobId) => {
      now = t;
      runningId = jobId ?? '';
    },
    onComplete: (job, finish, met) => {
      remaining.set(job.id, 0);
      done.add(job.id);
      snapshot({
        zh: `${job.id} 完成（t=${finish}，${met ? '满足' : '错过'}截止期）`,
        en: `${job.id} complete (t=${finish}, ${met ? 'met' : 'missed'} deadline)`,
      });
    },
    onDeadlineMiss: (job, t) => {
      snapshot({ zh: `${job.id} 错过截止期（t=${t}）`, en: `${job.id} deadline missed (t=${t})` });
    },
  };

  // 由于 EDF 按时间步推进，我们在每个调度步骤后录一帧（合并相邻相同作业）
  // 为得到逐段帧，逐时间单位模拟并记录 onSchedule 变化
  const allJobs = [...jobs];
  // 简化：整体跑一次，段级记录
  const result = earliestDeadlineFirst(allJobs, wrappedHooks);

  // 录制每段
  remaining.clear();
  for (const j of jobs) remaining.set(j.id, j.execution);
  done.clear();
  now = 0;
  for (const seg of result.segments) {
    runningId = seg.id;
    now = seg.start;
    snapshot({
      zh: `运行 ${seg.id}：t=${seg.start} → ${seg.finish}`,
      en: `Run ${seg.id}: t=${seg.start} → ${seg.finish}`,
    });
    remaining.set(seg.id, (remaining.get(seg.id) ?? 0) - (seg.finish - seg.start));
    if ((remaining.get(seg.id) ?? 0) === 0) {
      done.add(seg.id);
      snapshot({
        zh: `${seg.id} 完成（t=${seg.finish}）`,
        en: `${seg.id} complete (t=${seg.finish})`,
      });
    }
  }

  // 终态
  rec
    .begin({
      zh: result.allMet
        ? `完成：所有作业满足截止期`
        : `完成：${result.missedCount} 个作业错过截止期`,
      en: result.allMet
        ? `Done: all deadlines met`
        : `Done: ${result.missedCount} deadline(s) missed`,
    })
    .setBars(jobs.map((j) => ({ value: 0, role: 'final' as BarRole, label: `${j.id}(done)` })))
    .setAux([
      { label: '总时长', value: String(result.makespan), role: 'final' as BarRole },
      {
        label: '错过数',
        value: String(result.missedCount),
        role: (result.missedCount === 0 ? 'final' : 'warn') as BarRole,
      },
    ])
    .commit();

  return rec.build();
}
