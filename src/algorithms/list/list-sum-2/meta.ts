// 求和v2 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'list-sum-2',
  categoryId: 'list',
  title: { zh: '求和v2', en: 'Sum List v2' },
  summary: { zh: '遍历链表求所有节点值之和。', en: 'Sum all node values.' },
  description: { zh: '累加每个节点值。', en: 'Accumulate values. O(n), O(1).' },
  tags: ['list', 'sum'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
