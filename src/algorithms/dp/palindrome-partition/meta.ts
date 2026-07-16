// Palindrome Partition · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'palindrome-partition',
  categoryId: 'dp',
  title: { zh: '回文分割', en: 'Palindrome Partition' },
  summary: {
    zh: '回文分割属于dp类别。',
    en: 'Palindrome Partition is a dp algorithm.',
  },
  description: {
    zh: '回文分割（Palindrome Partition）属于dp类别的算法。',
    en: 'Palindrome Partition is an algorithm in the dp category.',
  },
  tags: ["dp","palindrome"],
  complexity: { time: 'O(n²)', space: 'O(n²)' },
};
