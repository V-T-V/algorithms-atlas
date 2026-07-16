// Suffix Array (SA-IS) · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'suffix-array-sa-is',
  categoryId: 'string',
  title: { zh: 'SA-IS 后缀数组', en: 'Suffix Array (SA-IS)' },
  summary: {
    zh: 'SA-IS 后缀数组属于string类别。',
    en: 'Suffix Array (SA-IS) is a string algorithm.',
  },
  description: {
    zh: 'SA-IS 后缀数组（Suffix Array (SA-IS)）属于string类别的算法。',
    en: 'Suffix Array (SA-IS) is an algorithm in the string category.',
  },
  tags: ["string","suffix-structure"],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
