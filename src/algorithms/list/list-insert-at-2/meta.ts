// 插入第k位 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'list-insert-at-2',
  categoryId: 'list',
  title: { zh: '插入第k位', en: 'Insert at Index' },
  summary: {
    zh: '在链表第 k 个位置插入值为 x 的节点。',
    en: 'Insert a node with value x at index k.',
  },
  description: {
    zh: '用 dummy 头定位前驱，把新节点接到前驱与后继之间。',
    en: 'Dummy head, locate predecessor, splice. O(n), O(1).',
  },
  tags: ['list', 'insert'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
