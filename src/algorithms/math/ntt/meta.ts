// Number Theoretic Transform (NTT) · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'ntt',
  categoryId: 'math',
  title: { zh: '数论变换', en: 'Number Theoretic Transform (NTT)' },
  summary: {
    zh: '数论变换属于math类别。',
    en: 'Number Theoretic Transform (NTT) is a math algorithm.',
  },
  description: {
    zh: '数论变换（Number Theoretic Transform (NTT)）属于math类别的算法。',
    en: 'Number Theoretic Transform (NTT) is an algorithm in the math category.',
  },
  tags: ["math","polynomial"],
  complexity: { time: 'O(n log n)', space: 'O(n)' },
};
