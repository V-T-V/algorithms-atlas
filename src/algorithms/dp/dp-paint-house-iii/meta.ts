import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'dp-paint-house-iii',
  categoryId: 'dp',
  title: { zh: '粉刷房子 III', en: 'Paint House III' },
  summary: {
    zh: '已有部分上色的 m 栋房，用 n 种色形成 target 个街区，求最小成本。',
    en: 'Paint m houses with n colors to form target neighborhoods at minimum cost.',
  },
  description: {
    zh: 'LeetCode 1473。m 栋房子排成一行，n 种颜色，部分已上色（houses[i]≠0 表示已固定颜色 i+1）。相邻同色属同一街区，需恰好形成 target 个街区。cost[i][j] 是把房子 i 刷成颜色 j+1 的成本（已上色房成本为 0 且不能改色）。三维 DP：dp[i][c][t] = 前 i+1 栋房、末栋颜色为 c、形成 t 个街区的最小成本；转移枚举前一栋颜色 prev 并比较是否新增街区。时间 O(m·n²·target)，空间 O(m·n·target)。',
    en: 'LeetCode 1473. m houses, n colors, some pre-colored; same-colored neighbors form one neighborhood; need exactly target neighborhoods; minimize cost. 3D DP: dp[i][c][t]=min cost where house i has color c forming t neighborhoods. Time O(m·n²·target), space O(m·n·target).',
  },
  tags: ['dp', 'state-machine', 'leetcode'],
  complexity: { time: 'O(m·n²·target)', space: 'O(m·n·target)' },
};
