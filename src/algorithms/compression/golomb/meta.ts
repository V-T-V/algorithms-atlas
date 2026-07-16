// Golomb Coding · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'golomb',
  categoryId: 'compression',
  title: { zh: 'Golomb编码', en: 'Golomb Coding' },
  summary: {
    zh: 'Golomb编码属于compression类别。',
    en: 'Golomb Coding is a compression algorithm.',
  },
  description: {
    zh: 'Golomb编码（Golomb Coding）属于compression类别的算法。',
    en: 'Golomb Coding is an algorithm in the compression category.',
  },
  tags: ["compression"],
  complexity: { time: 'O(N)', space: 'O(1)' },
};
