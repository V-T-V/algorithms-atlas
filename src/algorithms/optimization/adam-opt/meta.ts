// Adam Optimizer · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'adam-opt',
  categoryId: 'optimization',
  title: { zh: 'Adam 优化器', en: 'Adam Optimizer' },
  summary: {
    zh: 'Adam 优化器属于optimization类别。',
    en: 'Adam Optimizer is a optimization algorithm.',
  },
  description: {
    zh: 'Adam 优化器（Adam Optimizer）属于optimization类别的算法。',
    en: 'Adam Optimizer is an algorithm in the optimization category.',
  },
  tags: ["optimization"],
  complexity: { time: 'O(k·n)', space: 'O(n)' },
};
