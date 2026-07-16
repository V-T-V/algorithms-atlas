// 最大利润计划 · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { greedyMaxProfitSchedule, type GreedyMaxProfitScheduleHooks, type Job } from './impl.ts';

export const DEFAULT_INPUT: Job[] = [
  { start: 1, end: 3, profit: 50 },
  { start: 2, end: 4, profit: 10 },
  { start: 3, end: 5, profit: 70 },
  { start: 3, end: 6, profit: 60 },
];

export function buildTrace(input: Job[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();

  rec
    .begin({ zh: `${input.length} 项工作`, en: `${input.length} jobs` })
    .setBars(input.map((j) => ({ value: j.profit, role: 'default' as BarRole })))
    .commit();

  const hooks: GreedyMaxProfitScheduleHooks = {
    onConsider: (jobIndex, take, skip, chosen) => {
      rec
        .begin({
          zh: `工作 ${jobIndex}：取=${take} 舍=${skip} → dp=${chosen}`,
          en: `job ${jobIndex}: take=${take} skip=${skip} → dp=${chosen}`,
        })
        .setBars([{ value: chosen, role: 'final' as BarRole }])
        .setAux([{ label: `dp[${jobIndex}]`, value: String(chosen), role: 'pivot' }])
        .commit();
    },
  };

  const result = greedyMaxProfitSchedule(input, hooks);

  rec
    .begin({ zh: `完成：最大利润 ${result}`, en: `Done: max profit ${result}` })
    .setBars([{ value: result, role: 'final' as BarRole }])
    .setAux([{ label: '最大利润', value: String(result), role: 'final' }])
    .commit();

  return rec.build();
}
