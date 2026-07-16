// 最长快乐前缀 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'longest-happy-prefix',
  categoryId: 'string',
  title: { zh: '最长快乐前缀', en: 'Longest Happy Prefix' },
  summary: {
    zh: '求既是真前缀又是真后缀的最长子串（即 KMP 的 lps[n-1]）。',
    en: 'Find the longest substring that is both a proper prefix and a proper suffix (i.e., KMP lps[n-1]).',
  },
  description: {
    zh: '「快乐前缀」定义为：原串的某个真前缀，同时也是原串的真后缀，且长度严格小于原串。等价于对原串做 KMP 失败函数后取 lps[n-1]。本实现用 KMP 预处理 O(n) 求出整个 lps 数组，并返回最末位即答案（同时给出该前缀串）。零 DOM 依赖。',
    en: 'A happy prefix is a proper prefix of the string that is also a proper suffix (length strictly less than the string). Equivalent to lps[n-1] from KMP preprocessing. This computes the full lps array in O(n) and returns the last value (and the corresponding prefix string). Zero DOM dependency.',
  },
  tags: ['string', 'prefix', 'suffix', 'kmp', 'lps'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
