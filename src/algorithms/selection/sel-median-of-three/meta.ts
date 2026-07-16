// 三数取中选择 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'sel-median-of-three',
  categoryId: 'selection',
  title: { zh: '三数取中位数', en: 'Median of Three' },
  summary: {
    zh: '取首、中、尾三数的中位数，常用于快排 pivot 选择。',
    en: 'Pick the median of the first, middle, and last elements; a common quicksort pivot choice.',
  },
  description: {
    zh: '三数取中：比较 arr[lo]、arr[mid]、arr[hi]，取中值。作为快排 pivot 能显著降低最坏输入（已排序/逆序）的概率，常数小。',
    en: 'Median-of-three: compare arr[lo], arr[mid], arr[hi] and take the middle value. As a quicksort pivot it greatly reduces the chance of worst-case behavior on sorted inputs, with a tiny constant.',
  },
  tags: ['selection', 'median', 'pivot-strategy'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
