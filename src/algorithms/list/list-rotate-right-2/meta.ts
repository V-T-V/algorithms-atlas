// Rotate List Right (Variant) · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'list-rotate-right-2',
  categoryId: 'list',
  title: { zh: '链表右旋（成环变种）', en: 'Rotate List Right (Ring Variant)' },
  summary: {
    zh: '将链表首尾相连成环，在断点处切开实现右旋。',
    en: 'Close the list into a ring and cut at the break point to rotate right.',
  },
  description: {
    zh: '先把链表连成环，根据 k mod n 找到断点，断开后得到右旋 k 位的链表。',
    en: 'Link the list into a ring, find the break point from k mod n, then cut to rotate.',
  },
  tags: ['list', 'two-pointers'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
