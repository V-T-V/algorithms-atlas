// 左旋v2 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'list-rotate-left-2',
  categoryId: 'list',
  title: { zh: '左旋v2', en: 'Rotate List Left v2' },
  summary: { zh: '把链表向左旋转 k 位。', en: 'Rotate the list left by k positions.' },
  description: {
    zh: 'k mod n，新头是第 k 个，把原尾连回原头。',
    en: 'New head at index k, link old tail to old head. O(n), O(1).',
  },
  tags: ['list', 'rotate'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
