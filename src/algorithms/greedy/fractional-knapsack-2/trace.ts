// 分数背包 · 录制帧序列

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { fractionalKnapsack2, type Item, type FractionalKnapsack2Hooks } from './impl.ts';

export interface FkInput {
  items: Item[];
  capacity: number;
}

export const DEFAULT_INPUT: FkInput = {
  items: [
    { weight: 10, value: 60 },
    { weight: 20, value: 100 },
    { weight: 30, value: 120 },
  ],
  capacity: 50,
};

/** 录制演示帧序列。 */
export function buildTrace(input: FkInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { items, capacity } = input;

  rec
    .begin({
      zh: `${items.length} 件物品，容量 ${capacity}`,
      en: `${items.length} items, capacity ${capacity}`,
    })
    .setBars(items.map((it) => ({ value: it.value / it.weight, role: 'pivot' as BarRole })))
    .commit();

  const hooks: FractionalKnapsack2Hooks = {
    onTake: (i, frac, v) => {
      rec
        .begin({
          zh: `取物品 ${i} 的 ${(frac * 100).toFixed(0)}%（价值 ${v.toFixed(1)}）`,
          en: `Take item ${i}: ${(frac * 100).toFixed(0)}% (value ${v.toFixed(1)})`,
        })
        .setAux([
          { label: '物品', value: String(i), role: 'compare' as BarRole },
          { label: '比例', value: `${(frac * 100).toFixed(0)}%`, role: 'swap' as BarRole },
        ])
        .commit();
    },
  };
  const { value } = fractionalKnapsack2(items, capacity, hooks);

  rec
    .begin({ zh: `完成：最大价值 ${value}`, en: `Done: max value ${value}` })
    .setMap([{ key: '总价值', value: String(value), role: 'final' as BarRole }])
    .commit();

  return rec.build();
}
