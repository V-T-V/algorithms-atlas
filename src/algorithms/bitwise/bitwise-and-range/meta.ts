// 区间按位与 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'bitwise-and-range',
  categoryId: 'bitwise',
  title: { zh: '区间按位与', en: 'Bitwise AND of Range' },
  summary: {
    zh: '求 [left,right] 所有数按位与：保留公共二进制前缀（LeetCode 201）。',
    en: 'Bitwise AND over [left,right]: keep only the common binary prefix (LeetCode 201).',
  },
  description: {
    zh:
      '区间按位与（LeetCode 201）：求 `left & (left+1) & ... & right`。' +
      '\n关键观察：只要区间跨度 ≥ 2^k，第 k 位必然会同时出现 0 和 1，与后变 0。' +
      '\n因此结果只剩 left 与 right 的「公共二进制前缀」。' +
      '\n实现：不断右移 left、right 直到相等（消去末尾不同位），再左移回去。' +
      '\n时间 `O(log n)`，空间 `O(1)`。',
    en:
      'Bitwise AND of range (LeetCode 201): compute left & (left+1) & ... & right. ' +
      '\nKey insight: any bit position spanned by a gap ≥ 2^k will see both 0 and 1, becoming 0 after AND. ' +
      '\nThe result is just the common binary prefix of left and right. ' +
      '\nImplementation: right-shift both until equal (dropping differing low bits), then left-shift back. ' +
      'Time O(log n), space O(1).',
  },
  tags: ['bitwise', 'and', 'range', 'common-prefix', 'O(log n)'],
  complexity: { time: 'O(log n)', space: 'O(1)' },
};
