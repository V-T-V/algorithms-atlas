// Knight Tour · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'knight-tour',
  categoryId: 'backtracking',
  title: { zh: '骑士巡游', en: 'Knight Tour' },
  summary: {
    zh: '骑士巡游属于backtracking类别。',
    en: 'Knight Tour is a backtracking algorithm.',
  },
  description: {
    zh: '骑士巡游（Knight Tour）属于backtracking类别的算法。',
    en: 'Knight Tour is an algorithm in the backtracking category.',
  },
  tags: ["backtracking"],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
