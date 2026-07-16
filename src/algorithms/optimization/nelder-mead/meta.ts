// Nelder-Mead · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'nelder-mead',
  categoryId: 'optimization',
  title: { zh: '单纯形法', en: 'Nelder-Mead' },
  summary: {
    zh: '单纯形法属于optimization类别。',
    en: 'Nelder-Mead is a optimization algorithm.',
  },
  description: {
    zh: '单纯形法（Nelder-Mead）属于optimization类别的算法。',
    en: 'Nelder-Mead is an algorithm in the optimization category.',
  },
  tags: ["optimization"],
  complexity: { time: 'O(k·n²)', space: 'O(n²)' },
};
