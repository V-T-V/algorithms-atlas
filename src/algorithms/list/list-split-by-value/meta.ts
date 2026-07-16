// Split Linked List by Value · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'list-split-by-value',
  categoryId: 'list',
  title: { zh: '按值分割链表', en: 'Split Linked List by Value' },
  summary: {
    zh: '以 pivot 为界将链表一分为二。',
    en: 'Split a list into two parts by a pivot value.',
  },
  description: {
    zh: '小于 pivot 的节点归入左链表，其余归入右链表，返回两条链表头。',
    en: 'Nodes smaller than the pivot go left, the rest go right; return both heads.',
  },
  tags: ['list', 'partition'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
