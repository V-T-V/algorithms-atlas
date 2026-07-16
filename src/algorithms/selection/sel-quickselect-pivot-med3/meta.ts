// 中位3快选（Median-of-3 Quickselect）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'sel-quickselect-pivot-med3',
  categoryId: 'selection',
  title: { zh: '中位3快选', en: 'Median-of-3 Quickselect' },
  summary: {
    zh: 'Quickselect：用首/中/尾的中位数做 pivot。',
    en: 'Quickselect: pivot is median of first/middle/last.',
  },
  description: {
    zh: 'Quickselect 的 median-of-3 变体：取首、中、尾三者的中位数作 pivot，避免最坏情况。',
    en: 'Median-of-3 quickselect variant: pivot is the median of the first, middle, and last elements, mitigating worst cases.',
  },
  tags: ['selection', 'quickselect', 'median-of-3'],
  complexity: { time: 'O(n) expected', space: 'O(log n)' },
};
