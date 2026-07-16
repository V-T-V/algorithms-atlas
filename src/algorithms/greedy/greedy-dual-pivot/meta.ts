// 贪心双枢轴选择（Greedy Dual Pivot Pick）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'greedy-dual-pivot',
  categoryId: 'greedy',
  title: { zh: '贪心双枢轴选择', en: 'Greedy Dual Pivot Pick' },
  summary: {
    zh: '在两枢轴快速排序中贪心选取使分区最均衡的枢轴对。',
    en: 'In dual-pivot quicksort greedily pick the pivot pair giving the most balanced partition.',
  },
  description: {
    zh: '双枢轴快排：选两个枢轴 p1<p2，分为 <p1、(p1,p2)、>p2 三段。贪心选使三段大小方差最小的样本对。',
    en: 'Dual-pivot quicksort: pick p1<p2, split into <p1,(p1,p2),>p2. Greedily choose sample minimizing segment size variance.',
  },
  tags: ['greedy', 'quicksort', 'partition'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
