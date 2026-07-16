// Edit Distance · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'edit-distance',
  categoryId: 'dp',
  title: { zh: '编辑距离', en: 'Edit Distance' },
  summary: {
    zh: '编辑距离属于dp类别。',
    en: 'Edit Distance is a dp algorithm.',
  },
  description: {
    zh: '编辑距离（Edit Distance）属于dp类别的算法。',
    en: 'Edit Distance is an algorithm in the dp category.',
  },
  tags: ["dp"],
  complexity: { time: 'O(m·n)', space: 'O(m·n)' },
};
