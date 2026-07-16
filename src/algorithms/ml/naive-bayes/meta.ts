// Naive Bayes · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'naive-bayes',
  categoryId: 'ml',
  title: { zh: '朴素贝叶斯', en: 'Naive Bayes' },
  summary: {
    zh: '朴素贝叶斯属于ml类别。',
    en: 'Naive Bayes is a ml algorithm.',
  },
  description: {
    zh: '朴素贝叶斯（Naive Bayes）属于ml类别的算法。',
    en: 'Naive Bayes is an algorithm in the ml category.',
  },
  tags: ["ml","machine-learning"],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
