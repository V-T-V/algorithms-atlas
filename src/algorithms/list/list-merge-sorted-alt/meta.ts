// Merge Two Sorted Lists (Variant) · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'list-merge-sorted-alt',
  categoryId: 'list',
  title: { zh: '合并有序链表（哑节点变种）', en: 'Merge Sorted Lists (Dummy Variant)' },
  summary: {
    zh: '用哑节点逐节点拼接两条升序链表。',
    en: 'Merge two ascending lists node-by-node with a dummy head.',
  },
  description: {
    zh: '哑节点 + 尾指针逐节点比较并拼接两条升序链表，得到合并后的升序链表。',
    en: 'Use a dummy head and a tail pointer to splice two ascending lists into one.',
  },
  tags: ['list', 'two-pointers'],
  complexity: { time: 'O(m+n)', space: 'O(1)' },
};
