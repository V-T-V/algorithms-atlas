// String Runs · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'runs',
  categoryId: 'string',
  title: { zh: 'Runs（周期性极大区间）', en: 'String Runs' },
  summary: {
    zh: 'Runs（周期性极大区间）属于string类别。',
    en: 'String Runs is a string algorithm.',
  },
  description: {
    zh: 'Runs（周期性极大区间）（String Runs）属于string类别的算法。',
    en: 'String Runs is an algorithm in the string category.',
  },
  tags: ["string"],
  complexity: { time: 'O(n log n)', space: 'O(n)' },
};
