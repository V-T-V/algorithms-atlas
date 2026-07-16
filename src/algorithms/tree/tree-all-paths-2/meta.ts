// 所有路径v2 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'tree-all-paths-2',
  categoryId: 'tree',
  title: { zh: '所有路径v2', en: 'All Root-to-Leaf Paths v2' },
  summary: { zh: '收集所有根到叶路径。', en: 'Collect every root-to-leaf path.' },
  description: {
    zh: 'DFS 维护当前路径，到叶时拷贝入结果。',
    en: 'DFS, push a copy at each leaf. O(n^2) worst.',
  },
  tags: ['tree', 'paths', 'dfs'],
  complexity: { time: 'O(n^2)', space: 'O(h)' },
};
