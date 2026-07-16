// 全排列 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'bt-permutations',
  categoryId: 'backtracking',
  title: { zh: '全排列', en: 'Permutations' },
  summary: { zh: '回溯枚举数组的所有全排列。', en: 'Backtracking to enumerate all permutations.' },
  description: { zh: '交换法或选入法回溯。', en: 'Swap or pick-backtrack. O(n*n!).' },
  tags: ['backtracking', 'permutation'],
  complexity: { time: 'O(n*n!)', space: 'O(n)' },
};
