// =============================================================================
// 桶排序 · 录制帧序列
// 用 setAux 展示各桶内容；用 setBars 展示中间/最终数组。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { bucketSort, type BucketSortHooks } from './impl.ts';

export const DEFAULT_INPUT = [0.78, 0.17, 0.39, 0.26, 0.72, 0.94, 0.21, 0.12, 0.23, 0.68];
const DEFAULT_K = 5;

interface TraceOptions {
  arr: number[];
  k: number;
}

export function buildTrace(input: Partial<TraceOptions> = {}): Frame[] {
  const arr = input.arr ?? DEFAULT_INPUT;
  const k = input.k ?? DEFAULT_K;
  const rec = new TraceRecorder();
  let buckets: number[][] = Array.from({ length: k }, () => []);
  let result: number[] = [];

  const render = (note: { zh: string; en: string }): void => {
    rec
      .begin(note)
      .setAux([
        ...buckets.map((b, i) => ({
          label: `桶 ${i}`,
          value: `[${b.map((v) => (Number.isInteger(v) ? v : v.toFixed(2))).join(', ')}]`,
          role: (b.length > 0 ? 'compare' : 'default') as BarRole,
        })),
        {
          label: '输出',
          value: `[${result.map((v) => (Number.isInteger(v) ? v : v.toFixed(2))).join(', ')}]`,
          role: 'final' as BarRole,
        },
      ])
      .setBars(
        (result.length > 0 ? result : arr).map((v) => ({
          value: v,
          role: 'default' as BarRole,
          label: Number.isInteger(v) ? String(v) : v.toFixed(2),
        })),
      )
      .commit();
  };

  render({
    zh: `初始化：${k} 个桶，输入 [${arr.join(', ')}]`,
    en: `Init: ${k} buckets, input [${arr.join(', ')}]`,
  });

  const hooks: BucketSortHooks = {
    onDistribute: (_v, b, bs) => {
      buckets = bs;
      render({ zh: `分配 ${_v} 到桶 ${b}`, en: `Distribute ${_v} to bucket ${b}` });
    },
    onSortBucket: (b, sorted) => {
      buckets[b] = [...sorted];
      render({ zh: `桶 ${b} 内部排序完成`, en: `Bucket ${b} sorted internally` });
    },
    onMerge: (r) => {
      result = [...r];
      render({ zh: `合并所有桶，得到有序结果`, en: `Merge all buckets into sorted result` });
    },
  };

  bucketSort(arr, k, hooks);

  rec
    .begin({
      zh: `完成：已排序 [${result.map((v) => (Number.isInteger(v) ? v : v.toFixed(2))).join(', ')}]`,
      en: `Done: sorted`,
    })
    .setBars(
      result.map((v) => ({
        value: v,
        role: 'sorted' as BarRole,
        label: Number.isInteger(v) ? String(v) : v.toFixed(2),
      })),
    )
    .setAux([
      {
        label: '结果',
        value: `[${result.map((v) => (Number.isInteger(v) ? v : v.toFixed(2))).join(', ')}]`,
        role: 'final' as BarRole,
      },
    ])
    .commit();

  return rec.build();
}
