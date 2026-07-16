// 旋转链表v3 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'list-rotate-3',
  categoryId: 'list',
  title: { zh: '旋转链表v3', en: 'Rotate List Right v3' },
  summary: { zh: '把链表向右旋转 k 位。', en: 'Rotate the list to the right by k positions.' },
  description: {
    zh: 'k mod n，把尾节点连回头形成环，再在第 (n-k) 处断开。',
    en: 'Close the ring, then cut at n-k. O(n), O(1).',
  },
  tags: ['list', 'rotate'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
