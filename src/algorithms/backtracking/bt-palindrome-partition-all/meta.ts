// 所有回文分割 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'bt-palindrome-partition-all',
  categoryId: 'backtracking',
  title: { zh: '所有回文分割', en: 'All Palindrome Partitions' },
  summary: {
    zh: '回溯枚举每个回文前缀，递归剩余后缀，列出所有分割方案。',
    en: 'Backtrack over palindromic prefixes, recurse on the rest, list all partitions.',
  },
  description: {
    zh: '从起点枚举所有回文子串作为一段，递归处理剩余部分，到末尾时收集一组方案。',
    en: 'Enumerate each palindromic substring starting at current index as one segment, recurse on the remainder, collect a scheme when reaching the end.',
  },
  tags: ['backtracking', 'palindrome', 'partition'],
  complexity: { time: 'O(n · 2^n)', space: 'O(n)' },
};
