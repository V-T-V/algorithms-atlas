// 取第k个 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'list-get-index-2',
  categoryId: 'list',
  title: { zh: '取第k个', en: 'Get kth Element' },
  summary: {
    zh: '返回链表第 k 个节点（0-based）的值，越界返回 null。',
    en: 'Return value of the kth node (0-based); null if out of range.',
  },
  description: { zh: '顺序遍历到第 k 个。', en: 'Walk to index k. O(n), O(1).' },
  tags: ['list', 'indexing'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
