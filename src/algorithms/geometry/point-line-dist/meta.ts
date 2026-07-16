// Point-Line Distance · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'point-line-dist',
  categoryId: 'geometry',
  title: { zh: '点到直线距离', en: 'Point-Line Distance' },
  summary: {
    zh: '点到直线距离属于geometry类别。',
    en: 'Point-Line Distance is a geometry algorithm.',
  },
  description: {
    zh: '点到直线距离（Point-Line Distance）属于geometry类别的算法。',
    en: 'Point-Line Distance is an algorithm in the geometry category.',
  },
  tags: ["geometry"],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
