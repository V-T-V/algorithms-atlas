// 快速选择（三数取中）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'quickselect-median3',
  categoryId: 'selection',
  title: { zh: '快速选择（三数取中）', en: 'Quickselect (Median-of-Three)' },
  summary: {
    zh: '取首/中/尾的中位数作基准，避免已序输入退化。',
    en: 'Median-of-three pivot avoids degradation on sorted inputs.',
  },
  description: {
    zh: '在 Lomuto 分区版快选基础上改进基准选择：取 a[lo]、a[mid]、a[hi] 三个值的中位数作为基准（先把三者排序放到 lo/mid/hi，并把中位数交换到 hi 作为基准），再做 Lomuto 分区。这样可避免输入基本有序时退化为 O(n²)。\n\n- 三数取中：对 (lo, mid, hi) 做排序式交换，中位数落到 hi\n- 随后用 a[hi] 为基准做标准 Lomuto 分区\n- 期望 O(n)，已序输入仍接近 O(n)，最坏 O(n²)。',
    en: 'Improves Lomuto quickselect by choosing the median of a[lo], a[mid], a[hi] as pivot: sort these three into place and move the median to hi, then Lomuto-partition. Expected O(n); near-O(n) on sorted inputs; worst case O(n²).',
  },
  tags: ['selection', 'quickselect', 'divide-and-conquer', 'pivot-strategy'],
  complexity: { time: 'O(n) 期望', space: 'O(log n)' },
};
