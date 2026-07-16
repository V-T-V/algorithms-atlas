// 最长同值路径v2 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'tree-longest-univalue-2',
  categoryId: 'tree',
  title: { zh: '最长同值路径v2', en: 'Longest Univalue Path v2' },
  summary: {
    zh: '求二叉树中节点值相同的最长路径边数。',
    en: 'Longest path (edges) where all nodes share the same value.',
  },
  description: {
    zh: '后序：左右单臂长度，若与父同值则 +1；更新 diameter。',
    en: 'Post-order; arm length +1 if matches parent. O(n).',
  },
  tags: ['tree', 'univalue', 'path'],
  complexity: { time: 'O(n)', space: 'O(h)' },
};
