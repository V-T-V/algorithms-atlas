import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'dp-number-of-music',
  categoryId: 'dp',
  title: { zh: '播放列表数', en: 'Number of Music Playlists' },
  summary: {
    zh: 'DP 计数：n 首歌、长 L 的播放列表，每首至少一次、间隔≥k。',
    en: 'DP counting: playlists of length L over n songs, each at least once, gap >= k.',
  },
  description: {
    zh: '你的音乐播放器有 n 首不同的歌，要生成一个长度为 goal 的播放列表，满足：(1) 每首歌至少出现一次；(2) 同一首歌的两次出现之间至少有 k 首不同的歌。求合法播放列表数（对 1e9+7 取模）。状态 dp[i][j] = 长度 i、已出现 j 首不同歌的方案数，转移分「第 i 首是新歌」与「是旧歌（只能选 j-k 首中之一）」两种。答案 dp[goal][n]。时间 O(goal·n)。',
    en: 'With n distinct songs, count length-goal playlists where every song appears at least once and two occurrences of the same song have at least k different songs between them (mod 1e9+7). State dp[i][j] = count for length i using j distinct songs, with transitions for adding a new song vs reusing an old one (only j-k eligible). Answer dp[goal][n]. Time O(goal·n).',
  },
  tags: ['dp', 'counting', 'combinatorics', 'modular', 'leetcode'],
  complexity: { time: 'O(goal·n)', space: 'O(goal·n)' },
};
