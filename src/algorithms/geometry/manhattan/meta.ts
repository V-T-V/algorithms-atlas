// Manhattan Distance · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'manhattan',
  categoryId: 'geometry',
  title: { zh: '曼哈顿距离', en: 'Manhattan Distance' },
  summary: {
    zh: '曼哈顿距离属于geometry类别。',
    en: 'Manhattan Distance is a geometry algorithm.',
  },
  description: {
    zh: '曼哈顿距离（Manhattan Distance）属于geometry类别的算法。',
    en: 'Manhattan Distance is an algorithm in the geometry category.',
  },
  tags: ["geometry"],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
