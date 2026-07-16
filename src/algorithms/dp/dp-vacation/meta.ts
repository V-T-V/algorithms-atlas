import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'dp-vacation',
  categoryId: 'dp',
  title: { zh: '度假 DP', en: 'Vacation DP' },
  summary: {
    zh: '每天三选一，相邻天不重复，求最大总幸福度。',
    en: 'Pick one of three activities each day, no repeats on consecutive days; maximize happiness.',
  },
  description: {
    zh: '有 n 天假期，每天可在三项活动（如游泳、捕虫、写作业）中选一项，相邻两天不能选相同活动。每项活动每天有给定的幸福度 h[i][j]。求能获得的最大总幸福度。状态 dp[i][j] = 第 i 天选活动 j 时前 i 天的最大总幸福度，转移 dp[i][j] = h[i][j] + max_{k≠j} dp[i-1][k]。回溯得到活动方案。时间 O(n·m²)。',
    en: 'Over n vacation days, choose one of three activities each day; the same activity cannot be chosen on two consecutive days. Each activity has a given happiness value per day. State dp[i][j] = max total happiness for the first i days when day i uses activity j, transition dp[i][j] = h[i][j] + max_{k!=j} dp[i-1][k]. Backtracking recovers the plan. Time O(n·m²).',
  },
  tags: ['dp', 'linear', 'optimization'],
  complexity: { time: 'O(n·m²)', space: 'O(n·m)' },
};
