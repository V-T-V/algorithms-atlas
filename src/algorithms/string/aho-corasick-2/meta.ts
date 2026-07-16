// Aho-Corasick v2 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'aho-corasick-2',
  categoryId: 'string',
  title: { zh: 'AC自动机v2', en: 'Aho-Corasick v2' },
  summary: {
    zh: 'AC自动机v2属于string类别。',
    en: 'Aho-Corasick v2 is a string algorithm.',
  },
  description: {
    zh: 'AC自动机v2（Aho-Corasick v2）属于string类别的算法。',
    en: 'Aho-Corasick v2 is an algorithm in the string category.',
  },
  tags: ["string"],
  complexity: { time: 'O(|text|+|Σ|·Σ|pat|)', space: 'O(|Σ|·节点数)' },
};
