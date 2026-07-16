// Maximal Square · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'maximal-square',
  categoryId: 'dp',
  title: { zh: '最大正方形', en: 'Maximal Square' },
  summary: {
    zh: '最大正方形属于dp类别。',
    en: 'Maximal Square is a dp algorithm.',
  },
  description: {
    zh: '最大正方形（Maximal Square）属于dp类别的算法。',
    en: 'Maximal Square is an algorithm in the dp category.',
  },
  tags: ["dp"],
  complexity: { time: 'O(m·n)', space: 'O(m·n)' },
};
