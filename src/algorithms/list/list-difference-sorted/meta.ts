// Sorted List Difference · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'list-difference-sorted',
  categoryId: 'list',
  title: { zh: '有序链表差集', en: 'Sorted List Difference' },
  summary: {
    zh: '双指针求 A − B 的差集。',
    en: 'Two-pointer set difference A − B.',
  },
  description: {
    zh: '同步扫描两条升序链表，仅当元素只出现在 A 中而未出现在 B 中时收入差集。',
    en: 'Scan both ascending lists; keep only elements present in A but not in B.',
  },
  tags: ['list', 'two-pointers', 'set'],
  complexity: { time: 'O(m+n)', space: 'O(1)' },
};
