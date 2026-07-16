// Order Statistics · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'order-statistics',
  categoryId: 'selection',
  title: { zh: '顺序统计量', en: 'Order Statistics' },
  summary: {
    zh: '顺序统计量属于selection类别。',
    en: 'Order Statistics is a selection algorithm.',
  },
  description: {
    zh: '顺序统计量（Order Statistics）属于selection类别的算法。',
    en: 'Order Statistics is an algorithm in the selection category.',
  },
  tags: ["selection","sorting"],
  complexity: { time: 'O(n)', space: 'O(log n)' },
};
