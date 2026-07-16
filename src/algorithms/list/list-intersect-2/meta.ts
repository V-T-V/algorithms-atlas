// 链表交点v2 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'list-intersect-2',
  categoryId: 'list',
  title: { zh: '链表交点v2', en: 'Intersection of Two Lists v2' },
  summary: {
    zh: '双指针走完自身再走对方，相遇即交点。',
    en: 'Two pointers swap heads after reaching the end; meet at the intersection.',
  },
  description: {
    zh: '让两指针走过相同总长（a+b）：pA 走完 A 走 B，pB 走完 B 走 A，必在交点相遇或同时为 null。',
    en: 'Swap traversal: pA walks A then B, pB walks B then A. O(n+m), O(1).',
  },
  tags: ['list', 'intersection', 'two-pointers'],
  complexity: { time: 'O(n+m)', space: 'O(1)' },
};
