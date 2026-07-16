// 回文链表v3 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'list-palindrome-3',
  categoryId: 'list',
  title: { zh: '回文链表v3', en: 'Palindrome List v3' },
  summary: {
    zh: '快慢指针找中点后反转后半段比较判断回文。',
    en: 'Check palindrome by reversing the second half and comparing.',
  },
  description: {
    zh: '找中点 → 反转后半 → 双指针比较。O(n) 时间 O(1) 空间。',
    en: 'Find mid, reverse second half, compare. O(n), O(1).',
  },
  tags: ['list', 'palindrome', 'two-pointers'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
