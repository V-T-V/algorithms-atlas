// 删除等于x · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'list-delete-val-2',
  categoryId: 'list',
  title: { zh: '删除等于x', en: 'Remove Elements by Value' },
  summary: { zh: '删除链表中所有值等于 x 的节点。', en: 'Remove all nodes whose value equals x.' },
  description: {
    zh: '用 dummy 头简化头删，遍历跳过目标值。',
    en: 'Dummy head; skip nodes matching x. O(n), O(1).',
  },
  tags: ['list', 'remove', 'filter'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
