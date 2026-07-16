// Linked List Insertion Sort · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'list-sort-insertion',
  categoryId: 'list',
  title: { zh: '链表插入排序', en: 'Linked List Insertion Sort' },
  summary: {
    zh: '逐节点摘下并插入到已排序哑链表中的正确位置。',
    en: 'Detach each node and insert it into the sorted dummy list at the right place.',
  },
  description: {
    zh: '用一个新哑链表，逐个摘原节点按序插入，保持结果链表有序。',
    en: 'Build a sorted dummy list by detaching each original node and inserting in order.',
  },
  tags: ['list', 'sorting', 'insertion'],
  complexity: { time: 'O(n²)', space: 'O(1)' },
};
