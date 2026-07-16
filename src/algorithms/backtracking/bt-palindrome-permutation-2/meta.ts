// 回文排列 II · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'bt-palindrome-permutation-2',
  categoryId: 'backtracking',
  title: { zh: '回文排列 II', en: 'Palindrome Permutation II' },
  summary: {
    zh: '回溯生成所有可重排成回文的字符串。',
    en: 'Backtracking to generate all palindromic permutations of a string.',
  },
  description: {
    zh: '先判可行性（奇数频字符 ≤1），取每个字母一半频数做半回文的全排列，中间放奇数字符。',
    en: 'Check feasibility first (≤1 odd-count char), then permute half-counts of letters, placing the odd char in the middle.',
  },
  tags: ['backtracking', 'palindrome', 'permutation'],
  complexity: { time: 'O((n/2)!)', space: 'O(n)' },
};
