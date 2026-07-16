// Angle Sort · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'angle-sort',
  categoryId: 'geometry',
  title: { zh: '极角排序', en: 'Angle Sort' },
  summary: {
    zh: '极角排序属于geometry类别。',
    en: 'Angle Sort is a geometry algorithm.',
  },
  description: {
    zh: '极角排序（Angle Sort）属于geometry类别的算法。',
    en: 'Angle Sort is an algorithm in the geometry category.',
  },
  tags: ["geometry","sorting"],
  complexity: { time: 'O(n log n)', space: 'O(n)' },
};
