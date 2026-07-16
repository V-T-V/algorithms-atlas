// 区间内元素计数 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'search-count-range',
  categoryId: 'searching',
  title: { zh: '区间内元素计数', en: 'Count in Range' },
  summary: {
    zh: '用上界/下界二分统计升序数组中值落在 [lo,hi] 的元素数。',
    en: 'Count elements of a sorted array whose values fall in [lo,hi] via upper/lower bounds.',
  },
  description: {
    zh: '区间计数：升序数组中统计值在闭区间 [loVal, hiVal] 内的元素个数。用两次二分：lower = 第一个 >= loVal 的下标，upper = 第一个 > hiVal 的下标，个数 = upper - lower。时间 O(log n)，空间 O(1)。',
    en: 'Range count: count elements of a sorted array with values in the closed interval [loVal, hiVal]. Two binary searches: lower = first index with arr[i] >= loVal, upper = first index with arr[i] > hiVal; count = upper - lower. Time O(log n), space O(1).',
  },
  tags: ['searching', 'binary-search', 'range-count', 'sorted'],
  complexity: { time: 'O(log n)', space: 'O(1)' },
};
