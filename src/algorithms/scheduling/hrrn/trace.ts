// =============================================================================
// 高响应比优先 · 录制帧序列
// 用 setBars 展示甘特图 + 候选响应比，用 setAux 展示当前候选列表与选中。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { hrrn, responseRatio, type HrrnHooks, type Job } from './impl.ts';

export type { Job };

export const DEFAULT_INPUT: Job[] = [
  { id: 'P1', arrival: 0, burst: 8 },
  { id: 'P2', arrival: 1, burst: 4 },
  { id: 'P3', arrival: 2, burst: 2 },
  { id: 'P4', arrival: 3, burst: 1 },
];

/** 录制演示帧序列。 */
export function buildTrace(input: Job[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const done: Array<{ id: string; start: number; finish: number }> = [];
  let now = 0;
  let current: { id: string; start: number; finish: number } | null = null;

  const snapshot = (
    note: { zh: string; en: string },
    candidates?: Array<{ job: Job; ratio: number }>,
  ): void => {
    // 甘特 bars
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
      { label: 'RR 公式', value: '(wait+burst)/burst', role: 'frontier' as BarRole },
    ];
    if (candidates) {
      candidates.forEach((c, i) => {
        aux.push({
          label: `候选 ${c.job.id}`,
          value: `RR=${c.ratio.toFixed(3)} (w=${now - c.job.arrival}, b=${c.job.burst})`,
          role: (i === 0 ? 'pivot' : 'compare') as BarRole,
        });
      });
    } else if (current) {
      aux.push({ label: '运行中', value: current.id, role: 'swap' as BarRole });
    }

    rec.begin(note).setBars(bars).setAux(aux).commit();
    current = null;
  };

  snapshot({
    zh: `共 ${input.length} 个作业，每次选响应比 (wait+burst)/burst 最高者`,
    en: `${input.length} jobs, pick the one with highest (wait+burst)/burst`,
  });

  const hooks: HrrnHooks = {
    onPick: (job, ratio, candidates) => {
      snapshot(
        {
          zh: `t=${now}：选中 ${job.id}（RR=${ratio.toFixed(3)}，最高）`,
          en: `t=${now}: pick ${job.id} (RR=${ratio.toFixed(3)}, highest)`,
        },
        candidates,
      );
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
      done.push({ id: sj.id, start: sj.start, finish: sj.completion });
      now = sj.completion;
      current = null;
      snapshot({
        zh: `${sj.id} 完成（等待 ${sj.wait}，周转 ${sj.turnaround}）`,
        en: `${sj.id} done (wait ${sj.wait}, turnaround ${sj.turnaround})`,
      });
    },
  };

  const result = hrrn(input, hooks);

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

void responseRatio;
