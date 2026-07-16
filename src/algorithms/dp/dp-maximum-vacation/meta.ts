import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'dp-maximum-vacation',
  categoryId: 'dp',
  title: { zh: '最大休假天数', en: 'Maximum Vacation Days' },
  summary: {
    zh: 'n 城每周可飞，求 W 周内最大休假天数。',
    en: 'Fly between n cities each week to maximize vacation days over W weeks.',
  },
  description: {
    zh: 'LeetCode 568。n 个城市，flights[i][j]=1 表示周一可从 i 飞往 j（含停留原地），days[i][k] 表示在第 i 城第 k 周可休假天数。第 0 周从城市 0 出发，共 K 周，每周可飞一次（或停留），求最大休假天数。DP：dp[w][c] = 第 w 周身处城市 c 的最大休假；dp[w][c]=days[c][w]+max(dp[w-1][p] for p 可飞到 c)。时间 O(K·n²)，空间 O(K·n) 可压缩为 O(n)。',
    en: 'LeetCode 568. n cities, flights[i][j] allows flying i→j on Monday, days[i][k]=vacation at city i in week k. Start city 0, K weeks, one flight per week. dp[w][c]=days[c][w]+max(dp[w-1][p] for p that can reach c). Time O(K·n²), space O(n).',
  },
  tags: ['dp', 'leetcode'],
  complexity: { time: 'O(K·n²)', space: 'O(n)' },
};
