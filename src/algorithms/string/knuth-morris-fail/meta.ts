// KMP 失败指针（LPS 数组）构建 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'knuth-morris-fail',
  categoryId: 'string',
  title: {
    zh: 'KMP 失败指针（LPS / next 数组）构建',
    en: 'KMP Failure Function (LPS / next Array)',
  },
  summary: {
    zh: 'Knuth-Morris-Pratt 的预处理：求模式串每个前缀的最长真前后缀长度。',
    en: 'Knuth-Morris-Pratt preprocessing: longest proper prefix-suffix length for every prefix of the pattern.',
  },
  description: {
    zh: 'KMP 算法的关键预处理步骤：对模式串 pat 计算 lps[]（也称 next/failure 数组），其中 lps[i] 表示 pat[0..i] 的最长「真前缀 = 真后缀」长度。本实现聚焦 lps 数组的构造过程（双指针 i/j 的推进与回退），是 KMP 算法的核心。区别于已有的 kmp（含完整匹配阶段），本算法只做预处理阶段，便于教学与可视化「失败指针」的含义。',
    en: 'The key preprocessing of KMP: compute lps[] (aka next/failure array) where lps[i] is the longest proper prefix that is also a suffix of pat[0..i]. This focuses on the construction (two pointers i/j advancing and retreating), the core of KMP. Distinct from the existing kmp (with full matching phase), this isolates the preprocessing for teaching the failure function.',
  },
  tags: ['string', 'kmp', 'lps', 'failure-function', 'preprocessing'],
  complexity: { time: 'O(m)', space: 'O(m)' },
};
