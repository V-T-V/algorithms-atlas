// Delivery DP · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'dp-delivery',
  categoryId: 'dp',
  title: { zh: '快递员·区间 DP', en: 'Delivery Courier (Interval DP)' },
  summary: {
    zh: '快递员在数轴上送完所有点的最小路程（区间 DP）。',
    en: 'Min travel distance for a courier to deliver to all points on a line (interval DP).',
  },
  description: {
    zh: '数轴上有 n 个待送点（已排序），快递员从起点出发，需访问所有点。区间 DP：dp[i][j][side] 表示已处理区间 [i,j]、当前位于 i（左端）或 j（右端）时，把剩余点全部送完还需的最小路程。转移：在左端可去 i-1，在右端可去 j+1。时间 O(n²)。',
    en: 'n delivery points on a line (sorted); the courier starts at some point and must visit all. Interval DP: dp[i][j][side] = min remaining distance to finish when [i,j] is processed and we are at i (left) or j (right). From the left go to i-1, from the right go to j+1. Time O(n²).',
  },
  tags: ['dp', 'interval-dp', 'courier', 'optimization'],
  complexity: { time: 'O(n²)', space: 'O(n²)' },
};
