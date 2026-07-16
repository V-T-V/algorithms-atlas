// Randomized Quicksort · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'random-quick-sort',
  categoryId: 'randomized',
  title: { zh: '随机化快速排序', en: 'Randomized Quicksort' },
  summary: {
    zh: '随机化快速排序属于randomized类别。',
    en: 'Randomized Quicksort is a randomized algorithm.',
  },
  description: {
    zh: '随机化快速排序（Randomized Quicksort）属于randomized类别的算法。',
    en: 'Randomized Quicksort is an algorithm in the randomized category.',
  },
  tags: ["randomized","sorting"],
  complexity: { time: 'O(n log n) 期望', space: 'O(log n)' },
};
