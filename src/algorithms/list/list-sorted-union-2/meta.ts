// 有序并集v2 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'list-sorted-union-2',
  categoryId: 'list',
  title: { zh: '有序并集v2', en: 'Sorted List Union v2' },
  summary: { zh: '求两个有序链表的并集（去重）。', en: 'Union of two sorted lists, dedup.' },
  description: {
    zh: '双指针，每次取较小；相等取其一并都前进。',
    en: 'Two pointers, take smaller; if equal take one. O(n+m), O(n+m).',
  },
  tags: ['list', 'union', 'sorted'],
  complexity: { time: 'O(n+m)', space: 'O(n+m)' },
};
