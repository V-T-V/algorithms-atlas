// 耐心排序（多牌堆） · 元数据
import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'sort-patience-3',
  categoryId: 'sorting',
  title: { zh: '耐心排序（多牌堆）', en: 'Patience Sort (Multi-Pile)' },
  summary: {
    zh: '把元素按 patience 规则放入牌堆，再用最小堆合并各堆顶。',
    en: 'Deal elements into piles by patience rules, then merge pile tops via a min-heap.',
  },
  description: {
    zh: '耐心排序（Patience Sort）模拟纸牌游戏：依次取元素，放到「最左边堆顶 >= 该元素」的堆上（类似 patience 接龙），若没有则新开一堆；最后用 k 路归并（最小堆）合并所有堆顶。本实现用简单数组模拟堆，每次线性找最小堆顶。堆数 = 最长递增子序列长度。时间 O(n log n)，空间 O(n)。稳定。',
    en: 'Patience sort simulates a card solitaire: take each element and place it on the leftmost pile whose top is >= the element (like patience solitaire); if none, start a new pile; finally k-way merge (min-heap) all pile tops. This implementation simulates the heap with a simple array, linearly scanning for the smallest top each time. The number of piles equals the length of the longest increasing subsequence. Time O(n log n), space O(n). Stable.',
  },
  tags: ['sorting', 'comparison', 'stable', 'patience', 'merge'],
  complexity: { time: 'O(n log n)', space: 'O(n)' },
};
