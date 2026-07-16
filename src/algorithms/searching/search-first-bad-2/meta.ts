// 查找首个坏版本 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'search-first-bad-2',
  categoryId: 'searching',
  title: { zh: '查找首个坏版本', en: 'First Bad Version' },
  summary: {
    zh: '二分查找单调布尔数组中第一个 true（坏版本）的位置。',
    en: 'Binary search for the first true (bad version) in a monotone boolean array.',
  },
  description: {
    zh: '首个坏版本：n 个版本从某个起全部损坏（isBadVersion(i) 从某版本起恒 true），找第一个坏版本。这是经典的二分边界查找：lo=1, hi=n，mid 坏则候选 ans=mid 向左 hi=mid-1，否则向右 lo=mid+1。时间 O(log n)。本实现接受一个 isBad 谓词函数。',
    en: 'First bad version: n versions are all bad from some point on (isBadVersion(i) is true from some version); find the first bad one. Classic binary boundary search: lo=1, hi=n; if mid is bad set ans=mid and go left (hi=mid-1), else go right. Time O(log n). This implementation takes an isBad predicate.',
  },
  tags: ['searching', 'binary-search', 'boundary', 'monotone'],
  complexity: { time: 'O(log n)', space: 'O(1)' },
};
