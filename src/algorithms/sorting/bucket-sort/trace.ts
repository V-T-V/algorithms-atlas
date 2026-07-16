// =============================================================================
// 桶排序 · 录制帧序列
// 可视化：setBars 渲染「分桶过程」（把各桶内容拉平成柱），setAux 展示各桶内容。
// roles: 当前正在分配的值='compare'，已收集='final'。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { bucketSort, type BucketSortHooks } from './impl.ts';

export const DEFAULT_INPUT = [29, 10, 14, 37, 13, 25, 41, 8, 22, 33, 19];

/** 录制演示帧序列。 */
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();

  // 各桶内容（在 onDispatch / onSortBuckets 中同步）
  let buckets: number[][] = [];
  let output: number[] = [];
  let highlightVal: number | null = null;

  /** 把各桶内容拉平成柱状图（每个桶内连续，桶间留空隔开用 0 占位）。 */
  const flattenBars = (): Array<{ value: number; role: BarRole; label: string }> => {
    const bars: Array<{ value: number; role: BarRole; label: string }> = [];
    for (let b = 0; b < buckets.length; b++) {
      const bucket = buckets[b]!;
      for (let k = 0; k < bucket.length; k++) {
        const v = bucket[k]!;
        const role: BarRole = v === highlightVal ? 'compare' : 'default';
        bars.push({ value: v, role, label: String(v) });
      }
    }
    return bars;
  };

  const bucketsAux = () =>
    buckets.map((bk, i) => ({
      label: `桶 ${i}`,
      value: bk.length === 0 ? '—' : bk.join(','),
      role: 'default' as BarRole,
    }));

  // 初始
  rec
    .begin({
      zh: `初始数组：[${input.join(', ')}]（桶排序：先分桶，再桶内排序，最后收集）`,
      en: `Initial: [${input.join(', ')}] (bucket sort: scatter, sort each bucket, gather)`,
    })
    .setBars(input.map((v) => ({ value: v, role: 'default' as BarRole, label: String(v) })))
    .setAux([{ label: '状态', value: '尚未分桶', role: 'pivot' as BarRole }])
    .commit();

  const hooks: BucketSortHooks = {
    onSetup: (bucketCount, maxVal) => {
      buckets = Array.from({ length: bucketCount }, () => []);
      rec
        .begin({
          zh: `值域 [0, ${maxVal}]，分成 ${bucketCount} 个桶`,
          en: `Range [0, ${maxVal}], split into ${bucketCount} buckets`,
        })
        .setBars([])
        .setAux(bucketsAux())
        .commit();
    },
    onDispatch: (v, b, bk) => {
      buckets = bk.map((t) => [...t]);
      highlightVal = v;
      rec
        .begin({
          zh: `把 ${v} 分配到桶 ${b}`,
          en: `Dispatch ${v} to bucket ${b}`,
        })
        .setBars(flattenBars())
        .setAux(bucketsAux())
        .commit();
      highlightVal = null;
    },
    onSortBuckets: (bk) => {
      buckets = bk.map((t) => [...t]);
      rec
        .begin({
          zh: `对每个桶内部排序（插入排序，稳定）`,
          en: `Sort each bucket internally (stable insertion sort)`,
        })
        .setBars(flattenBars())
        .setAux(bucketsAux())
        .commit();
    },
    onCollect: (b, out) => {
      output = [...out];
      rec
        .begin({
          zh: `收集桶 ${b} 到输出（当前输出：[${output.join(', ')}]）`,
          en: `Gather bucket ${b} into output (output: [${output.join(', ')}])`,
        })
        .setBars(output.map((v) => ({ value: v, role: 'final' as BarRole, label: String(v) })))
        .setAux([
          { label: '当前桶', value: `桶 ${b}`, role: 'compare' as BarRole },
          { label: '已收集', value: String(output.length), role: 'final' as BarRole },
        ])
        .commit();
    },
  };

  const result = bucketSort(input, undefined, hooks);

  // 终态
  rec
    .begin({
      zh: `排序完成：[${result.join(', ')}]`,
      en: `Sorted: [${result.join(', ')}]`,
    })
    .setBars(result.map((v) => ({ value: v, role: 'final' as BarRole, label: String(v) })))
    .setAux([{ label: '结果', value: result.join(', '), role: 'final' as BarRole }])
    .commit();

  return rec.build();
}
