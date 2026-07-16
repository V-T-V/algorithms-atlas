// Remove Linked List Elements · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'list-remove-elements',
  categoryId: 'list',
  title: { zh: '移除链表元素', en: 'Remove Linked List Elements' },
  summary: {
    zh: '删除链表中所有等于给定值的节点。',
    en: 'Delete all nodes whose value equals the given target.',
  },
  description: {
    zh: '用哑节点统一处理头节点删除，遍历跳过所有等于 val 的节点。',
    en: 'Use a dummy head to uniformly handle head deletion, skipping all matching nodes.',
  },
  tags: ['list'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
