// Shunting Yard · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'shunting-yard',
  categoryId: 'parsing',
  title: { zh: '调度场算法', en: 'Shunting Yard' },
  summary: {
    zh: '调度场算法属于parsing类别。',
    en: 'Shunting Yard is a parsing algorithm.',
  },
  description: {
    zh: '调度场算法（Shunting Yard）属于parsing类别的算法。',
    en: 'Shunting Yard is an algorithm in the parsing category.',
  },
  tags: ["parsing"],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
