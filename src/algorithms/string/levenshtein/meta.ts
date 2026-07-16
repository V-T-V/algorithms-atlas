// Levenshtein Distance · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'levenshtein',
  categoryId: 'string',
  title: { zh: '莱文斯坦距离', en: 'Levenshtein Distance' },
  summary: {
    zh: '莱文斯坦距离属于string类别。',
    en: 'Levenshtein Distance is a string algorithm.',
  },
  description: {
    zh: '莱文斯坦距离（Levenshtein Distance）属于string类别的算法。',
    en: 'Levenshtein Distance is an algorithm in the string category.',
  },
  tags: ["string"],
  complexity: { time: 'O(|a|·|b|)', space: 'O(|a|·|b|)' },
};
