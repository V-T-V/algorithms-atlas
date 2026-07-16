// 路径和v2 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'tree-path-sum-2',
  categoryId: 'tree',
  title: { zh: '路径和v2', en: 'Path Sum v2' },
  summary: {
    zh: '判断是否存在根到叶路径，节点值之和等于 target。',
    en: 'Whether a root-to-leaf path sums to target.',
  },
  description: {
    zh: '递归减去当前值，到叶时判断剩余是否为 0。',
    en: 'Subtract node value; at leaf check remainder==0. O(n).',
  },
  tags: ['tree', 'path-sum', 'dfs'],
  complexity: { time: 'O(n)', space: 'O(h)' },
};
