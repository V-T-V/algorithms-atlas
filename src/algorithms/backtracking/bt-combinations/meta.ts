// 组合 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'bt-combinations',
  categoryId: 'backtracking',
  title: { zh: '组合', en: 'Combinations' },
  summary: { zh: '枚举 1..n 中选 k 个的所有组合。', en: 'All k-combinations of 1..n.' },
  description: {
    zh: '回溯选/不选或递增起点法。',
    en: 'Backtrack with increasing start. O(C(n,k)).',
  },
  tags: ['backtracking', 'combination'],
  complexity: { time: 'O(C(n,k))', space: 'O(k)' },
};
