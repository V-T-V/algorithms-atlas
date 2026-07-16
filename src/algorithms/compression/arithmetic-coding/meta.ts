// Arithmetic Coding · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'arithmetic-coding',
  categoryId: 'compression',
  title: { zh: '算术编码', en: 'Arithmetic Coding' },
  summary: {
    zh: '算术编码属于compression类别。',
    en: 'Arithmetic Coding is a compression algorithm.',
  },
  description: {
    zh: '算术编码（Arithmetic Coding）属于compression类别的算法。',
    en: 'Arithmetic Coding is an algorithm in the compression category.',
  },
  tags: ["compression"],
  complexity: { time: 'O(n)', space: 'O(alphabet)' },
};
