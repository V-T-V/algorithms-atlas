// Max Rectangle · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'max-rectangle',
  categoryId: 'dp',
  title: { zh: '最大矩形', en: 'Max Rectangle' },
  summary: {
    zh: '最大矩形属于dp类别。',
    en: 'Max Rectangle is a dp algorithm.',
  },
  description: {
    zh: '最大矩形（Max Rectangle）属于dp类别的算法。',
    en: 'Max Rectangle is an algorithm in the dp category.',
  },
  tags: ["dp"],
  complexity: { time: 'O(m·n)', space: 'O(n)' },
};
