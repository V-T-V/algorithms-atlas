// DEFLATE · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'deflate',
  categoryId: 'compression',
  title: { zh: 'Deflate算法', en: 'DEFLATE' },
  summary: {
    zh: 'Deflate算法属于compression类别。',
    en: 'DEFLATE is a compression algorithm.',
  },
  description: {
    zh: 'Deflate算法（DEFLATE）属于compression类别的算法。',
    en: 'DEFLATE is an algorithm in the compression category.',
  },
  tags: ["compression"],
  complexity: { time: 'O(n * W)', space: 'O(W)' },
};
