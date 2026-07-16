import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { knapsackDensityGreedy, type KdItem } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const items: KdItem[] = [
    { w: 10, v: 60 },
    { w: 20, v: 100 },
    { w: 30, v: 120 },
  ];
  rec.begin({ zh: '0/1 背包密度贪心 cap=50', en: '0/1 knapsack density cap=50' }).commit();
  const r = knapsackDensityGreedy(50, items, {
    onConsider: (i, d, t) =>
      rec
        .begin({
          zh: `物品${i} 密度${d.toFixed(1)} ${t ? '取' : '跳'}`,
          en: `item${i} dens${d.toFixed(1)} ${t ? 'take' : 'skip'}`,
        })
        .setBars([{ value: d, role: t ? ('final' as BarRole) : ('default' as BarRole) }])
        .commit(),
  });
  rec
    .begin({ zh: `价值 ${r.value} 重 ${r.weight}`, en: `value ${r.value} weight ${r.weight}` })
    .setAux([{ label: 'value', value: String(r.value), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
