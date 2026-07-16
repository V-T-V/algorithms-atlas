// 最大路径和v2 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'tree-max-path-sum-2',
  categoryId: 'tree',
  title: { zh: '最大路径和v2', en: 'Max Path Sum v2' },
  summary: {
    zh: '求二叉树中任意节点到任意节点的最大路径和。',
    en: 'Maximum path sum between any two nodes.',
  },
  description: {
    zh: '后序：返回单臂最大和，更新 max(left+right+node)。',
    en: 'Post-order; arm gain, update best. O(n).',
  },
  tags: ['tree', 'path-sum', 'max'],
  complexity: { time: 'O(n)', space: 'O(h)' },
};
