// 加权中位数（排序法）· 录制帧序列
// 用 setArray 展示排序后的值与权重，用 setAux 展示累加进度。

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { weightedMedianSort, type WeightedMedianSortHooks, type Weighted } from './impl.ts';

export const DEFAULT_INPUT: Weighted[] = [
  { value: 5, weight: 0.1 },
  { value: 1, weight: 0.3 },
  { value: 9, weight: 0.2 },
  { value: 3, weight: 0.15 },
  { value: 7, weight: 0.25 },
];

export function buildTrace(input: Weighted[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  let values: number[] = [];
  let sortedInfo: Weighted[] = [];
  let accIdx = -1;
  let curPrefix = 0;
  let halfVal = 0;

  const snapshot = (note: { zh: string; en: string }): void => {
    const roles: BarRole[] = new Array(values.length).fill('default');
    for (let i = 0; i <= accIdx && i < values.length; i++) roles[i] = 'frontier';
    if (accIdx >= 0 && accIdx < values.length) roles[accIdx] = 'compare';
    const ptrs = accIdx >= 0 ? [{ index: accIdx, label: 'i' }] : [];
    const aux: Array<{ label: string; value: string; role?: BarRole }> = [
      { label: '前缀权重', value: curPrefix.toFixed(3), role: 'compare' as BarRole },
      { label: 'W/2', value: halfVal.toFixed(3), role: 'pivot' as BarRole },
    ];
    if (sortedInfo.length) {
      aux.push({
        label: '排序后(值:权)',
        value: sortedInfo.map((x) => `${x.value}:${x.weight}`).join(', '),
        role: 'frontier' as BarRole,
      });
    }
    rec.begin(note).setArray(values, roles, ptrs).setAux(aux).commit();
  };

  rec
    .begin({ zh: `共 ${input.length} 个带权元素`, en: `${input.length} weighted items` })
    .setArray(
      input.map((x) => x.value),
      [],
      [],
    )
    .setAux([{ label: '说明', value: '按值排序后累加权重', role: 'frontier' as BarRole }])
    .commit();

  const hooks: WeightedMedianSortHooks = {
    onSorted: (s) => {
      sortedInfo = s;
      values = s.map((x) => x.value);
      snapshot({ zh: `按值排序完成`, en: `Sorted by value` });
    },
    onTotal: (_t, half) => {
      halfVal = half;
      snapshot({
        zh: `总权重一半 W/2 = ${half.toFixed(3)}`,
        en: `Half total W/2 = ${half.toFixed(3)}`,
      });
    },
    onAccumulate: (i, item, prefix) => {
      accIdx = i;
      curPrefix = prefix;
      snapshot({
        zh: `累加 [${i}]=${item.value} (w=${item.weight})，前缀 ${prefix.toFixed(3)}`,
        en: `Accumulate [${i}]=${item.value} (w=${item.weight}), prefix ${prefix.toFixed(3)}`,
      });
    },
  };

  const ans = weightedMedianSort(input, hooks);

  rec
    .begin({ zh: `加权中位数 = ${ans}`, en: `Weighted median = ${ans}` })
    .setArray(values, new Array(values.length).fill('final'), [])
    .setAux([
      { label: '结果', value: String(ans), role: 'final' as BarRole },
      { label: '复杂度', value: 'O(n log n)', role: 'frontier' as BarRole },
    ])
    .commit();

  return rec.build();
}
