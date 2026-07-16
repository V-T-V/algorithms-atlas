// 第二小 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'sel-second-smallest',
  categoryId: 'selection',
  title: { zh: '第二小元素（锦标赛法）', en: 'Second Smallest (Tournament)' },
  summary: {
    zh: '锦标赛树找最小，再在其「败者」中找最小即第二小，n+log n-2 次比较。',
    en: 'Tournament tree finds the min, then the second smallest among its losers, in n+log n-2 comparisons.',
  },
  description: {
    zh: '锦标赛法：先构建胜者树找最小元素（n-1 次比较），最小元素沿路径击败了 ⌈log n⌉ 个对手，第二小必在这些对手中（再 ⌈log n⌉-1 次比较），总计 n+⌈log n⌉-2。',
    en: 'Tournament method: build a winner tree to find the minimum (n-1 comparisons); the min defeated ⌈log n⌉ opponents along the way, and the second smallest is the smallest of those (⌈log n⌉-1 more), total n+⌈log n⌉-2.',
  },
  tags: ['selection', 'tournament', 'second-smallest'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
