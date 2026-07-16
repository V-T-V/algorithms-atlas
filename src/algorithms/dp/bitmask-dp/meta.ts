// Bitmask DP (Traveling Salesman) · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'bitmask-dp',
  categoryId: 'dp',
  title: { zh: '状压 DP（TSP 旅行商）', en: 'Bitmask DP (Traveling Salesman)' },
  summary: {
    zh: '状压 DP（TSP 旅行商）属于dp类别。',
    en: 'Bitmask DP (Traveling Salesman) is a dp algorithm.',
  },
  description: {
    zh: '状压 DP（TSP 旅行商）（Bitmask DP (Traveling Salesman)）属于dp类别的算法。',
    en: 'Bitmask DP (Traveling Salesman) is an algorithm in the dp category.',
  },
  tags: ["dp","dynamic-programming","bit-manipulation"],
  complexity: { time: 'O(2ⁿ·n²)', space: 'O(2ⁿ·n)' },
};
