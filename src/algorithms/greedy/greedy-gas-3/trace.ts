// 加油站 · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { greedyGas3 } from './impl.ts';
const GAS = [1, 2, 3, 4, 5];
const COST = [3, 4, 5, 1, 2];
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '加油站：环形搜索起点', en: 'Gas station: find start' }).commit();
  const r = greedyGas3(GAS, COST, {
    onStep: (i, tank, total) =>
      rec
        .begin({
          zh: `i=${i} tank=${tank} total=${total}`,
          en: `i=${i} tank=${tank} total=${total}`,
        })
        .setBars(
          GAS.map((g, k) => ({
            value: g - COST[k]!,
            role: (k === i ? 'compare' : 'default') as BarRole,
          })),
        )
        .commit(),
  });
  rec
    .begin({
      zh: `起点 ${r.start}，可行 ${r.feasible}`,
      en: `Start ${r.start}, feasible ${r.feasible}`,
    })
    .setAux([{ label: '起点', value: String(r.start), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
