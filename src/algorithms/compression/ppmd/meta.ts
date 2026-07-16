// PPMd · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'ppmd',
  categoryId: 'compression',
  title: { zh: 'PPM编码', en: 'PPMd' },
  summary: {
    zh: 'PPM编码属于compression类别。',
    en: 'PPMd is a compression algorithm.',
  },
  description: {
    zh: 'PPM编码（PPMd）属于compression类别的算法。',
    en: 'PPMd is an algorithm in the compression category.',
  },
  tags: ["compression"],
  complexity: { time: 'O(N * order)', space: 'O(contexts)' },
};
