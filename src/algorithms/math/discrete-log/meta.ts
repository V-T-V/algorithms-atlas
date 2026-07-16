// Discrete Log · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'discrete-log',
  categoryId: 'math',
  title: { zh: '离散对数 BSGS', en: 'Discrete Log' },
  summary: {
    zh: '离散对数 BSGS属于math类别。',
    en: 'Discrete Log is a math algorithm.',
  },
  description: {
    zh: '离散对数 BSGS（Discrete Log）属于math类别的算法。',
    en: 'Discrete Log is an algorithm in the math category.',
  },
  tags: ["math"],
  complexity: { time: 'O(√m)', space: 'O(√m)' },
};
