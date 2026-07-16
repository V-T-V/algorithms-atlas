// 第 k 小元素（排序） · 元数据
import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'search-kth-smallest',
  categoryId: 'searching',
  title: { zh: '第 k 小元素（排序）', en: 'K-th Smallest (Sort)' },
  summary: {
    zh: '排序后直接取第 k 小（下标 k-1）。',
    en: 'Sort then take the k-th smallest (index k-1).',
  },
  description: {
    zh: '第 k 小元素：简单实现是排序后取 arr[k-1]。本实现即此法，时间 O(n log n)，空间 O(n)。适合一次性查询；若需多次查询或在线，用快速选择 O(n) 平均或堆 O(n log k)。',
    en: 'K-th smallest: the simple approach is to sort and take arr[k-1]. This is that, time O(n log n), space O(n). Good for one-shot queries; for repeated or online queries use quickselect (average O(n)) or a heap (O(n log k)).',
  },
  tags: ['searching', 'selection', 'sort', 'order-statistic'],
  complexity: { time: 'O(n log n)', space: 'O(n)' },
};
