// Differential Evolution · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'differential-evo',
  categoryId: 'optimization',
  title: { zh: '差分进化', en: 'Differential Evolution' },
  summary: {
    zh: '差分进化属于optimization类别。',
    en: 'Differential Evolution is a optimization algorithm.',
  },
  description: {
    zh: '差分进化（Differential Evolution）属于optimization类别的算法。',
    en: 'Differential Evolution is an algorithm in the optimization category.',
  },
  tags: ["optimization"],
  complexity: { time: 'O(g·NP·n)', space: 'O(NP·n)' },
};
