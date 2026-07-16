// 找第一个坏版本 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'search-first-bad-version',
  categoryId: 'searching',
  title: { zh: '找第一个坏版本', en: 'First Bad Version' },
  summary: {
    zh: '在「前好后坏」的版本序列上二分找第一个坏版本（LeetCode 278）。',
    en: 'Binary search the first bad version in a good-then-bad sequence (LeetCode 278).',
  },
  description: {
    zh:
      '找第一个坏版本（First Bad Version，LeetCode 278）：给定 n 个版本 1..n，' +
      '一旦某版本变坏，其后所有版本都坏。提供一个谓词 `isBad(v)`，求第一个坏版本。' +
      '\n- 经典「二分找下界」：lo=1, hi=n，若 mid 坏则答案 ≤ mid（hi=mid），否则 lo=mid+1。' +
      '\n- 收敛时 lo 即为第一个坏版本。时间 `O(log n)`，空间 `O(1)`。' +
      '\n该模式适用于一切「布尔单调性」上的下界搜索。',
    en:
      'First Bad Version (LeetCode 278): given versions 1..n, once a version goes bad all later ones are bad. ' +
      'With a predicate isBad(v), find the first bad version. ' +
      '\n- Classic "lower-bound binary search": lo=1, hi=n; if mid is bad, answer ≤ mid (hi=mid), else lo=mid+1. ' +
      '\n- lo converges to the first bad version. Time O(log n), space O(1). ' +
      'Applies to any lower-bound search over a boolean monotonic predicate.',
  },
  tags: ['searching', 'binary-search', 'predicate', 'lower-bound', 'monotone'],
  complexity: { time: 'O(log n)', space: 'O(1)' },
};
