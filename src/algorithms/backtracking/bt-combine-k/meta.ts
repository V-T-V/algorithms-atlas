// C(n,k) 组合 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'bt-combine-k',
  categoryId: 'backtracking',
  title: { zh: '组合 C(n,k)', en: 'Combinations C(n,k)' },
  summary: {
    zh: '回溯枚举从 1..n 中选出 k 个的所有组合。',
    en: 'Backtrack to list all k-element combinations chosen from 1..n.',
  },
  description: {
    zh: '按起点递增回溯，每个位置选一个大于前一个的数，达到 k 个时收集。',
    en: 'Backtrack with an increasing start index; collect a combination once its size reaches k.',
  },
  tags: ['backtracking', 'combination'],
  complexity: { time: 'O(C(n,k))', space: 'O(k)' },
};
