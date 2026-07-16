// 兄弟判断v2 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'tree-cousins-2',
  categoryId: 'tree',
  title: { zh: '兄弟判断v2', en: 'Are Cousins v2' },
  summary: {
    zh: '判断两节点是否同层但不同父（cousins）。',
    en: 'Check if two nodes are same depth but different parent.',
  },
  description: {
    zh: 'BFS 记录每个节点的深度与父节点。',
    en: 'BFS tracking depth and parent. O(n).',
  },
  tags: ['tree', 'cousins', 'bfs'],
  complexity: { time: 'O(n)', space: 'O(w)' },
};
