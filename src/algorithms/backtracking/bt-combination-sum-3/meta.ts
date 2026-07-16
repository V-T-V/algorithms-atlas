// 组合总和III · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'bt-combination-sum-3',
  categoryId: 'backtracking',
  title: { zh: '组合总和III', en: 'Combination Sum III' },
  summary: {
    zh: '从 1-9 选 k 个不同数使和为 n。',
    en: 'Pick k distinct numbers from 1-9 summing to n.',
  },
  description: { zh: '回溯，k 个数的组合。', en: 'Backtrack k-length combos. O(C(9,k)).' },
  tags: ['backtracking', 'combination'],
  complexity: { time: 'O(C(9,k))', space: 'O(k)' },
};
