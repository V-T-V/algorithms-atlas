// Partition DP · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'partition',
  categoryId: 'dp',
  title: { zh: '划分DP', en: 'Partition DP' },
  summary: {
    zh: '划分DP属于dp类别。',
    en: 'Partition DP is a dp algorithm.',
  },
  description: {
    zh: '划分DP（Partition DP）属于dp类别的算法。',
    en: 'Partition DP is an algorithm in the dp category.',
  },
  tags: ["dp"],
  complexity: { time: 'O(n·target)', space: 'O(target)' },
};
