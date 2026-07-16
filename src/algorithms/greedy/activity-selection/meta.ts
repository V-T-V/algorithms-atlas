// Activity Selection · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'activity-selection',
  categoryId: 'greedy',
  title: { zh: '活动选择', en: 'Activity Selection' },
  summary: {
    zh: '活动选择属于greedy类别。',
    en: 'Activity Selection is a greedy algorithm.',
  },
  description: {
    zh: '活动选择（Activity Selection）属于greedy类别的算法。',
    en: 'Activity Selection is an algorithm in the greedy category.',
  },
  tags: ["greedy","sorting"],
  complexity: { time: 'O(n log n)', space: 'O(n)' },
};
