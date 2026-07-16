import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'dp-ones-and-zeros',
  categoryId: 'dp',
  title: { zh: '一和零', en: 'Ones and Zeroes' },
  summary: {
    zh: '二维 0/1 背包：用 m 个 0、n 个 1 最多拼出多少个字符串。',
    en: '2D 0/1 knapsack: form as many strings as possible with m zeros and n ones.',
  },
  description: {
    zh: '给定字符串数组 strs，每个串由 0 和 1 组成。你最多能使用 m 个 0 和 n 个 1，求最多能选出多少个字符串（每个串最多用一次）。这是二维 0/1 背包：状态 dp[j][k] 表示用 j 个 0、k 个 1 时的最大子集大小，对每串倒序更新 dp[j][k] = max(dp[j][k], dp[j-zeros][k-ones] + 1)。时间 O(l·m·n + L)，L 为字符总数。',
    en: 'Given an array of binary strings, with at most m zeros and n ones available, choose the largest subset of strings (each used at most once). This is a 2D 0/1 knapsack: state dp[j][k] = max subset size using j zeros and k ones, updated in reverse as dp[j][k] = max(dp[j][k], dp[j-zeros][k-ones] + 1). Time O(l·m·n + L).',
  },
  tags: ['dp', 'knapsack', '2d', 'leetcode'],
  complexity: { time: 'O(l·m·n)', space: 'O(m·n)' },
};
