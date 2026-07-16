// 完全二叉树判断 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'tree-balance-check-2',
  categoryId: 'tree',
  title: { zh: '完全二叉树判断', en: 'Is Complete Tree' },
  summary: { zh: '判断二叉树是否为完全二叉树。', en: 'Check if a binary tree is complete.' },
  description: {
    zh: 'BFS：遇到空节点后不应再有非空节点。',
    en: 'BFS; once null seen, no non-null allowed after. O(n).',
  },
  tags: ['tree', 'complete', 'bfs'],
  complexity: { time: 'O(n)', space: 'O(w)' },
};
