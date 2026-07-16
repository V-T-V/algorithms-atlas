import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'dp-number-of-music-2',
  categoryId: 'dp',
  title: { zh: '播放列表方案数', en: 'Number of Music Playlists' },
  summary: {
    zh: 'n 首歌组播放列表长 goal，两首同歌间隔至少 k，求方案数取模。',
    en: 'Build a goal-length playlist from n songs with gap k between repeats; count mod 1e9+7.',
  },
  description: {
    zh: 'LeetCode 920。从 n 首不同歌中组成长 goal 的播放列表，每首歌至少播一次，且同一首歌再次出现中间至少隔 k 首不同的歌。求方案数 (mod 1e9+7)。DP：dp[i][j]=前 i 首用了 j 首不同歌的方案数。dp[i][j]=dp[i-1][j-1]*(n-(j-1))（新歌）+dp[i-1][j]*max(j-k,0)（重复）。答案 dp[goal][n]。时间 O(goal·n)，空间 O(n) 滚动。',
    en: 'LeetCode 920. DP dp[i][j]=ways for first i slots using j unique songs. New: dp[i-1][j-1]*(n-j+1); repeat: dp[i-1][j]*max(j-k,0). Answer dp[goal][n]. Time O(goal·n), space O(n).',
  },
  tags: ['dp', 'combinatorics', 'modulo', 'leetcode'],
  complexity: { time: 'O(goal·n)', space: 'O(n)' },
};
