// 贪心找零验证（Greedy Coin Change Verification）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'greedy-coin-denom',
  categoryId: 'greedy',
  title: { zh: '贪心找零验证', en: 'Greedy Coin Change Verification' },
  summary: {
    zh: '检查硬币系统能否贪心求解，刻画 canonical 货币系统。',
    en: 'Verify whether a coin system admits greedy-optimal change; characterize canonical systems.',
  },
  description: {
    zh: '对硬币面额系统能否贪心：对每个 i，比较贪心解与最优解（DP）。若全相等则为 canonical，贪心保证最优。',
    en: 'Test if greedy coin change is optimal: for each coin i compare greedy vs DP optimal. Equal for all => canonical system.',
  },
  tags: ['greedy', 'coin-change', 'verification'],
  complexity: { time: 'O(n²)', space: 'O(n)' },
};
