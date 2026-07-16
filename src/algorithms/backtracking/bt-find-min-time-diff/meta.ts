// 排列求最小时间差 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'bt-find-min-time-diff',
  categoryId: 'backtracking',
  title: { zh: '排列求最小时间差', en: 'Min Time Difference via Permute' },
  summary: {
    zh: '通过回溯枚举排列求最小相邻时间差（演示用）。',
    en: 'Backtracking permutations to find min time difference (demo).',
  },
  description: {
    zh: '把时间转分钟，回溯全排列求最小相邻差。',
    en: 'Permute then min adjacent diff. O(n*n!).',
  },
  tags: ['backtracking', 'time'],
  complexity: { time: 'O(n*n!)', space: 'O(n)' },
};
