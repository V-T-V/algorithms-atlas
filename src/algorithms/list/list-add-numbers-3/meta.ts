// 链表加法v3 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'list-add-numbers-3',
  categoryId: 'list',
  title: { zh: '链表加法v3', en: 'Add Two Numbers v3' },
  summary: {
    zh: '两个逆序链表表示的数相加，返回逆序结果链表。',
    en: 'Add two numbers represented as reversed lists.',
  },
  description: {
    zh: '逐位相加并维护进位。',
    en: 'Digit-wise add with carry. O(max(n,m)), O(max(n,m)).',
  },
  tags: ['list', 'addition', 'arithmetic'],
  complexity: { time: 'O(max(n,m))', space: 'O(max(n,m))' },
};
