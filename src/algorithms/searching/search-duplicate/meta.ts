// 搜索重复元素 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'search-duplicate',
  categoryId: 'searching',
  title: { zh: '搜索重复元素', en: 'Search Duplicate' },
  summary: {
    zh: '在含重复的有序数组中用两次二分定位 target 的出现区间与次数。',
    en: "Locate a target's range and count via two binary searches in a sorted array with duplicates.",
  },
  description: {
    zh:
      '搜索重复元素（Search Duplicate）：在**升序且含重复**的数组中求某值 target 的：' +
      '\n- 首次出现下标（最左二分）' +
      '\n- 末次出现下标（最右二分）' +
      '\n- 总出现次数 = 右 − 左 + 1' +
      '\n两次二分各 `O(log n)`，故整体 `O(log n)`，空间 `O(1)`。' +
      '\n典型应用：词频统计、区间计数。',
    en:
      'Search Duplicate: in an ascending array with duplicates, find for a target value: ' +
      '\n- the first occurrence (leftmost binary search), ' +
      '\n- the last occurrence (rightmost binary search), ' +
      '\n- the total count = right − left + 1. ' +
      'Two binary searches at O(log n) each, so O(log n) overall, space O(1). ' +
      'Typical use: term-frequency, range counting.',
  },
  tags: ['searching', 'sorted', 'duplicates', 'leftmost', 'rightmost'],
  complexity: { time: 'O(log n)', space: 'O(1)' },
};
