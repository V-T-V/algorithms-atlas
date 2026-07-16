// Binary Lifting · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'binary-lifting',
  categoryId: 'design',
  title: { zh: '倍增', en: 'Binary Lifting' },
  summary: {
    zh: '倍增属于design类别。',
    en: 'Binary Lifting is a design algorithm.',
  },
  description: {
    zh: '倍增（Binary Lifting）属于design类别的算法。',
    en: 'Binary Lifting is an algorithm in the design category.',
  },
  tags: ["design"],
  complexity: { time: 'O(n log n) 预处理 / O(log n) 查询', space: 'O(n log n)' },
};
