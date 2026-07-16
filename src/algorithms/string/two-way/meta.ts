// Two Way Match · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'two-way',
  categoryId: 'string',
  title: { zh: '双向匹配', en: 'Two Way Match' },
  summary: {
    zh: '双向匹配属于string类别。',
    en: 'Two Way Match is a string algorithm.',
  },
  description: {
    zh: '双向匹配（Two Way Match）属于string类别的算法。',
    en: 'Two Way Match is an algorithm in the string category.',
  },
  tags: ["string"],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
