// 中位5快选（Median-of-5 Quickselect）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'sel-quickselect-pivot-med5',
  categoryId: 'selection',
  title: { zh: '中位5快选', en: 'Median-of-5 Quickselect' },
  summary: {
    zh: 'Quickselect：用 5 个均匀采样的中位数做 pivot。',
    en: 'Quickselect: pivot is median of 5 evenly sampled elements.',
  },
  description: {
    zh: 'Quickselect 的 median-of-5 变体：均匀采样 5 个元素，取中位数做 pivot，比 median-of-3 更稳。',
    en: 'Median-of-5 quickselect variant: sample 5 evenly spaced elements, take their median as pivot — more stable than median-of-3.',
  },
  tags: ['selection', 'quickselect', 'median-of-5'],
  complexity: { time: 'O(n) expected', space: 'O(log n)' },
};
