// Minimum Enclosing Circle · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'min-enclosing-circle',
  categoryId: 'geometry',
  title: { zh: '最小覆盖圆', en: 'Minimum Enclosing Circle' },
  summary: {
    zh: '最小覆盖圆属于geometry类别。',
    en: 'Minimum Enclosing Circle is a geometry algorithm.',
  },
  description: {
    zh: '最小覆盖圆（Minimum Enclosing Circle）属于geometry类别的算法。',
    en: 'Minimum Enclosing Circle is an algorithm in the geometry category.',
  },
  tags: ["geometry"],
  complexity: { time: 'O(n) expected', space: 'O(n)' },
};
