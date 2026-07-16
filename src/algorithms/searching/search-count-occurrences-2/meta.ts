// 统计出现次数 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'search-count-occurrences-2',
  categoryId: 'searching',
  title: { zh: '统计出现次数', en: 'Count Occurrences' },
  summary: {
    zh: '用下界与上界二分查找统计有序数组中目标值的出现次数。',
    en: 'Count occurrences of a target in a sorted array via lower-bound and upper-bound.',
  },
  description: {
    zh: '统计有序数组中目标值出现次数：直接线性扫描 O(n)；高效做法是用两次二分找 lower_bound（第一个 >= target）与 upper_bound（第一个 > target），次数 = upper - lower。若 lower == upper 说明不存在，次数为 0。时间 O(log n)，空间 O(1)。本实现即此法。',
    en: 'Count occurrences of a target in a sorted array: a linear scan is O(n); the efficient approach uses two binary searches for lower_bound (first >= target) and upper_bound (first > target); count = upper - lower. If lower == upper the target is absent (count 0). Time O(log n), space O(1). This is that approach.',
  },
  tags: ['searching', 'binary-search', 'count', 'sorted'],
  complexity: { time: 'O(log n)', space: 'O(1)' },
};
