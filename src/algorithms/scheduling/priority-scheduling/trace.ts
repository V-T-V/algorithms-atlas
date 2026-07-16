// =============================================================================
// 优先级调度 · 录制帧序列
// 用 setBars 展示甘特图（按完成顺序），用 setAux 展示就绪队列与优先级。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import {
  priorityScheduling,
  type PriorityJob,
  type PrioritySchedulingHooks,
  type PrioritySchedulingOptions,
} from './impl.ts';

export type { PriorityJob };

export const DEFAULT_INPUT: PriorityJob[] = [
  { id: 'P1', arrival: 0, burst: 4, priority: 2 },
  { id: 'P2', arrival: 1, burst: 3, priority: 1 },
  { id: 'P3', arrival: 2, burst: 1, priority: 4 },
  { id: 'P4', arrival: 3, burst: 2, priority: 3 },
];

export interface PriorityTraceInput {
  jobs: PriorityJob[];
  preemptive?: boolean;
}

/** 录制演示帧序列（默认非抢占式）。 */
export function buildTrace(input: PriorityTraceInput | PriorityJob[] = DEFAULT_INPUT): Frame[] {
  const jobs = Array.isArray(input) ? input : input.jobs;
  const preemptive = Array.isArray(input) ? false : (input.preemptive ?? false);
  const rec = new TraceRecorder();
  const opts: PrioritySchedulingOptions = { preemptive };

  const done: Array<{ id: string; start: number; finish: number }> = [];
  let now = 0;
  let currentSeg: { id: string; start: number; finish: number } | null = null;

  const snapshot = (note: { zh: string; en: string }): void => {
    // 就绪队列（已到达、未完成、非当前运行）
    const ready = jobs.filter(
      (j) =>
        j.arrival <= now &&
        !done.some((d) => d.id === j.id) &&
        (!currentSeg || currentSeg.id !== j.id),
    );
    ready.sort(
      (a, b) => a.priority - b.priority || a.arrival - b.arrival || a.id.localeCompare(b.id),
    );

    const readyAux = ready.map((j, i) => ({
      label: `就绪 ${i}`,
      value: `${j.id}(p=${j.priority}, burst=${j.burst})`,
      role: (i === 0 ? 'frontier' : 'default') as BarRole,
    }));

    // 甘特图：已完成 + 当前运行段
    const bars = done.map((d) => ({
      value: d.finish - d.start,
      role: 'final' as BarRole,
      label: `${d.id}[${d.start}-${d.finish}]`,
    }));
    if (currentSeg) {
      bars.push({
        value: currentSeg.finish - currentSeg.start,
        role: 'swap' as BarRole,
        label: `${currentSeg.id}[${currentSeg.start}-${currentSeg.finish}]`,
      });
    }

    readyAux.unshift({
      label: 'time',
      value: `t = ${now}`,
      role: 'pivot' as BarRole,
    });
    readyAux.unshift({
      label: '模式',
      value: preemptive ? '抢占式 / preemptive' : '非抢占 / non-preemptive',
      role: 'compare' as BarRole,
    });

    rec.begin(note).setBars(bars).setAux(readyAux).commit();
    currentSeg = null;
  };

  snapshot({
    zh: `共 ${jobs.length} 个进程，按优先级${preemptive ? '抢占' : '非抢占'}调度（数值越小优先级越高）`,
    en: `${jobs.length} processes, ${preemptive ? 'preemptive' : 'non-preemptive'} priority scheduling (lower value = higher priority)`,
  });

  const hooks: PrioritySchedulingHooks = {
    onPick: (job, ready) => {
      now = Math.max(now, job.arrival);
      snapshot({
        zh: `t=${now}：就绪 [${ready.map((j) => `${j.id}(p${j.priority})`).join(', ')}]，选最高优先级 ${job.id}（p=${job.priority}）`,
        en: `t=${now}: ready [${ready.map((j) => `${j.id}(p${j.priority})`).join(', ')}], pick highest priority ${job.id} (p=${job.priority})`,
      });
    },
    onSchedule: (job, start, finish) => {
      now = start;
      currentSeg = { id: job.id, start, finish };
      snapshot({
        zh: `运行 ${job.id}：t=${start} → ${finish}`,
        en: `Run ${job.id}: t=${start} → ${finish}`,
      });
    },
    onPreempt: (cur, by, at) => {
      snapshot({
        zh: `t=${at}：${cur.id} 被更高优先级的 ${by.id}（p=${by.priority}）抢占`,
        en: `t=${at}: ${cur.id} preempted by higher-priority ${by.id} (p=${by.priority})`,
      });
    },
    onComplete: (job, finish) => {
      // 将当前段落入 done
      if (currentSeg && currentSeg.id === job.id) {
        done.push(currentSeg);
      } else {
        done.push({ id: job.id, start: finish - job.burst, finish });
      }
      now = finish;
      currentSeg = null;
      snapshot({
        zh: `${job.id} 完成（t=${finish}）`,
        en: `${job.id} complete (t=${finish})`,
      });
    },
  };

  const result = priorityScheduling(jobs, opts, hooks);

  // 终态
  rec
    .begin({ zh: '调度完成', en: 'Scheduling complete' })
    .setBars(
      done.map((d) => ({
        value: d.finish - d.start,
        role: 'final' as BarRole,
        label: `${d.id}[${d.start}-${d.finish}]`,
      })),
    )
    .setAux([
      { label: '执行顺序', value: done.map((d) => d.id).join(' → '), role: 'final' as BarRole },
      { label: '平均等待', value: result.avgWaiting.toFixed(2), role: 'frontier' as BarRole },
      { label: '平均周转', value: result.avgTurnaround.toFixed(2), role: 'frontier' as BarRole },
    ])
    .commit();

  return rec.build();
}
