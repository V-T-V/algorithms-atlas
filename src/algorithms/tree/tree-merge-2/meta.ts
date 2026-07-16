// 合并二叉树v2 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'tree-merge-2',
  categoryId: 'tree',
  title: { zh: '合并二叉树v2', en: 'Merge Two Binary Trees v2' },
  summary: {
    zh: '把两棵二叉树同位置节点值相加合并。',
    en: 'Overlay two binary trees, summing overlapping nodes.',
  },
  description: {
    zh: '同步递归：都存在则相加，否则取存在的一边。',
    en: 'Recurse in parallel, sum when both present. O(n).',
  },
  tags: ['tree', 'merge'],
  complexity: { time: 'O(n)', space: 'O(h)' },
};
