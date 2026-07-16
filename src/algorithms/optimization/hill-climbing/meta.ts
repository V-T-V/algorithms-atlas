// Hill Climbing · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'hill-climbing',
  categoryId: 'optimization',
  title: { zh: '爬山算法', en: 'Hill Climbing' },
  summary: {
    zh: '爬山算法属于optimization类别。',
    en: 'Hill Climbing is a optimization algorithm.',
  },
  description: {
    zh: '爬山算法（Hill Climbing）属于optimization类别的算法。',
    en: 'Hill Climbing is an algorithm in the optimization category.',
  },
  tags: ["optimization"],
  complexity: { time: 'O(I · S)', space: 'O(1)' },
};
