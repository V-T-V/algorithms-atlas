// 第二小值v2 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'tree-second-min-2',
  categoryId: 'tree',
  title: { zh: '第二小值v2', en: 'Second Minimum Node v2' },
  summary: {
    zh: '在特殊二叉树（每个节点值=子节点最小值）中找严格第二小值。',
    en: 'Find the strictly second minimum value in such a tree.',
  },
  description: {
    zh: '递归：根值即最小；找比根大的最小值。',
    en: 'Recurse; find smallest value > root. O(n).',
  },
  tags: ['tree', 'second-min'],
  complexity: { time: 'O(n)', space: 'O(h)' },
};
