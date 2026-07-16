// Burrows-Wheeler Transform · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'bwt',
  categoryId: 'compression',
  title: { zh: 'BWT变换', en: 'Burrows-Wheeler Transform' },
  summary: {
    zh: 'BWT变换属于compression类别。',
    en: 'Burrows-Wheeler Transform is a compression algorithm.',
  },
  description: {
    zh: 'BWT变换（Burrows-Wheeler Transform）属于compression类别的算法。',
    en: 'Burrows-Wheeler Transform is an algorithm in the compression category.',
  },
  tags: ["compression"],
  complexity: { time: 'O(n log n)', space: 'O(n^2)' },
};
