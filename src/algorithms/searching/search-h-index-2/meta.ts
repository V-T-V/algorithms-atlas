// H 指数 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'search-h-index-2',
  categoryId: 'searching',
  title: { zh: 'H 指数', en: 'H-Index' },
  summary: {
    zh: '排序后线性找最大的 h 使至少 h 篇论文引用 >= h。',
    en: 'Sort then linearly find the largest h with at least h papers having >= h citations.',
  },
  description: {
    zh: 'H 指数：研究者有 n 篇论文，各篇引用数为 citations[i]，h 指数是最大的 h 使得至少 h 篇论文引用数 >= h。本实现先降序排序，再线性找最大的 i 使 citations[i] >= i+1，返回该 i+1。时间 O(n log n)（排序主导），空间 O(1)（原地排序副本）。LeetCode 274。',
    en: 'H-index: a researcher has n papers with citations[i] citations each; the h-index is the largest h such that at least h papers have >= h citations. This implementation sorts descending then linearly finds the largest i with citations[i] >= i+1, returning i+1. Time O(n log n) (sort dominated), space O(1) (in-place on a copy). LeetCode 274.',
  },
  tags: ['searching', 'h-index', 'sort', 'linear'],
  complexity: { time: 'O(n log n)', space: 'O(1)' },
};
