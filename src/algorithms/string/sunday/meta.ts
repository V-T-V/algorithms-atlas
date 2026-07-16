// Sunday Match · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'sunday',
  categoryId: 'string',
  title: { zh: 'Sunday匹配', en: 'Sunday Match' },
  summary: {
    zh: 'Sunday匹配属于string类别。',
    en: 'Sunday Match is a string algorithm.',
  },
  description: {
    zh: 'Sunday匹配（Sunday Match）属于string类别的算法。',
    en: 'Sunday Match is an algorithm in the string category.',
  },
  tags: ["string"],
  complexity: { time: 'O(n/m) avg', space: 'O(|Σ|)' },
};
