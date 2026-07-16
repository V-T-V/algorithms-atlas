// Sprague-Grundy · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'sprague-grundy',
  categoryId: 'game',
  title: { zh: 'SG定理', en: 'Sprague-Grundy' },
  summary: {
    zh: 'SG定理属于game类别。',
    en: 'Sprague-Grundy is a game algorithm.',
  },
  description: {
    zh: 'SG定理（Sprague-Grundy）属于game类别的算法。',
    en: 'Sprague-Grundy is an algorithm in the game category.',
  },
  tags: ["game"],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
