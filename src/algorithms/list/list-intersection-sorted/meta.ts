// Sorted List Intersection · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'list-intersection-sorted',
  categoryId: 'list',
  title: { zh: '有序链表交集', en: 'Sorted List Intersection' },
  summary: {
    zh: '双指针求两条升序链表的交集。',
    en: 'Two-pointer intersection of two ascending lists.',
  },
  description: {
    zh: '两条升序链表用同步双指针扫描，相等则收入交集，否则较小者前移。',
    en: 'Scan two ascending lists with parallel pointers; equal values go into the intersection.',
  },
  tags: ['list', 'two-pointers', 'set'],
  complexity: { time: 'O(m+n)', space: 'O(1)' },
};
