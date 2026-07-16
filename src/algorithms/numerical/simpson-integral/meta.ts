// Simpson Integration · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'simpson-integral',
  categoryId: 'numerical',
  title: { zh: '辛普森积分', en: 'Simpson Integration' },
  summary: {
    zh: '辛普森积分属于numerical类别。',
    en: 'Simpson Integration is a numerical algorithm.',
  },
  description: {
    zh: '辛普森积分（Simpson Integration）属于numerical类别的算法。',
    en: 'Simpson Integration is an algorithm in the numerical category.',
  },
  tags: ["numerical","metaheuristic","numerical-method"],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
