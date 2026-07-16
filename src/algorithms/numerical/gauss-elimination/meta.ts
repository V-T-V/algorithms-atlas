// Gauss Elimination · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'gauss-elimination',
  categoryId: 'numerical',
  title: { zh: '高斯消元', en: 'Gauss Elimination' },
  summary: {
    zh: '高斯消元属于numerical类别。',
    en: 'Gauss Elimination is a numerical algorithm.',
  },
  description: {
    zh: '高斯消元（Gauss Elimination）属于numerical类别的算法。',
    en: 'Gauss Elimination is an algorithm in the numerical category.',
  },
  tags: ["numerical","numerical-method"],
  complexity: { time: 'O(n³)', space: 'O(n²)' },
};
