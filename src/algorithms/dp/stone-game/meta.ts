// Stone Game · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'stone-game',
  categoryId: 'dp',
  title: { zh: '取石子', en: 'Stone Game' },
  summary: {
    zh: '取石子属于dp类别。',
    en: 'Stone Game is a dp algorithm.',
  },
  description: {
    zh: '取石子（Stone Game）属于dp类别的算法。',
    en: 'Stone Game is an algorithm in the dp category.',
  },
  tags: ["dp","game-theory"],
  complexity: { time: 'O(n²)', space: 'O(n²)' },
};
