// Digit DP · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'digit-dp',
  categoryId: 'dp',
  title: { zh: '数位 DP', en: 'Digit DP' },
  summary: {
    zh: '数位 DP属于dp类别。',
    en: 'Digit DP is a dp algorithm.',
  },
  description: {
    zh: '数位 DP（Digit DP）属于dp类别的算法。',
    en: 'Digit DP is an algorithm in the dp category.',
  },
  tags: ["dp","dynamic-programming"],
  complexity: { time: 'O(len · 2 · 2)', space: 'O(len · 2 · 2)' },
};
