// AdaGrad · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'ada-grad',
  categoryId: 'optimization',
  title: { zh: 'AdaGrad', en: 'AdaGrad' },
  summary: {
    zh: 'AdaGrad属于optimization类别。',
    en: 'AdaGrad is a optimization algorithm.',
  },
  description: {
    zh: 'AdaGrad（AdaGrad）属于optimization类别的算法。',
    en: 'AdaGrad is an algorithm in the optimization category.',
  },
  tags: ["optimization"],
  complexity: { time: 'O(k·n)', space: 'O(n)' },
};
