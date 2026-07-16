import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'dp-stone-game-v',
  categoryId: 'dp',
  title: { zh: '石子游戏 V', en: 'Stone Game V' },
  summary: {
    zh: '沿一行石子切分，丢弃较大半，得分取较小半，递归求最大总分。',
    en: 'Split a row of stones; discard the heavier half, score the lighter, recurse for max total.',
  },
  description: {
    zh: 'LeetCode 1563。一行 n 堆石子（n 为偶数无强制要求），每堆 stoneValue[i]。每次选择一个分割点 k 把当前行 [i,j] 分成 [i,k] 与 [k+1,j]，比较两半前缀和：丢掉较大半，较小半的累加和计入得分；若相等保留左半继续。区间 DP：dp[i][j] = 在 [i,j] 上可得最大分；枚举切点，left=sum[i,k], right=sum[k+1,j]；若 left<right 得分=left+dp[i][k]，若 left>right 得分=right+dp[k+1][j]，若相等取两者较大。时间 O(n³)，空间 O(n²)。',
    en: 'LeetCode 1563. Split the current row [i,j] at k into [i,k] and [k+1,j]; discard the heavier half, score the lighter; recurse. Interval DP: dp[i][j]=max over splits of (lighter_sum + dp of kept half). Time O(n³), space O(n²).',
  },
  tags: ['dp', 'interval-dp', 'leetcode'],
  complexity: { time: 'O(n³)', space: 'O(n²)' },
};
