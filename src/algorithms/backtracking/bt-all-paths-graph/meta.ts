// 图所有路径 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'bt-all-paths-graph',
  categoryId: 'backtracking',
  title: { zh: '图所有路径', en: 'All Paths in Graph' },
  summary: {
    zh: '枚举图中从源到汇的所有简单路径。',
    en: 'All simple paths from source to sink in a graph.',
  },
  description: { zh: 'DFS 回溯，访问标记。', en: 'DFS backtrack with visited. O(2^V * V).' },
  tags: ['backtracking', 'graph'],
  complexity: { time: 'O(2^V * V)', space: 'O(V)' },
};
