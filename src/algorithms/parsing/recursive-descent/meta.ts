// Recursive Descent Parser · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'recursive-descent',
  categoryId: 'parsing',
  title: { zh: '递归下降解析', en: 'Recursive Descent Parser' },
  summary: {
    zh: '递归下降解析属于parsing类别。',
    en: 'Recursive Descent Parser is a parsing algorithm.',
  },
  description: {
    zh: '递归下降解析（Recursive Descent Parser）属于parsing类别的算法。',
    en: 'Recursive Descent Parser is an algorithm in the parsing category.',
  },
  tags: ["parsing"],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
