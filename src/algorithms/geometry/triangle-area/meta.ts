// Triangle Area · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'triangle-area',
  categoryId: 'geometry',
  title: { zh: '三角形面积', en: 'Triangle Area' },
  summary: {
    zh: '三角形面积属于geometry类别。',
    en: 'Triangle Area is a geometry algorithm.',
  },
  description: {
    zh: '三角形面积（Triangle Area）属于geometry类别的算法。',
    en: 'Triangle Area is an algorithm in the geometry category.',
  },
  tags: ["geometry"],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
