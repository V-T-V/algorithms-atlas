// Quickselect · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'quickselect',
  categoryId: 'randomized',
  title: { zh: '快速选择', en: 'Quickselect' },
  summary: {
    zh: '快速选择属于randomized类别。',
    en: 'Quickselect is a randomized algorithm.',
  },
  description: {
    zh: '快速选择（Quickselect）属于randomized类别的算法。',
    en: 'Quickselect is an algorithm in the randomized category.',
  },
  tags: ["randomized","sorting"],
  complexity: { time: 'O(n)', space: 'O(log n)' },
};
