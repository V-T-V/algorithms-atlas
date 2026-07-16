// Unique Paths · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'unique-paths',
  categoryId: 'dp',
  title: { zh: '不同路径', en: 'Unique Paths' },
  summary: {
    zh: '不同路径属于dp类别。',
    en: 'Unique Paths is a dp algorithm.',
  },
  description: {
    zh: '不同路径（Unique Paths）属于dp类别的算法。',
    en: 'Unique Paths is an algorithm in the dp category.',
  },
  tags: ["dp"],
  complexity: { time: 'O(m·n)', space: 'O(m·n)' },
};
