// =============================================================================
// 加权中位数 · 录制帧序列
// 通过 weightedMedian 的钩子，把执行过程录成 Frame[]。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { weightedMedian, type WeightedItem, type WeightedMedianHooks } from './impl.ts';

export const DEFAULT_INPUT: WeightedItem[] = [
  { value: 1, weight: 1 },
  { value: 2, weight: 2 },
  { value: 3, weight: 3 },
  { value: 4, weight: 4 },
  { value: 5, weight: 1 },
];

export function buildTrace(input: WeightedItem[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  let sorted: WeightedItem[] = [];
  let cursor = -1;
  let foundIdx = -1;

  const snapshot = (note: { zh: string; en: string }): void => {
    if (sorted.length === 0) {
      rec.begin(note).setBars([]).commit();
      return;
    }
    const roles: Record<number, BarRole> = {};
    if (foundIdx >= 0) roles[foundIdx] = 'final';
    for (let i = 0; i <= cursor; i++) if (i !== foundIdx) roles[i] = 'sorted';
    if (cursor >= 0 && cursor !== foundIdx) roles[cursor] = 'pivot';
    const values = sorted.map((it) => it.value);
    const labels: Record<number, string> = {};
    sorted.forEach((it, i) => {
      labels[i] = `w${it.weight}`;
    });
    const total = sorted.reduce((s, it) => s + it.weight, 0);
    const prefix = sorted.slice(0, cursor + 1).reduce((s, it) => s + it.weight, 0);
    rec
      .begin(note)
      .setBars(rec.barsFrom(values, roles, labels))
      .setAux([
        { label: '总权重', value: String(total), role: 'default' as BarRole },
        { label: '阈值 W/2', value: String(total / 2), role: 'frontier' as BarRole },
        { label: '当前累计', value: String(prefix), role: 'compare' as BarRole },
      ])
      .commit();
  };

  snapshot({ zh: '准备计算加权中位数', en: 'Ready to compute weighted median' });

  const hooks: WeightedMedianHooks = {
    onSorted: (items) => {
      sorted = items;
      snapshot({ zh: '按 value 排序完成', en: 'Sorted by value' });
    },
    onAccumulate: (idx, prefix, half) => {
      cursor = idx;
      snapshot({
        zh: `累计到第 ${idx + 1} 项：prefix=${prefix}，阈值 ${half}`,
        en: `Accumulate to item ${idx + 1}: prefix=${prefix}, half=${half}`,
      });
    },
    onFound: (value) => {
      foundIdx = sorted.findIndex((it) => it.value === value);
      cursor = foundIdx;
      snapshot({ zh: `命中：加权中位数 = ${value}`, en: `Found: weighted median = ${value}` });
    },
  };

  weightedMedian(input, hooks);

  return rec.build();
}
