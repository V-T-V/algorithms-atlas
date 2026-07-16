// Palindrome Linked List (Variant) · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'list-is-palindrome-2',
  categoryId: 'list',
  title: { zh: '回文链表（快慢+反转后半）', en: 'Palindrome List (Fast/Slow + Reverse Half)' },
  summary: {
    zh: '快慢指针找中点，反转后半段后与上半段逐一比较。',
    en: 'Find midpoint with fast/slow pointers, reverse the second half and compare.',
  },
  description: {
    zh: 'O(1) 空间判断回文：定位中点，原地反转后半段，再与上半段逐节点比对。',
    en: 'O(1) space palindrome check: locate midpoint, reverse second half in place, compare node by node.',
  },
  tags: ['list', 'two-pointers', 'palindrome'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
