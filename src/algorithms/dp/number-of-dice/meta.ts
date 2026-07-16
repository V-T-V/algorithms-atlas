// Dice Sum · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'number-of-dice',
  categoryId: 'dp',
  title: { zh: '骰子求和', en: 'Dice Sum' },
  summary: {
    zh: '骰子求和属于dp类别。',
    en: 'Dice Sum is a dp algorithm.',
  },
  description: {
    zh: '骰子求和（Dice Sum）属于dp类别的算法。',
    en: 'Dice Sum is an algorithm in the dp category.',
  },
  tags: ["dp"],
  complexity: { time: 'O(n·target·faces)', space: 'O(target)' },
};
