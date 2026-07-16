// 叶子序列相似v2 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'tree-leaf-similar-2',
  categoryId: 'tree',
  title: { zh: '叶子序列相似v2', en: 'Leaf-Similar v2' },
  summary: {
    zh: '判断两棵树叶子序列（左到右）是否相同。',
    en: 'Whether two trees share the same leaf sequence.',
  },
  description: { zh: '分别 DFS 收集叶子，比较。', en: 'Collect leaves of each, compare. O(n+m).' },
  tags: ['tree', 'leaf', 'compare'],
  complexity: { time: 'O(n+m)', space: 'O(h)' },
};
