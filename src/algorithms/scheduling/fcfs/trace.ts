// =============================================================================
// 先来先服务 · 录制帧序列
// 用 setBars 展示甘特图（每段是一个 bar，label=进程id[t1-t2]），用 setAux 展示当前调度信息。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { fcfs, type FcfsHooks, type Job } from './impl.ts';

export type { Job };

export const DEFAULT_INPUT: Job[] = [
  { id: 'P1', arrival: 0, burst: 6 },
  { id: 'P2', arrival: 1, burst: 4 },
  { id: 'P3', arrival: 2, burst: 2 },
  { id: 'P4', arrival: 3, burst: 5 },
];

/** 录制演示帧序列。 */
export function buildTrace(input: Job[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  // 已完成的甘特段
  const done: Array<{ id: string; start: number; finish: number }> = [];
  let current: { id: string; start: number; finish: number } | null = null;
  let now = 0;

  const snapshot = (note: { zh: string; en: string }): void => {
    const bars = done.map((d) => ({
      value: d.finish - d.start,
      role: 'final' as BarRole,
      label: `${d.id}[${d.start}-${d.finish}]`,
    }));
    if (current) {
      bars.push({
        value: current.finish - current.start,
        role: 'swap' as BarRole,
        label: `${current.id}[${current.start}-${current.finish}]`,
      });
    }

    const aux: Array<{ label: string; value: string; role?: BarRole }> = [
      { label: 'time', value: `t = ${now}`, role: 'pivot' as BarRole },
      {
        label: '已调度',
        value: done.map((d) => d.id).join(' → ') || '∅',
        role: 'frontier' as BarRole,
      },
    ];
    if (current) {
      aux.push({ label: '运行中', value: current.id, role: 'swap' as BarRole });
    }

    rec.begin(note).setBars(bars).setAux(aux).commit();
    current = null;
  };

  const order = [...input].sort((a, b) => a.arrival - b.arrival || a.id.localeCompare(b.id));
  snapshot({
    zh: `共 ${input.length} 个进程，按到达顺序依次执行：${order.map((j) => j.id).join(' → ')}`,
    en: `${input.length} processes, run in arrival order: ${order.map((j) => j.id).join(' → ')}`,
  });

  const hooks: FcfsHooks = {
    onDispatch: (job, startTime) => {
      now = startTime;
      current = { id: job.id, start: startTime, finish: startTime + job.burst };
      snapshot({
        zh: `调度 ${job.id}：t=${startTime} → ${startTime + job.burst}（到达 ${job.arrival}，执行 ${job.burst}）`,
        en: `Dispatch ${job.id}: t=${startTime} → ${startTime + job.burst} (arrival ${job.arrival}, burst ${job.burst})`,
      });
    },
    onComplete: (sj) => {
      done.push({ id: sj.id, start: sj.start, finish: sj.completion });
      now = sj.completion;
      current = null;
      snapshot({
        zh: `${sj.id} 完成（等待 ${sj.wait}，周转 ${sj.turnaround}）`,
        en: `${sj.id} done (wait ${sj.wait}, turnaround ${sj.turnaround})`,
      });
    },
  };

  const result = fcfs(input, hooks);

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
      { label: '顺序', value: done.map((d) => d.id).join(' → '), role: 'final' as BarRole },
      { label: '平均等待', value: result.avgWait.toFixed(2), role: 'frontier' as BarRole },
      { label: '平均周转', value: result.avgTurnaround.toFixed(2), role: 'frontier' as BarRole },
    ])
    .commit();

  return rec.build();
}
