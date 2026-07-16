// 最小费用环流 · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { minCostCirculation, type CirculationInput, type MinCostCirculationHooks } from './impl.ts';

export const DEFAULT_INPUT: CirculationInput = {
  n: 4,
  edges: [
    { from: 0, to: 1, cap: 4, cost: 1 },
    { from: 1, to: 2, cap: 4, cost: 1 },
    { from: 2, to: 3, cap: 4, cost: 1 },
    { from: 3, to: 0, cap: 4, cost: -3 }, // 负费用回边，形成负环
    { from: 0, to: 2, cap: 2, cost: 4 },
    { from: 1, to: 3, cap: 2, cost: 2 },
  ],
};

export function buildTrace(input: CirculationInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();

  rec
    .begin({
      zh: `图：${input.edges.length} 条带容量/费用边`,
      en: `Graph: ${input.edges.length} edges with capacity/cost`,
    })
    .setAux([{ label: '目标', value: '消去所有负费用环', role: 'pivot' }])
    .commit();

  let step = 0;
  const hooks: MinCostCirculationHooks = {
    onNegativeCycle: (cycle, gain) => {
      step++;
      rec
        .begin({
          zh: `第 ${step} 步：发现负费用环 ${cycle.join('→')}，可省费用 ${gain}`,
          en: `Step ${step}: negative cycle ${cycle.join('→')}, saves ${gain}`,
        })
        .setAux([
          { label: '负环', value: cycle.join('→'), role: 'warn' as BarRole },
          { label: '可省', value: String(gain), role: 'frontier' as BarRole },
        ])
        .commit();
    },
    onResult: (cost) => {
      rec
        .begin({ zh: `最小费用 = ${cost}`, en: `Min cost = ${cost}` })
        .setAux([{ label: '总费用', value: String(cost), role: 'final' as BarRole }])
        .commit();
    },
  };

  minCostCirculation(input, hooks);
  return rec.build();
}
