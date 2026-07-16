// 最小深度v2 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'tree-min-depth-2',
  categoryId: 'tree',
  title: { zh: '最小深度v2', en: 'Minimum Depth v2' },
  summary: { zh: '求根到最近叶子的最短路径长度。', en: 'Shortest root-to-leaf path length.' },
  description: {
    zh: '递归：若某子为空则取另一子（避免把单侧空当叶子）。',
    en: 'If one side empty, take the other. O(n).',
  },
  tags: ['tree', 'depth', 'dfs'],
  complexity: { time: 'O(n)', space: 'O(h)' },
};
