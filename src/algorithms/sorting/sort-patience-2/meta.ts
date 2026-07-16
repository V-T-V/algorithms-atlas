// 耐心排序变种（栈式合并）· 元数据
import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'sort-patience-2',
  categoryId: 'sorting',
  title: { zh: '耐心排序变种（栈式合并）', en: 'Patience Sort (Stack-Merge Variant)' },
  summary: {
    zh: '把元素逐个放到「牌堆顶」上，再对各牌堆做 k 路归并得到有序序列。',
    en: 'Deal elements onto card piles, then k-way merge the piles to produce the sorted output.',
  },
  description: {
    zh: '耐心排序（Patience Sort）模拟纸牌游戏「耐心」。每个元素放到「最左一个能放（顶牌 ≥ 该元素）」的牌堆；若无则开新堆。所有元素入堆后，对堆顶做 k 路归并得到升序序列。本变种用最小堆管理各堆顶实现高效归并。它同时可求最长递增子序列（LIS）的长度（=堆数）。稳定，额外空间 O(n)。',
    en: 'Patience Sort simulates the card game "patience". Each element is placed on the leftmost pile whose top is ≥ the element; if none, a new pile is opened. After dealing, a k-way merge of pile tops yields ascending order. This variant manages pile tops with a min-heap for efficient merging. It also yields the LIS length (= number of piles). Stable, O(n) extra space.',
  },
  tags: ['sorting', 'patience', 'merge', 'lis'],
  complexity: { time: 'O(n log n)', space: 'O(n)' },
};
