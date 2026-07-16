// Restore IP · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'restore-ip',
  categoryId: 'backtracking',
  title: { zh: '复原IP', en: 'Restore IP' },
  summary: {
    zh: '复原IP属于backtracking类别。',
    en: 'Restore IP is a backtracking algorithm.',
  },
  description: {
    zh: '复原IP（Restore IP）属于backtracking类别的算法。',
    en: 'Restore IP is an algorithm in the backtracking category.',
  },
  tags: ["backtracking"],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
