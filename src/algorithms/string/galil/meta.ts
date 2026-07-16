// Galil Match · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'galil',
  categoryId: 'string',
  title: { zh: 'Galil匹配', en: 'Galil Match' },
  summary: {
    zh: 'Galil匹配属于string类别。',
    en: 'Galil Match is a string algorithm.',
  },
  description: {
    zh: 'Galil匹配（Galil Match）属于string类别的算法。',
    en: 'Galil Match is an algorithm in the string category.',
  },
  tags: ["string"],
  complexity: { time: 'O(n+m)', space: 'O(m)' },
};
