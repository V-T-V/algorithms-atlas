// =============================================================================
// 最短作业优先 · 录制帧序列
// 用 setBars 展示甘特图（按完成顺序），用 setAux 展示就绪队列与时间。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { shortestJobFirst, type Job, type SjfHooks } from './impl.ts';

export const DEFAULT_INPUT: Job[] = [
  { id: 'J1', arrival: 0, burst: 8 },
  { id: 'J2', arrival: 1, burst: 4 },
  { id: 'J3', arrival: 2, burst: 2 },
  { id: 'J4', arrival: 3, burst: 1 },
];

/** 录制演示帧序列。 */
export function buildTrace(input: Job[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const done: Array<{ id: string; start: number; finish: number }> = [];
  let now = 0;
  let current: { id: string; start: number; finish: number } | null = null;

  const snapshot = (note: { zh: string; en: string }): void => {
    // 就绪队列
    const ready = input.filter(
      (j) =>
        j.arrival <= now && !done.some((d) => d.id === j.id) && (!current || current.id !== j.id),
    );
    ready.sort((a, b) => a.burst - b.burst || a.arrival - b.arrival || a.id.localeCompare(b.id));

    const readyAux = ready.map((j, i) => ({
      label: `候选 ${i}`,
      value: `${j.id}(burst=${j.burst})`,
      role: (i === 0 ? 'frontier' : 'default') as BarRole,
    }));

    // 甘特：用 bars 展示已完成 + 当前，value=finish-start
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

    readyAux.unshift({
      label: 'time',
      value: `t = ${now}`,
      role: 'pivot' as BarRole,
    });

    rec.begin(note).setBars(bars).setAux(readyAux).commit();
    current = null;
  };

  snapshot({
    zh: `共 ${input.length} 个作业，按「最短执行时间」非抢占调度`,
    en: `${input.length} jobs, non-preemptive scheduling by shortest burst`,
  });

  const hooks: SjfHooks = {
    onPick: (job, ready) => {
      now = Math.max(now, job.arrival);
      snapshot({
        zh: `t=${now}：就绪 ${ready.map((j) => `${j.id}(${j.burst})`).join(', ')}，选最短 ${job.id}（burst=${job.burst}）`,
        en: `t=${now}: ready [${ready.map((j) => `${j.id}(${j.burst})`).join(', ')}], pick shortest ${job.id} (burst=${job.burst})`,
      });
    },
    onSchedule: (job, start) => {
      now = start;
      current = { id: job.id, start, finish: start + job.burst };
      snapshot({
        zh: `调度 ${job.id}：t=${start} → ${start + job.burst}`,
        en: `Schedule ${job.id}: t=${start} → ${start + job.burst}`,
      });
    },
    onComplete: (sj) => {
      done.push({ id: sj.id, start: sj.start, finish: sj.finish });
      now = sj.finish;
      current = null;
      snapshot({
        zh: `${sj.id} 完成（等待 ${sj.waiting}，周转 ${sj.turnaround}）`,
        en: `${sj.id} done (waiting ${sj.waiting}, turnaround ${sj.turnaround})`,
      });
    },
  };

  shortestJobFirst(input, hooks);

  // 终态：平均等待/周转
  const scheduled = shortestJobFirst(input);
  const avgWait = scheduled.reduce((s, j) => s + j.waiting, 0) / scheduled.length;
  const avgTurn = scheduled.reduce((s, j) => s + j.turnaround, 0) / scheduled.length;
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
      { label: '平均等待', value: avgWait.toFixed(2), role: 'frontier' as BarRole },
      { label: '平均周转', value: avgTurn.toFixed(2), role: 'frontier' as BarRole },
    ])
    .commit();

  return rec.build();
}
