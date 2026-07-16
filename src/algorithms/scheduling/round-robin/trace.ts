// =============================================================================
// 轮转调度 · 录制帧序列
// 用 setBars 展示各进程剩余时间（运行中='pivot'，完成='final'），用 setAux 展示就绪队列。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { roundRobin, type Job, type RoundRobinHooks } from './impl.ts';

export type { Job };

export const DEFAULT_INPUT: { jobs: Job[]; quantum: number } = {
  jobs: [
    { id: 'P1', arrival: 0, burst: 5 },
    { id: 'P2', arrival: 0, burst: 3 },
    { id: 'P3', arrival: 0, burst: 1 },
    { id: 'P4', arrival: 0, burst: 4 },
  ],
  quantum: 2,
};

export interface RoundRobinTraceInput {
  jobs: Job[];
  quantum: number;
}

/** 录制演示帧序列。 */
export function buildTrace(input: RoundRobinTraceInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { jobs, quantum } = input;

  // 各进程剩余时间快照
  const remaining = new Map<string, number>();
  for (const j of jobs) remaining.set(j.id, j.burst);
  const done = new Set<string>();
  let runningId = '';
  // 就绪队列（id 序列）
  let readyQueue: string[] = [];

  const snapshot = (note: { zh: string; en: string }): void => {
    // bars：每个进程剩余时间，运行中=pivot，完成=final，就绪=default
    const bars = jobs.map((j) => {
      const rem = remaining.get(j.id)!;
      const role: BarRole = done.has(j.id) ? 'final' : j.id === runningId ? 'pivot' : 'compare';
      return {
        value: rem,
        role,
        label: `${j.id}(rem=${rem})`,
      };
    });

    const aux: Array<{ label: string; value: string; role?: BarRole }> = [
      {
        label: '就绪队列',
        value: readyQueue.length ? readyQueue.join(' → ') : '∅',
        role: 'frontier' as BarRole,
      },
      { label: '时间片 / quantum', value: String(quantum), role: 'pivot' as BarRole },
    ];

    rec.begin(note).setBars(bars).setAux(aux).commit();
    runningId = '';
  };

  snapshot({
    zh: `共 ${jobs.length} 个进程，时间片 quantum=${quantum}`,
    en: `${jobs.length} processes, time quantum=${quantum}`,
  });

  // onRun 在 onDispatch 之后立即触发；
  // dispatch 时记录就绪队列与运行进程，run 时据 start/finish 推算并更新剩余时间。
  const wrappedHooks: RoundRobinHooks = {
    onDispatch: (job, q, rq) => {
      readyQueue = rq.map((j) => j.id);
      runningId = job.id;
      snapshot({
        zh: `调度 ${job.id}（剩余 ${remaining.get(job.id)}），运行 min(${q}, ${remaining.get(job.id)})`,
        en: `Dispatch ${job.id} (remaining ${remaining.get(job.id)}), run min(${q}, ${remaining.get(job.id)})`,
      });
    },
    onRun: (job, start, finish) => {
      runningId = job.id;
      // 推算运行后剩余
      const runLen = finish - start;
      const remBefore = remaining.get(job.id)!;
      const remAfter = remBefore - runLen;
      remaining.set(job.id, remAfter);
      snapshot({
        zh: `运行 ${job.id}：t=${start} → ${finish}（剩余 ${remBefore} → ${remAfter}）`,
        en: `Run ${job.id}: t=${start} → ${finish} (remaining ${remBefore} → ${remAfter})`,
      });
    },
    onRequeue: (job, rem) => {
      // onRun 已更新剩余；这里仅记录入队
      void rem;
      readyQueue = [...readyQueue, job.id];
      snapshot({
        zh: `${job.id} 重新入队尾`,
        en: `${job.id} re-queued at tail`,
      });
    },
    onComplete: (job, finish) => {
      remaining.set(job.id, 0);
      done.add(job.id);
      snapshot({
        zh: `${job.id} 完成（t=${finish}）`,
        en: `${job.id} complete (t=${finish})`,
      });
    },
  };

  const result = roundRobin(jobs, { quantum }, wrappedHooks);

  // 终态
  const bars = jobs.map((j) => ({
    value: 0,
    role: 'final' as BarRole,
    label: `${j.id}(done)`,
  }));
  rec
    .begin({ zh: '调度完成', en: 'Scheduling complete' })
    .setBars(bars)
    .setAux([
      { label: '平均等待', value: result.avgWaiting.toFixed(2), role: 'frontier' as BarRole },
      { label: '平均周转', value: result.avgTurnaround.toFixed(2), role: 'frontier' as BarRole },
    ])
    .commit();

  return rec.build();
}
