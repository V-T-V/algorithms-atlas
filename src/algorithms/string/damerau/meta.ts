// Damerau-Levenshtein · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'damerau',
  categoryId: 'string',
  title: { zh: 'Damerau 距离', en: 'Damerau-Levenshtein' },
  summary: {
    zh: 'Damerau 距离属于string类别。',
    en: 'Damerau-Levenshtein is a string algorithm.',
  },
  description: {
    zh: 'Damerau 距离（Damerau-Levenshtein）属于string类别的算法。',
    en: 'Damerau-Levenshtein is an algorithm in the string category.',
  },
  tags: ["string"],
  complexity: { time: 'O(n·m)', space: 'O(n·m)' },
};
