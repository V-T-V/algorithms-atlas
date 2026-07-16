// =============================================================================
// Moore-Hodgson · 录制帧序列
// 用 setBars 展示按时集合（绿）与延迟集合（红）的处理时间，setAux 展示统计。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { mooreHodgson, type MhHooks, type MhJob } from './impl.ts';

export const DEFAULT_INPUT: MhJob[] = [
  { id: 'A', processing: 3, deadline: 4 },
  { id: 'B', processing: 2, deadline: 6 },
  { id: 'C', processing: 1, deadline: 7 },
  { id: 'D', processing: 4, deadline: 8 },
  { id: 'E', processing: 2, deadline: 10 },
];

export function buildTrace(jobs: readonly MhJob[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();

  const onTimeIds = new Set<string>();
  const lateIds = new Set<string>();
  let consideringId = '';
  let t = 0;

  const snapshot = (note: { zh: string; en: string }): void => {
    const bars = jobs.map((j) => {
      let role: BarRole = 'default';
      if (lateIds.has(j.id)) role = 'warn';
      else if (onTimeIds.has(j.id)) role = 'final';
      else if (j.id === consideringId) role = 'compare';
      return { value: j.processing, role, label: `${j.id}(p=${j.processing},d=${j.deadline})` };
    });
    const aux = [
      { label: '累计时间 t', value: String(t), role: 'pivot' as BarRole },
      {
        label: '按时集合',
        value:
          jobs
            .filter((j) => onTimeIds.has(j.id))
            .map((j) => j.id)
            .join(',') || '∅',
        role: 'frontier' as BarRole,
      },
      {
        label: '延迟集合',
        value:
          jobs
            .filter((j) => lateIds.has(j.id))
            .map((j) => j.id)
            .join(',') || '∅',
        role: 'warn' as BarRole,
      },
      { label: '延迟数', value: String(lateIds.size), role: 'warn' as BarRole },
    ];
    rec.begin(note).setBars(bars).setAux(aux).commit();
    consideringId = '';
  };

  snapshot({ zh: `共 ${jobs.length} 个作业`, en: `${jobs.length} jobs` });

  const hooks: MhHooks = {
    onSort: () => {
      snapshot({ zh: `按截止时间排序`, en: `Sort by deadline` });
    },
    onAdd: (job, newT) => {
      consideringId = job.id;
      onTimeIds.add(job.id);
      t = newT;
      snapshot({ zh: `加入 ${job.id}（t=${newT}）`, en: `Add ${job.id} (t=${newT})` });
    },
    onEvict: (evicted, newT) => {
      onTimeIds.delete(evicted.id);
      lateIds.add(evicted.id);
      t = newT;
      snapshot({
        zh: `${evicted.id} 会导致超时，剔除（最大处理时间），计入延迟`,
        en: `${evicted.id} causes lateness, evict (longest), mark late`,
      });
    },
  };

  const result = mooreHodgson(jobs, hooks);

  // 终态
  rec
    .begin({
      zh: `完成：按时 ${result.onTime.length} 个，延迟 ${result.lateCount} 个`,
      en: `Done: ${result.onTime.length} on time, ${result.lateCount} late`,
    })
    .setBars(
      jobs.map((j) => ({
        value: j.processing,
        role: (lateIds.has(j.id) ? 'warn' : 'final') as BarRole,
        label: `${j.id}(p=${j.processing},d=${j.deadline})`,
      })),
    )
    .setAux([{ label: '最小延迟数', value: String(result.lateCount), role: 'final' as BarRole }])
    .commit();

  return rec.build();
}
