// 路径和2v2 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'tree-path-sum-all-2',
  categoryId: 'tree',
  title: { zh: '路径和2v2', en: 'Path Sum II v2' },
  summary: {
    zh: '收集所有节点值之和等于 target 的根到叶路径。',
    en: 'Collect all root-to-leaf paths summing to target.',
  },
  description: {
    zh: 'DFS 维护当前路径，到叶判断和。',
    en: 'DFS with current path; check sum at leaf. O(n^2).',
  },
  tags: ['tree', 'path-sum', 'dfs'],
  complexity: { time: 'O(n^2)', space: 'O(h)' },
};
