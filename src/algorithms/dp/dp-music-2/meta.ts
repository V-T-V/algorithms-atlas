import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'dp-music-2',
  categoryId: 'dp',
  title: { zh: '歌单组合（恰好 K 首 N 分钟）', en: 'Playlist Combo (K songs, N minutes)' },
  summary: {
    zh: '从 n 首歌中选若干首拼成总长恰好 target 的歌单，每首最多用一次，求方案数。',
    en: 'Pick songs (0/1) to form a playlist of exact target length; count ways.',
  },
  description: {
    zh: '0/1 背包变体：dp[t] = 总长为 t 的方案数；倒序遍历 t=target..len：dp[t]+=dp[t-len]。最终 dp[target]。',
    en: '0/1 knapsack counting variant: dp[t]+=dp[t-len] for t=target..len. Return dp[target].',
  },
  tags: ['dp', 'knapsack', 'counting'],
  complexity: { time: 'O(n·target)', space: 'O(target)' },
};
