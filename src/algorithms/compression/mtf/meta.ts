// Move-To-Front · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'mtf',
  categoryId: 'compression',
  title: { zh: 'MTF变换', en: 'Move-To-Front' },
  summary: {
    zh: 'MTF变换属于compression类别。',
    en: 'Move-To-Front is a compression algorithm.',
  },
  description: {
    zh: 'MTF变换（Move-To-Front）属于compression类别的算法。',
    en: 'Move-To-Front is an algorithm in the compression category.',
  },
  tags: ["compression"],
  complexity: { time: 'O(n * |Σ|)', space: 'O(|Σ|)' },
};
