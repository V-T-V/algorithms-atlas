// Rotate List Left · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'list-rotate-left',
  categoryId: 'list',
  title: { zh: '链表左旋', en: 'Rotate List Left' },
  summary: {
    zh: '将链表向左旋转 k 位。',
    en: 'Rotate the list left by k positions.',
  },
  description: {
    zh: '左旋 k 位等价于右旋 n − (k mod n) 位，找到新的头节点并断开。',
    en: 'Left rotation by k equals right rotation by n − (k mod n); relocate the head and cut.',
  },
  tags: ['list', 'two-pointers'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
