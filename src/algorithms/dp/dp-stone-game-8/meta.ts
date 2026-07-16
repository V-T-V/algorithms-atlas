import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'dp-stone-game-8',
  categoryId: 'dp',
  title: { zh: '石子游戏 VIII', en: 'Stone Game VIII' },
  summary: {
    zh: '取前若干块石子合并到首位，得分等于新首位，求先手最优分差。',
    en: 'Merge a chosen prefix into the first stone; gain the new first value; find optimal score difference.',
  },
  description: {
    zh: 'LeetCode 1872。n 块石子 values[i]。操作：选择 i≥1（0-based），把 values[0..i] 合并成一块放首位，得分=新首位=prefix[i]。当只剩一块时结束。Alice 先手，两人最优，求 Alice-Bob 分差。设 prefix[i]=values[0..i] 之和。dp[i]=从「首位已是 prefix[i]、剩余 values[i+1..n-1]」状态出发的最大分差；转移 dp[i]=max(dp[i+1], prefix[i]-dp[i+1])，含义为「跳过」或「本轮取 i 后交棒」。初值 dp[n-1]=prefix[n-1]（注：首位已就绪，但若游戏到此只剩一块则实为 0，故当 n==1 时答案为 0）。第一次必须取至少两块，故答案=dp[1]。时间 O(n)，空间 O(n)。',
    en: 'LeetCode 1872. Pick i>=1, merge values[0..i] into first stone, score=prefix[i]. Let prefix[i]=sum(values[0..i]). dp[i]=max(dp[i+1], prefix[i]-dp[i+1]); dp[n-1]=prefix[n-1]; answer dp[1] (first move must take >=2 stones). Time O(n), space O(n).',
  },
  tags: ['dp', 'prefix-sum', 'game', 'leetcode'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
