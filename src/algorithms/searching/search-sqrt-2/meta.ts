// 整数平方根（二分） · 元数据
import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'search-sqrt-2',
  categoryId: 'searching',
  title: { zh: '整数平方根（二分）', en: 'Integer Square Root (Binary)' },
  summary: {
    zh: '二分查找最大的整数 r 使 r*r <= x。',
    en: 'Binary search for the largest integer r with r*r <= x.',
  },
  description: {
    zh: '整数平方根：给定非负整数 x，找最大的整数 r 使 r^2 <= x。用二分在 [0, x]（或 [0, x/2+1]）中查找：mid^2 <= x 则候选 ans=mid 向右，否则向左。注意 mid*mid 可能溢出，用除法或 BigInt 比较。时间 O(log x)，空间 O(1)。',
    en: 'Integer square root: given a non-negative integer x, find the largest integer r with r^2 <= x. Binary search in [0, x] (or [0, x/2+1]): if mid^2 <= x take ans=mid and go right, else go left. Beware mid*mid overflow; compare via division or BigInt. Time O(log x), space O(1).',
  },
  tags: ['searching', 'binary-search', 'sqrt', 'math'],
  complexity: { time: 'O(log x)', space: 'O(1)' },
};
