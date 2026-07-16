// Partition List (Variant) · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'list-partition-alt',
  categoryId: 'list',
  title: { zh: '分隔链表（双链变种）', en: 'Partition List (Two-List Variant)' },
  summary: {
    zh: '按基准值把链表拆成小于/大于等于两段再拼接。',
    en: 'Split a list into less-than and greater-than-or-equal sublists, then concatenate.',
  },
  description: {
    zh: '维护两条哑链表，分别收集小于 x 和大于等于 x 的节点，最后拼接形成分隔后的链表。',
    en: 'Maintain two dummy lists for nodes less than x and the rest, then splice them together.',
  },
  tags: ['list', 'two-pointers', 'partition'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
