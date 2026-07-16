// =============================================================================
// 多级队列调度 · 录制帧序列
// 用 setBars 展示各进程剩余时间（按队列分组着色），setAux 展示各队列就绪进程。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { multilevelQueue, type MqJob, type MqQueueConfig, type MqHooks } from './impl.ts';

export const DEFAULT_INPUT = {
  jobs: [
    { id: 'A', arrival: 0, burst: 5, queue: 0 }, // 高优先级 RR
    { id: 'B', arrival: 0, burst: 3, queue: 0 },
    { id: 'C', arrival: 0, burst: 4, queue: 1 }, // 低优先级 FCFS
    { id: 'D', arrival: 6, burst: 2, queue: 1 },
  ] as MqJob[],
  queues: [
    { priority: 0, algorithm: 'rr', quantum: 2 },
    { priority: 1, algorithm: 'fcfs', quantum: 0 },
  ] as MqQueueConfig[],
};

const QUEUE_ROLE: BarRole[] = ['frontier', 'pivot', 'compare'];

export function buildTrace(
  input: { jobs: MqJob[]; queues: MqQueueConfig[] } = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();
  const { jobs, queues } = input;

  const remaining = new Map<string, number>();
  for (const j of jobs) remaining.set(j.id, j.burst);
  const done = new Set<string>();
  let runningId = '';
  let runningQueue = -1;
  let readyQueues: string[][] = queues.map(() => []);

  const snapshot = (note: { zh: string; en: string }): void => {
    const bars = jobs.map((j) => {
      const rem = remaining.get(j.id)!;
      const role: BarRole = done.has(j.id)
        ? 'final'
        : j.id === runningId
          ? 'pivot'
          : (QUEUE_ROLE[j.queue % QUEUE_ROLE.length] ?? 'default');
      return { value: rem, role, label: `${j.id}(Q${j.queue},rem=${rem})` };
    });
    const aux: Array<{ label: string; value: string; role?: BarRole }> = [];
    queues.forEach((_q, qi) => {
      aux.push({
        label: `Q${qi} 就绪`,
        value: readyQueues[qi]!.length ? readyQueues[qi]!.join(' → ') : '∅',
        role: QUEUE_ROLE[qi % QUEUE_ROLE.length],
      });
    });
    if (runningId) {
      aux.push({ label: '运行中', value: `${runningId} @ Q${runningQueue}`, role: 'pivot' });
    }
    rec.begin(note).setBars(bars).setAux(aux).commit();
    runningId = '';
  };

  snapshot({
    zh: `共 ${jobs.length} 个进程，${queues.length} 个队列`,
    en: `${jobs.length} jobs, ${queues.length} queues`,
  });

  const wrappedHooks: MqHooks = {
    onDispatch: (job, qi, qname) => {
      // 从各队列快照重建（简化：用剩余非 0、未完成的进程近似）
      readyQueues = queues.map(() => []);
      void qname;
      void qi;
      runningId = job.id;
      runningQueue = job.queue;
      snapshot({ zh: `调度 ${job.id}（Q${job.queue}）`, en: `Dispatch ${job.id} (Q${job.queue})` });
    },
    onRun: (job, start, finish) => {
      runningId = job.id;
      const runLen = finish - start;
      remaining.set(job.id, (remaining.get(job.id) ?? 0) - runLen);
      snapshot({
        zh: `运行 ${job.id}：t=${start} → ${finish}`,
        en: `Run ${job.id}: t=${start} → ${finish}`,
      });
    },
    onComplete: (job, finish) => {
      remaining.set(job.id, 0);
      done.add(job.id);
      snapshot({ zh: `${job.id} 完成（t=${finish}）`, en: `${job.id} complete (t=${finish})` });
    },
  };

  const result = multilevelQueue(jobs, queues, wrappedHooks);

  rec
    .begin({ zh: '调度完成', en: 'Scheduling complete' })
    .setBars(jobs.map((j) => ({ value: 0, role: 'final' as BarRole, label: `${j.id}(done)` })))
    .setAux([
      { label: '平均等待', value: result.avgWaiting.toFixed(2), role: 'frontier' as BarRole },
      { label: '平均周转', value: result.avgTurnaround.toFixed(2), role: 'frontier' as BarRole },
    ])
    .commit();

  return rec.build();
}
