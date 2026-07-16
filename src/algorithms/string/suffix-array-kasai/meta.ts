// 后缀数组 + Kasai LCP · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'suffix-array-kasai',
  categoryId: 'string',
  title: { zh: '后缀数组 + Kasai LCP', en: 'Suffix Array + Kasai LCP' },
  summary: {
    zh: '构造后缀数组并用 Kasai 算法 O(n) 求相邻 LCP（高度数组）。',
    en: 'Build the suffix array and compute the LCP (height) array in O(n) via Kasai.',
  },
  description: {
    zh: '后缀数组 SA 把串 s 的所有后缀按字典序排序。Kasai 算法利用「rank 数组 + 按后缀起点递增扫描」在 O(n) 内求出 height[i] = LCP(s[SA[i-1]..], s[SA[i]..])。关键性质：若后缀 i 的 LCP 为 h，则后缀 i+1 的 LCP 至少为 max(0, h−1)，每步只需额外比较字符。本实现用朴素 O(n²log n) 构 SA（清晰易懂），Kasai 求 height。',
    en: 'The suffix array SA sorts all suffixes of s lexicographically. Kasai algorithm computes height[i] = LCP(s[SA[i-1]..], s[SA[i]..]) in O(n) using the rank array and scanning suffixes by increasing start, exploiting that if suffix i has LCP h then suffix i+1 has LCP at least max(0, h-1), so each step needs only extra character comparisons. This implementation builds SA with a simple O(n² log n) sort, then runs Kasai for height.',
  },
  tags: ['string', 'suffix-array', 'lcp', 'kasai'],
  complexity: { time: 'O(n² log n) 构 SA / O(n) LCP', space: 'O(n)' },
};
