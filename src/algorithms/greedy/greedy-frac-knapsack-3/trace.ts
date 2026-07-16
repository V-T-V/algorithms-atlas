// 分数背包 · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { greedyFracKnapsack3, type Item } from './impl.ts';
const ITEMS: Item[] = [
  { w: 10, v: 60 },
  { w: 20, v: 100 },
  { w: 30, v: 120 },
];
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec
    .begin({ zh: '分数背包：容量 50', en: 'Fractional knapsack: capacity 50' })
    .setBars(ITEMS.map((it) => ({ value: it.v / it.w, role: 'default' as BarRole, label: `v/w` })))
    .commit();
  const r = greedyFracKnapsack3(50, ITEMS, {
    onPick: (i, frac, g) => {
      rec
        .begin({
          zh: `取物品 ${i} 的 ${(frac * 100).toFixed(0)}%，得 ${g.toFixed(0)}`,
          en: `Take item ${i} ${(frac * 100).toFixed(0)}%, gain ${g.toFixed(0)}`,
        })
        .setAux([{ label: '占比', value: (frac * 100).toFixed(0) + '%', role: 'final' as BarRole }])
        .commit();
    },
  });
  rec
    .begin({ zh: `总价值 ${r.totalValue}`, en: `Total value ${r.totalValue}` })
    .setAux([{ label: '总价值', value: String(r.totalValue), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
