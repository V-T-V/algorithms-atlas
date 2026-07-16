// Dice Roll DP · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'dp-dice-roll',
  categoryId: 'dp',
  title: { zh: '掷骰子 DP', en: 'Dice Roll DP' },
  summary: {
    zh: '用 m 面骰子掷出总和为 n 的方法数。',
    en: 'Number of ways to roll sum n with an m-faced die.',
  },
  description: {
    zh: '一个有 m 个面（点数 1..m）的骰子，掷 k 次，求总点数恰为 n 的方案数。dp[i][s] = 前 i 次掷出总和 s 的方案数，dp[i][s] = sum_{f=1..m} dp[i-1][s-f]。可滚动数组优化空间到 O(n)。本实现给二维表便于可视化，时间 O(k·n·m)。',
    en: 'An m-faced die (values 1..m) rolled k times; count ways to reach total sum n. dp[i][s] = sum_{f=1..m} dp[i-1][s-f]. Roll the array for O(n) space. We use a 2D table for visualization; time O(k·n·m).',
  },
  tags: ['dp', 'dice', 'counting', 'probability'],
  complexity: { time: 'O(k·n·m)', space: 'O(k·n)' },
};
