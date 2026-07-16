// Sorted List Union · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'list-union-sorted',
  categoryId: 'list',
  title: { zh: '有序链表并集', en: 'Sorted List Union' },
  summary: {
    zh: '双指针归并两条升序链表为去重并集。',
    en: 'Two-pointer merge into a deduplicated ascending union.',
  },
  description: {
    zh: '同步扫描两条升序链表，相同时只取一份并去重，得到并集链表。',
    en: 'Scan two ascending lists in parallel, deduplicating equal elements to form the union.',
  },
  tags: ['list', 'two-pointers', 'set'],
  complexity: { time: 'O(m+n)', space: 'O(m+n)' },
};
