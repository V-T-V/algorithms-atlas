// 有序差集v2 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'list-sorted-diff-2',
  categoryId: 'list',
  title: { zh: '有序差集v2', en: 'Sorted List Difference v2' },
  summary: {
    zh: '求 A - B（A 中不在 B 的元素）。',
    en: 'Set difference A minus B for sorted lists.',
  },
  description: {
    zh: '双指针：a<b 时收录 a 并前进，相等都前进。',
    en: 'Two pointers: take a when smaller, skip when equal. O(n+m), O(n).',
  },
  tags: ['list', 'difference', 'sorted'],
  complexity: { time: 'O(n+m)', space: 'O(n)' },
};
