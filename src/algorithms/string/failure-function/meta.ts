// Failure Function · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'failure-function',
  categoryId: 'string',
  title: { zh: '失配函数', en: 'Failure Function' },
  summary: {
    zh: '失配函数属于string类别。',
    en: 'Failure Function is a string algorithm.',
  },
  description: {
    zh: '失配函数（Failure Function）属于string类别的算法。',
    en: 'Failure Function is an algorithm in the string category.',
  },
  tags: ["string"],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
