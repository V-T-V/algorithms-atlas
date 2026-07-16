// 完全平方数拆分 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'bt-num-squares',
  categoryId: 'backtracking',
  title: { zh: '完全平方数拆分', en: 'Perfect Squares (Backtrack)' },
  summary: {
    zh: '回溯+剪枝把 n 拆成最少完全平方数之和。',
    en: 'Min perfect squares summing to n (backtrack).',
  },
  description: { zh: '从大到小试平方数。', en: 'Try squares descending. O(√n^depth).' },
  tags: ['backtracking', 'math'],
  complexity: { time: 'O(√n^depth)', space: 'O(√n)' },
};
