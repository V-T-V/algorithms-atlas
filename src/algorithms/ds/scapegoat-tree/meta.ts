// Scapegoat Tree · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'scapegoat-tree',
  categoryId: 'ds',
  title: { zh: '替罪羊树', en: 'Scapegoat Tree' },
  summary: {
    zh: '替罪羊树属于ds类别。',
    en: 'Scapegoat Tree is a ds algorithm.',
  },
  description: {
    zh: '替罪羊树（Scapegoat Tree）属于ds类别的算法。',
    en: 'Scapegoat Tree is an algorithm in the ds category.',
  },
  tags: ["ds","tree"],
  complexity: { time: 'O(log n)', space: 'O(n)' },
};
