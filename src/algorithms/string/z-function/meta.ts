// Z-Function · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'z-function',
  categoryId: 'string',
  title: { zh: 'Z 函数', en: 'Z-Function' },
  summary: {
    zh: 'Z 函数属于string类别。',
    en: 'Z-Function is a string algorithm.',
  },
  description: {
    zh: 'Z 函数（Z-Function）属于string类别的算法。',
    en: 'Z-Function is an algorithm in the string category.',
  },
  tags: ["string"],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
