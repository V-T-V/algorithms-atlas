// 查找差值对 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'search-pair-diff',
  categoryId: 'searching',
  title: { zh: '查找差值对', en: 'Pair with Given Difference' },
  summary: {
    zh: '升序数组双指针找差为 d 的一对。',
    en: 'Two-pointer on a sorted array to find a pair with a given difference.',
  },
  description: {
    zh: '差值对查找：升序数组中找两个数 a[i], a[j] 使 a[j] - a[i] = d（d>=0）。双指针：i=0, j=1，若 a[j]-a[i] < d 则 j++，> d 则 i++，相等则返回。注意 i==j 时 j++。时间 O(n)，空间 O(1)。',
    en: 'Pair-with-difference: find two numbers a[i], a[j] in a sorted array with a[j] - a[i] = d (d>=0). Two pointers: i=0, j=1; if a[j]-a[i] < d j++, if > d i++, equal returns. When i==j advance j. Time O(n), space O(1).',
  },
  tags: ['searching', 'two-pointer', 'pair-diff', 'sorted'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
