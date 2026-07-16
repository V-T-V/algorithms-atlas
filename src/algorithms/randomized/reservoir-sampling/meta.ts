// Reservoir Sampling · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'reservoir-sampling',
  categoryId: 'randomized',
  title: { zh: '水库采样', en: 'Reservoir Sampling' },
  summary: {
    zh: '水库采样属于randomized类别。',
    en: 'Reservoir Sampling is a randomized algorithm.',
  },
  description: {
    zh: '水库采样（Reservoir Sampling）属于randomized类别的算法。',
    en: 'Reservoir Sampling is an algorithm in the randomized category.',
  },
  tags: ["randomized"],
  complexity: { time: 'O(n)', space: 'O(k)' },
};
