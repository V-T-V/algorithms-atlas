// =============================================================================
// 多级反馈队列（MLFQ）· 录制帧序列
// 用 setBars 展示各进程剩余时间（颜色随层级），setAux 展示各层就绪队列。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { mlfq, type MlfqHooks, type MlfqJob, type MlfqOptions } from './impl.ts';

export const DEFAULT_INPUT: { jobs: MlfqJob[]; options: MlfqOptions } = {
  jobs: [
    { id: 'A', arrival: 0, burst: 7 }, // 长任务，会逐层降级
    { id: 'B', arrival: 0, burst: 3 }, // 中等
    { id: 'C', arrival: 0, burst: 1 }, // 短任务，很快在高优先级完成
  ],
  options: {
    levels: [{ quantum: 2 }, { quantum: 4 }, { quantum: 8 }],
    boostInterval: 0,
  },
};

const LEVEL_ROLE: BarRole[] = ['pivot', 'frontier', 'compare'];

export function buildTrace(
  input: { jobs: MlfqJob[]; options: MlfqOptions } = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();
  const { jobs, options } = input;
  const nLevels = options.levels.length;

  const remaining = new Map<string, number>();
  for (const j of jobs) remaining.set(j.id, j.burst);
  const done = new Set<string>();
  let runningId = '';
  let runningLevel = 0;
  let readyQueues: string[][] = options.levels.map(() => []);

  const snapshot = (note: { zh: string; en: string }): void => {
    const bars = jobs.map((j) => {
      const rem = remaining.get(j.id)!;
      // 颜色按层级近似：用完成的标记
      const role: BarRole = done.has(j.id) ? 'final' : j.id === runningId ? 'pivot' : 'default';
      return { value: rem, role, label: `${j.id}(rem=${rem})` };
    });
    const aux: Array<{ label: string; value: string; role?: BarRole }> = [];
    for (let lv = 0; lv < nLevels; lv++) {
      aux.push({
        label: `Q${lv} (q=${options.levels[lv]!.quantum})`,
        value: readyQueues[lv]!.length ? readyQueues[lv]!.join(' → ') : '∅',
        role: lv === runningLevel ? 'pivot' : LEVEL_ROLE[lv % LEVEL_ROLE.length],
      });
    }
    if (runningId) {
      aux.push({ label: '运行中', value: `${runningId} @ L${runningLevel}`, role: 'pivot' });
    }
    rec.begin(note).setBars(bars).setAux(aux).commit();
    runningId = '';
  };

  snapshot({
    zh: `共 ${jobs.length} 个进程，${nLevels} 层`,
    en: `${jobs.length} jobs, ${nLevels} levels`,
  });

  const wrappedHooks: MlfqHooks = {
    onDispatch: (job, lv, q) => {
      void q;
      runningId = job.id;
      runningLevel = lv;
      // 简化：readyQueues 无法精确重建，留作近似
      readyQueues = options.levels.map(() => []);
      snapshot({ zh: `调度 ${job.id} @ L${lv}`, en: `Dispatch ${job.id} @ L${lv}` });
    },
    onRun: (job, lv, start, finish) => {
      runningId = job.id;
      runningLevel = lv;
      const runLen = finish - start;
      remaining.set(job.id, (remaining.get(job.id) ?? 0) - runLen);
      snapshot({
        zh: `运行 ${job.id} @ L${lv}：t=${start} → ${finish}`,
        en: `Run ${job.id} @ L${lv}: t=${start} → ${finish}`,
      });
    },
    onDemote: (job, from, to) => {
      snapshot({
        zh: `${job.id} 用完时间片，L${from} → L${to}`,
        en: `${job.id} demoted L${from} → L${to}`,
      });
    },
    onBoost: (t) => {
      snapshot({ zh: `周期提升（t=${t}）`, en: `Priority boost (t=${t})` });
    },
    onComplete: (job, finish) => {
      remaining.set(job.id, 0);
      done.add(job.id);
      snapshot({ zh: `${job.id} 完成（t=${finish}）`, en: `${job.id} complete (t=${finish})` });
    },
  };

  const result = mlfq(jobs, options, wrappedHooks);

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
