// Add Two Numbers (Variant) · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'list-add-two-2',
  categoryId: 'list',
  title: { zh: '两数相加（前置补零法）', en: 'Add Two Numbers (Zero-Padding Variant)' },
  summary: {
    zh: '逆序链表表示的两数逐位相加，进位向前。',
    en: 'Add two numbers in reversed-list form digit by digit with carry forward.',
  },
  description: {
    zh: '两条逆序链表从头到尾按位相加，缺位补零，处理进位得到结果逆序链表。',
    en: 'Add reversed digit lists digit by digit, padding zeros, propagating carry.',
  },
  tags: ['list', 'math', 'two-pointers'],
  complexity: { time: 'O(max(m,n))', space: 'O(max(m,n))' },
};
