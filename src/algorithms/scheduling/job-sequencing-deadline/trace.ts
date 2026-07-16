// 带截止期限的作业排序 · 录制帧序列

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { jobSequencingDeadline, type JdHooks, type JdJob } from './impl.ts';

export const DEFAULT_INPUT: JdJob[] = [
  { id: 'J1', deadline: 2, profit: 100 },
  { id: 'J2', deadline: 1, profit: 50 },
  { id: 'J3', deadline: 2, profit: 20 },
  { id: 'J4', deadline: 1, profit: 30 },
  { id: 'J5', deadline: 3, profit: 40 },
];

export function buildTrace(input: JdJob[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const maxD = Math.max(...input.map((j) => j.deadline));
  const slotMap: Map<number, JdJob> = new Map(); // slot -> job
  const skipped = new Set<string>();
  const curConsider = new Set<string>();
  let totalProfit = 0;

  const snapshot = (note: { zh: string; en: string }): void => {
    const bars: Array<{ value: number; role: BarRole; label?: string }> = [];
    for (let s = 1; s <= maxD; s++) {
      const j = slotMap.get(s);
      if (j) {
        bars.push({
          value: j.profit,
          role: 'final' as BarRole,
          label: `s${s}:${j.id}=${j.profit}`,
        });
      } else {
        bars.push({ value: 0, role: 'default' as BarRole, label: `s${s}:空` });
      }
    }
    const aux: Array<{ label: string; value: string; role?: BarRole }> = [
      { label: '总利润', value: String(totalProfit), role: 'pivot' as BarRole },
      {
        label: '跳过',
        value: skipped.size ? [...skipped].join(',') : '∅',
        role: 'warn' as BarRole,
      },
      {
        label: '考虑中',
        value: curConsider.size ? [...curConsider].join(',') : '∅',
        role: 'compare' as BarRole,
      },
    ];
    rec.begin(note).setBars(bars).setAux(aux).commit();
    curConsider.clear();
  };

  snapshot({
    zh: `贪心：${input.length} 作业，${maxD} 槽`,
    en: `Greedy: ${input.length} jobs, ${maxD} slots`,
  });

  const hooks: JdHooks = {
    onConsider: (j) => curConsider.add(j.id),
    onSchedule: (slot, j) => {
      slotMap.set(slot, j);
      totalProfit += j.profit;
      snapshot({
        zh: `${j.id}(p=${j.profit},d=${j.deadline}) → 槽${slot}`,
        en: `${j.id}(p=${j.profit},d=${j.deadline}) → slot${slot}`,
      });
    },
    onSkip: (j) => {
      skipped.add(j.id);
      snapshot({ zh: `${j.id} 无空槽，跳过`, en: `${j.id} no slot, skipped` });
    },
  };

  const result = jobSequencingDeadline(input, hooks);

  rec
    .begin({
      zh: `完成，最大利润 = ${result.totalProfit}`,
      en: `Done, max profit = ${result.totalProfit}`,
    })
    .setBars(
      Array.from({ length: maxD }, (_, i) => {
        const s = i + 1;
        const j = slotMap.get(s);
        return {
          value: j?.profit ?? 0,
          role: 'final' as BarRole,
          label: j ? `s${s}:${j.id}` : `s${s}:空`,
        };
      }),
    )
    .setAux([
      { label: '最大利润', value: String(result.totalProfit), role: 'final' as BarRole },
      { label: '选中', value: result.selected.join(','), role: 'pivot' as BarRole },
      { label: '跳过', value: result.skipped.join(',') || '∅', role: 'warn' as BarRole },
    ])
    .commit();

  return rec.build();
}
