// 找缺失数字 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'search-missing-number',
  categoryId: 'searching',
  title: { zh: '找缺失数字', en: 'Find Missing Number' },
  summary: {
    zh: '在 0..n 中找出唯一缺失的数字，三种方法（异或、求和、二分）。',
    en: 'Find the single missing number in 0..n via xor, sum, or binary search.',
  },
  description: {
    zh:
      '找缺失数字（Find Missing Number）：给定长度为 n 的数组，包含 0..n 中的 n 个不同整数（恰好缺一个），求缺失者。' +
      '\n三种经典解法：' +
      '\n- **异或法**：`xor(0..n) xor xor(nums) = missing`，`O(n)` 时间 `O(1)` 空间。' +
      '\n- **求和法**：`missing = n(n+1)/2 − Σnums`，注意大数溢出。' +
      '\n- **二分法**（要求有序）：找第一个 `a[i] != i` 的下标即缺失值，`O(log n)`。' +
      '\n本实现提供异或法与求和法两种。',
    en:
      'Find Missing Number: given an array of length n holding n distinct integers from 0..n (exactly one ' +
      'absent), find it. Three classic solutions: ' +
      '\n- **XOR**: xor(0..n) ⊕ xor(nums) = missing; O(n) time, O(1) space. ' +
      '\n- **Sum**: missing = n(n+1)/2 − Σnums (watch overflow). ' +
      '\n- **Binary search** (requires sorted): first index with a[i] ≠ i is the missing value; O(log n). ' +
      'This module provides the XOR and SUM methods.',
  },
  tags: ['searching', 'math', 'xor', 'sum', 'missing'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
