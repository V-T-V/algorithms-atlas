// SOS DP · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'sos-dp',
  categoryId: 'dp',
  title: { zh: '高维前缀和DP', en: 'SOS DP' },
  summary: {
    zh: '高维前缀和DP属于dp类别。',
    en: 'SOS DP is a dp algorithm.',
  },
  description: {
    zh: '高维前缀和DP（SOS DP）属于dp类别的算法。',
    en: 'SOS DP is an algorithm in the dp category.',
  },
  tags: ["dp","dynamic-programming"],
  complexity: { time: 'O(n·2ⁿ)', space: 'O(2ⁿ)' },
};
