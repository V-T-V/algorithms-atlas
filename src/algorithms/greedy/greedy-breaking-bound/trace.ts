// 破界贪心 · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { greedyBreakingBound, type GreedyBreakingBoundHooks, type Item } from './impl.ts';

export const DEFAULT_INPUT = {
  items: [
    { weight: 10, value: 60 },
    { weight: 20, value: 100 },
    { weight: 30, value: 120 },
  ] as Item[],
  capacity: 50,
};

export function buildTrace(input: { items: Item[]; capacity: number } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { items, capacity } = input;

  rec
    .begin({
      zh: `${items.length} 件物品，容量 ${capacity}`,
      en: `${items.length} items, capacity ${capacity}`,
    })
    .setBars(items.map((it) => ({ value: it.value / it.weight, role: 'default' as BarRole })))
    .commit();

  const hooks: GreedyBreakingBoundHooks = {
    onTakeWhole: (itemIndex) => {
      rec
        .begin({ zh: `整件装入物品 ${itemIndex}`, en: `Take whole item ${itemIndex}` })
        .setBars(
          items.map((_, i) => ({
            value: 1,
            role: (i === itemIndex ? 'final' : 'default') as BarRole,
          })),
        )
        .commit();
    },
    onTakeFraction: (itemIndex, fraction, bound) => {
      rec
        .begin({
          zh: `取物品 ${itemIndex} 的 ${(fraction * 100).toFixed(0)}%，上界 ${bound.toFixed(1)}`,
          en: `Take ${(fraction * 100).toFixed(0)}% of item ${itemIndex}, bound ${bound.toFixed(1)}`,
        })
        .setBars([{ value: bound, role: 'final' as BarRole }])
        .commit();
    },
  };

  const result = greedyBreakingBound(items, capacity, hooks);

  rec
    .begin({ zh: `完成：上界 ${result.toFixed(2)}`, en: `Done: bound ${result.toFixed(2)}` })
    .setBars([{ value: result, role: 'final' as BarRole }])
    .setAux([{ label: '上界', value: result.toFixed(2), role: 'final' }])
    .commit();

  return rec.build();
}
