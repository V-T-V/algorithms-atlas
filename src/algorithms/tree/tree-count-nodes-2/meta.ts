// 统计节点数v2 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'tree-count-nodes-2',
  categoryId: 'tree',
  title: { zh: '统计节点数v2', en: 'Count Nodes v2' },
  summary: { zh: '递归统计二叉树节点总数。', en: 'Recursively count total nodes.' },
  description: { zh: 'count = 1 + left + right。', en: 'count = 1 + left + right. O(n).' },
  tags: ['tree', 'count'],
  complexity: { time: 'O(n)', space: 'O(h)' },
};
