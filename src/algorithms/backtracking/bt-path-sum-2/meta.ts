// 路径总和II · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'bt-path-sum-2',
  categoryId: 'backtracking',
  title: { zh: '路径总和II', en: 'Path Sum II' },
  summary: {
    zh: '找二叉树中从根到叶和等于 target 的所有路径。',
    en: 'All root-to-leaf paths summing to target.',
  },
  description: { zh: 'DFS 回溯路径。', en: 'DFS with path backtrack. O(n).' },
  tags: ['backtracking', 'tree'],
  complexity: { time: 'O(n)', space: 'O(h)' },
};
