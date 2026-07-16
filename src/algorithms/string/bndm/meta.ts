// BNDM Match · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'bndm',
  categoryId: 'string',
  title: { zh: 'BNDM匹配', en: 'BNDM Match' },
  summary: {
    zh: 'BNDM匹配属于string类别。',
    en: 'BNDM Match is a string algorithm.',
  },
  description: {
    zh: 'BNDM匹配（BNDM Match）属于string类别的算法。',
    en: 'BNDM Match is an algorithm in the string category.',
  },
  tags: ["string"],
  complexity: { time: 'O(n/m) avg', space: 'O(|Σ|)' },
};
