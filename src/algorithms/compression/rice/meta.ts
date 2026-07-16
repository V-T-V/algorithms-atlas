// Rice Coding · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'rice',
  categoryId: 'compression',
  title: { zh: 'Rice编码', en: 'Rice Coding' },
  summary: {
    zh: 'Rice编码属于compression类别。',
    en: 'Rice Coding is a compression algorithm.',
  },
  description: {
    zh: 'Rice编码（Rice Coding）属于compression类别的算法。',
    en: 'Rice Coding is an algorithm in the compression category.',
  },
  tags: ["compression"],
  complexity: { time: 'O(N)', space: 'O(1)' },
};
