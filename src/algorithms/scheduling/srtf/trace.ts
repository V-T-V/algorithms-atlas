// =============================================================================
// 最短剩余时间优先 · 录制帧序列
// 用 setBars 展示甘特图段 + 进程剩余时间，用 setAux 展示当前调度信息。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { srtf, type Job, type SrtfHooks } from './impl.ts';

export type { Job };

export const DEFAULT_INPUT: Job[] = [
  { id: 'P1', arrival: 0, burst: 7 },
  { id: 'P2', arrival: 2, burst: 4 },
  { id: 'P3', arrival: 4, burst: 1 },
  { id: 'P4', arrival: 5, burst: 4 },
];

/** 录制演示帧序列。 */
export function buildTrace(input: Job[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();

  // 各进程剩余时间
  const remaining = new Map<string, number>();
  for (const j of input) remaining.set(j.id, j.burst);
  const completed = new Set<string>();

  // 甘特段（合并后）
  const done: Array<{ id: string; start: number; finish: number }> = [];
  let now = 0;
  let pickedId = '';

  const snapshot = (note: { zh: string; en: string }): void => {
    // bars：每个进程剩余时间
    const procBars = input.map((j) => {
      const rem = remaining.get(j.id)!;
      const role: BarRole = completed.has(j.id) ? 'final' : j.id === pickedId ? 'pivot' : 'compare';
      return { value: rem, role, label: `${j.id}(rem=${rem})` };
    });

    const aux: Array<{ label: string; value: string; role?: BarRole }> = [
      { label: 'time', value: `t = ${now}`, role: 'pivot' as BarRole },
      {
        label: '已运行段',
        value: done.map((d) => `${d.id}[${d.start}-${d.finish}]`).join(' ') || '∅',
        role: 'frontier' as BarRole,
      },
    ];
    if (pickedId) {
      aux.push({ label: '选中', value: pickedId, role: 'pivot' as BarRole });
    }

    rec.begin(note).setBars(procBars).setAux(aux).commit();
    pickedId = '';
  };

  snapshot({
    zh: `共 ${input.length} 个进程，抢占式最短剩余时间优先`,
    en: `${input.length} processes, preemptive shortest-remaining-time-first`,
  });

  const hooks: SrtfHooks = {
    onPick: (job, rem, time) => {
      now = time;
      pickedId = job.id;
      snapshot({
        zh: `t=${time}：选 ${job.id}（剩余 ${rem}）运行`,
        en: `t=${time}: pick ${job.id} (remaining ${rem}) to run`,
      });
    },
    onComplete: (sj) => {
      remaining.set(sj.id, 0);
      completed.add(sj.id);
      now = sj.completion;
      snapshot({
        zh: `${sj.id} 完成（等待 ${sj.wait}，周转 ${sj.turnaround}）`,
        en: `${sj.id} done (wait ${sj.wait}, turnaround ${sj.turnaround})`,
      });
    },
  };

  const result = srtf(input, hooks);

  // 用合并后的 segments 填充 done 用于终态展示
  done.push(...result.segments);

  // 终态
  rec
    .begin({ zh: '调度完成', en: 'Scheduling complete' })
    .setBars(
      input.map((j) => ({
        value: 0,
        role: 'final' as BarRole,
        label: `${j.id}(done)`,
      })),
    )
    .setAux([
      {
        label: '甘特图',
        value: result.segments.map((s) => `${s.id}[${s.start}-${s.finish}]`).join(' '),
        role: 'final' as BarRole,
      },
      { label: '平均等待', value: result.avgWait.toFixed(2), role: 'frontier' as BarRole },
      { label: '平均周转', value: result.avgTurnaround.toFixed(2), role: 'frontier' as BarRole },
    ])
    .commit();

  return rec.build();
}
