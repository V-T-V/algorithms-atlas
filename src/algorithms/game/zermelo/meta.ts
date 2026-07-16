// Zermelo Theorem · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'zermelo',
  categoryId: 'game',
  title: { zh: '策梅洛定理', en: 'Zermelo Theorem' },
  summary: {
    zh: '策梅洛定理属于game类别。',
    en: 'Zermelo Theorem is a game algorithm.',
  },
  description: {
    zh: '策梅洛定理（Zermelo Theorem）属于game类别的算法。',
    en: 'Zermelo Theorem is an algorithm in the game category.',
  },
  tags: ["game"],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
