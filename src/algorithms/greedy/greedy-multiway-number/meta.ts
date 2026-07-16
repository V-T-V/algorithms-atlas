// 多路数字分配（Multiway Number Partition）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'greedy-multiway-number',
  categoryId: 'greedy',
  title: { zh: '多路数字分配', en: 'Multiway Number Partition' },
  summary: {
    zh: '把数分到 k 组使各组之和尽量均衡，贪心降序分配。',
    en: 'Partition numbers into k groups with balanced sums; greedy descending assignment.',
  },
  description: {
    zh: '多路划分：n 个数分 k 组，最小化最大组和。贪心：降序，每次放入当前和最小的组（即 LPT 推广）。',
    en: 'Multiway partition: n numbers into k groups minimizing the max group sum. Greedy: sort desc, place into min-sum group.',
  },
  tags: ['greedy', 'partition', 'approximation'],
  complexity: { time: 'O(n log n + n·k)', space: 'O(k)' },
};
