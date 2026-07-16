// Paint House · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'paint-house',
  categoryId: 'dp',
  title: { zh: '粉刷房子', en: 'Paint House' },
  summary: {
    zh: '粉刷房子属于dp类别。',
    en: 'Paint House is a dp algorithm.',
  },
  description: {
    zh: '粉刷房子（Paint House）属于dp类别的算法。',
    en: 'Paint House is an algorithm in the dp category.',
  },
  tags: ["dp"],
  complexity: { time: 'O(n·k)', space: 'O(n·k)' },
};
