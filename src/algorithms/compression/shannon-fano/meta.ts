// Shannon-Fano · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'shannon-fano',
  categoryId: 'compression',
  title: { zh: '香农-范诺编码', en: 'Shannon-Fano' },
  summary: {
    zh: '香农-范诺编码属于compression类别。',
    en: 'Shannon-Fano is a compression algorithm.',
  },
  description: {
    zh: '香农-范诺编码（Shannon-Fano）属于compression类别的算法。',
    en: 'Shannon-Fano is an algorithm in the compression category.',
  },
  tags: ["compression","cryptography"],
  complexity: { time: 'O(n log n)', space: 'O(n)' },
};
