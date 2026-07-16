// 有序交集v2 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'list-sorted-intersect-2',
  categoryId: 'list',
  title: { zh: '有序交集v2', en: 'Sorted List Intersection v2' },
  summary: { zh: '求两个有序链表的交集（共同元素）。', en: 'Intersection of two sorted lists.' },
  description: {
    zh: '双指针同步前进，相等时收录。',
    en: 'Two pointers, collect when equal. O(n+m), O(1).',
  },
  tags: ['list', 'intersection', 'sorted'],
  complexity: { time: 'O(n+m)', space: 'O(n+m)' },
};
