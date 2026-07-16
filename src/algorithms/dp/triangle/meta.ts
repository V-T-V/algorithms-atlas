// Triangle Path · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'triangle',
  categoryId: 'dp',
  title: { zh: '三角路径', en: 'Triangle Path' },
  summary: {
    zh: '三角路径属于dp类别。',
    en: 'Triangle Path is a dp algorithm.',
  },
  description: {
    zh: '三角路径（Triangle Path）属于dp类别的算法。',
    en: 'Triangle Path is an algorithm in the dp category.',
  },
  tags: ["dp"],
  complexity: { time: 'O(n²)', space: 'O(n²)' },
};
