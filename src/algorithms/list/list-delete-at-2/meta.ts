// 删除第k位 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'list-delete-at-2',
  categoryId: 'list',
  title: { zh: '删除第k位', en: 'Delete at Index' },
  summary: { zh: '删除链表第 k 个节点（0-based）。', en: 'Delete the node at index k (0-based).' },
  description: { zh: 'dummy 头定位前驱后跳过目标。', en: 'Dummy head, skip target. O(n), O(1).' },
  tags: ['list', 'delete'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
