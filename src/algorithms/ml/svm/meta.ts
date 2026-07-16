// SVM (Toy) · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'svm',
  categoryId: 'ml',
  title: { zh: 'SVM玩具版', en: 'SVM (Toy)' },
  summary: {
    zh: 'SVM玩具版属于ml类别。',
    en: 'SVM (Toy) is a ml algorithm.',
  },
  description: {
    zh: 'SVM玩具版（SVM (Toy)）属于ml类别的算法。',
    en: 'SVM (Toy) is an algorithm in the ml category.',
  },
  tags: ["ml","machine-learning"],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
