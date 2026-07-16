// 链表插入排序v2 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'list-insert-sort-2',
  categoryId: 'list',
  title: { zh: '链表插入排序v2', en: 'Insertion Sort List v2' },
  summary: { zh: '对链表做插入排序。', en: 'Insertion sort on a linked list.' },
  description: {
    zh: '维护已排序段，每步把下一个节点插入正确位置。',
    en: 'Maintain sorted prefix, insert next node. O(n^2), O(1).',
  },
  tags: ['list', 'sort', 'insertion-sort'],
  complexity: { time: 'O(n^2)', space: 'O(1)' },
};
