// 美丽排列 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'bt-beautiful-arrange',
  categoryId: 'backtracking',
  title: { zh: '美丽排列', en: 'Beautiful Arrangement' },
  summary: {
    zh: '1..n 排列满足 perm[i] 整除 i 或 i 整除 perm[i] 的方案数。',
    en: 'Count permutations where perm[i] divides i or vice versa.',
  },
  description: { zh: '回溯逐位填数。', en: 'Backtrack position by position. O(k).' },
  tags: ['backtracking', 'permutation'],
  complexity: { time: 'O(k)', space: 'O(n)' },
};
