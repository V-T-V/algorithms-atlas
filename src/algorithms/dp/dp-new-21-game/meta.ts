import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'dp-new-21-game',
  categoryId: 'dp',
  title: { zh: '新 21 点', en: 'New 21 Game' },
  summary: {
    zh: '概率 DP：抽 1..W 累分，停手后分数 ≤ N 的概率。',
    en: 'Probability DP: drawing 1..W until threshold, find P(final score <= N).',
  },
  description: {
    zh: 'Alice 从分数 0 开始。当分数小于 K 时，她等概率地抽取 1 到 W 的整数加到分数上；当分数达到或超过 K 时停止抽取。求她最终分数不超过 N 的概率。状态 dp[x] = 从分数 x 开始最终不超过 N 的概率。对 x>=K，dp[x] = x<=N ? 1 : 0；对 x<K，dp[x] = (dp[x+1]+...+dp[x+W])/W。从 K-1 倒推到 0，用滑动窗口维护分子之和，时间 O(K+W)。',
    en: 'Alice starts at score 0; while her score is below K she draws a uniform integer from 1..W, stopping once it reaches or exceeds K. Find the probability her final score is at most N. State dp[x] = probability that starting from x the final score is <= N. For x>=K, dp[x] = x<=N ? 1 : 0; for x<K, dp[x] = (dp[x+1]+...+dp[x+W])/W. Computing backwards from K-1 to 0 with a sliding window sum gives time O(K+W).',
  },
  tags: ['dp', 'probability', 'sliding-window', 'leetcode'],
  complexity: { time: 'O(K+W)', space: 'O(K+W)' },
};
