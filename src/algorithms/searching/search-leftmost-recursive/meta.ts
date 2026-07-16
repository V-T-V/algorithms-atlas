// 二分查找（递归最左） · 元数据
import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'search-leftmost-recursive',
  categoryId: 'searching',
  title: { zh: '二分查找（递归最左）', en: 'Binary Search (Recursive Leftmost)' },
  summary: {
    zh: '递归实现：找目标值最左一次出现的下标。',
    en: 'Recursive implementation: find the leftmost index of the target.',
  },
  description: {
    zh: '递归版最左二分查找：在 [lo, hi] 上递归，命中时不立即返回而是继续向左子区 [lo, mid-1] 搜索更左的命中，用候选变量记录。递归基 lo > hi 时返回候选。展示二分的递归写法，时间 O(log n)，空间 O(log n)（递归栈）。',
    en: 'Recursive leftmost binary search: recurse on [lo, hi]; on a hit do not return immediately but keep searching the left sub-range [lo, mid-1] for an earlier hit, recording candidates. The base case lo > hi returns the candidate. Demonstrates the recursive form. Time O(log n), space O(log n) (recursion stack).',
  },
  tags: ['searching', 'binary-search', 'recursive', 'leftmost'],
  complexity: { time: 'O(log n)', space: 'O(log n)' },
};
