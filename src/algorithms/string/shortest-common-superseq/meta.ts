// Shortest Common Supersequence · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'shortest-common-superseq',
  categoryId: 'string',
  title: { zh: '最短公共超序列', en: 'Shortest Common Supersequence' },
  summary: {
    zh: '最短公共超序列属于string类别。',
    en: 'Shortest Common Supersequence is a string algorithm.',
  },
  description: {
    zh: '最短公共超序列（Shortest Common Supersequence）属于string类别的算法。',
    en: 'Shortest Common Supersequence is an algorithm in the string category.',
  },
  tags: ["string","shortest-path"],
  complexity: { time: 'O(nm)', space: 'O(nm)' },
};
